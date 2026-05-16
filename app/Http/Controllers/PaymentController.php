<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function __construct()
    {
        // Konfigurasi otomatis mengambil dari file .env
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = env('MIDTRANS_IS_SANITIZED', true);
        Config::$is3ds = env('MIDTRANS_IS_3DS', true);
    }

    public function createToken(Request $request)
    {
        // ID Unik Transaksi
        $orderId = 'MIQOT-' . time() . '-' . rand(10, 99);
        
        // Ambil nominal dari frontend
        $grossAmount = $request->input('amount'); 
        if (!$grossAmount || $grossAmount <= 0) {
            return response()->json(['error' => 'Nominal pembayaran tidak valid atau kosong.'], 400);
        }

        // Proteksi input identitas diri
        $firstName = $request->input('name', 'Siswa MiqotHub');
        $email = $request->input('email', 'siswa@miqothub.com');

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $grossAmount,
            ],
            'customer_details' => [
                'first_name' => empty($firstName) ? 'Siswa MiqotHub' : $firstName,
                'email' => empty($email) ? 'siswa@miqothub.com' : $email,
            ],
        ];

        try {
            // 🔥 SOLUSI MUTLAK: Gunakan stream context global untuk mematikan verifikasi SSL peer di localhost
            // Ini aman dan tidak akan merusak array header (10023) milik SDK Midtrans
            if (!Config::$isProduction) {
                stream_context_set_default([
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                    ],
                ]);
            }

            // Meminta Snap Token ke API Sandbox Midtrans
            $snapToken = Snap::getSnapToken($params);
            
            return response()->json([
                'snap_token' => $snapToken,
                'order_id' => $orderId
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Midtrans API Error: ' . $e->getMessage()
            ], 500);
        }
    }
}