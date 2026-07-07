<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Snap;
use Midtrans\Config;
use App\Models\Course;

class PaymentController extends Controller
{
    // 🔥 PERBAIKAN UTAMA: Mengubah nama method menjadi createToken agar sinkron dengan Route!
    public function createToken(Request $request)
    {
        // 1. Validasi input (Ditambahkan aturan untuk memvalidasi course_ids)
        $request->validate([
            'amount' => 'required|numeric',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20', 
            'course_ids' => 'required|array|min:1', // ✅ Wajib mengirimkan array ID kelas dari frontend
            'course_ids.*' => 'exists:courses,id',
        ]);

        try {
            // 2. BENTENG PERTAHANAN UTAMA: Validasi Kuota sebelum meminta Token Snap Midtrans
            $courses = Course::whereIn('id', $request->course_ids)
                ->withCount(['transactions' => function ($query) {
                    $query->where('status', 'verified');
                }])
                ->get();

            foreach ($courses as $course) {
                if ($course->kuota !== null) {
                    if ($course->transactions_count >= $course->kuota) {
                        return response()->json([
                            'message' => "Maaf, pendaftaran dibatalkan karena kuota untuk kelas '{$course->nama}' sudah penuh.",
                            'error' => 'quota_full'
                        ], 422); // Gunakan status 422 Unprocessable Entity
                    }
                }
            }

            // 3. Set Konfigurasi Midtrans
            Config::$serverKey = env('MIDTRANS_SERVER_KEY');
            
            // 🔥 PERBAIKAN: Gunakan filter_var agar string "false" di .env dibaca murni sebagai boolean false oleh PHP
            $isProduction = env('MIDTRANS_IS_PRODUCTION', true); // Default ke true jika tidak di-set
            Config::$isProduction = filter_var($isProduction, FILTER_VALIDATE_BOOLEAN); 
            
            Config::$isSanitized = true;
            Config::$is3ds = true;

            // Generate Order ID kustom
            $orderId = 'MIQOT-' . time() . '-' . rand(100, 999);

            // 4. Susun Payload
            $payload = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => (int) $request->amount,
                ],
                'customer_details' => [
                    'first_name'    => $request->name,
                    'email'         => $request->email,
                    'phone'         => $request->phone, 
                ],
                // 🔥 TAMBAHAN: Paksa redirect ke URL yang benar di sini
                'callbacks' => [
                    'finish' => route('login'), // Anda bisa ganti ke route('register.success') jika punya
                ],
            ];

            // 5. Ambil Token dari SDK Midtrans
            $snapToken = Snap::getSnapToken($payload);

            return response()->json([
                'snap_token' => $snapToken,
                'order_id' => $orderId
            ]);
            
        } catch (\Exception $e) {
            // Jika crash, return error message aslinya agar kelihatan salahnya di mana
            return response()->json([
                'message' => 'Terjadi kesalahan sistem gateway',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}