<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;

class PaymentCallbackController extends Controller
{
    public function handleNotification(Request $request)
    {
        $payload = $request->all();
        Log::info('Midtrans Notification Received: ', $payload);

        // 1. Validasi Keberadaan Data Utama
        if (!isset($payload['order_id']) || !isset($payload['signature_key'])) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        $orderId = $payload['order_id'];
        $statusCode = $payload['status_code'] ?? '200';
        $grossAmount = $payload['gross_amount'] ?? '0';
        $transactionStatus = $payload['transaction_status'];
        $signatureKey = $payload['signature_key'];

        // PERBAIKAN 1: Bypass khusus untuk Test Notification dari Dashboard Midtrans
        // Agar saat ditekan tombol "Test" di dashboard, langsung mengembalikan 200 OK.
        if (str_starts_with($orderId, 'payment_notif_test_')) {
            Log::info('Menerima Test Notification dari Midtrans.');
            return response()->json(['status' => 'success', 'message' => 'Test notification received'], 200);
        }
        
        // 2. Validasi Signature Key
        $serverKey = config('services.midtrans.server_key') ?? env('MIDTRANS_SERVER_KEY');
        $localSignature = hash("sha512", $orderId . $statusCode . $grossAmount . $serverKey);
        
        if ($localSignature !== $signatureKey) {
            Log::warning("Signature Key tidak valid untuk Order: $orderId");
            return response()->json(['message' => 'Invalid Signature'], 403);
        }

        // 3. Proses Database
        try {
            DB::transaction(function () use ($orderId, $transactionStatus) {
                // Cari transaksi
                $transaction = Transaction::where('kode_transaksi', $orderId)
                                          ->orWhere('kode_transaksi', 'like', "%$orderId%")
                                          ->first();

                // PERBAIKAN 2: Jangan gunakan "throw new Exception" jika order tidak ada.
                // Cukup log peringatan dan hentikan eksekusi transaksi database.
                if (!$transaction) {
                    Log::warning("Midtrans Order ID tidak ditemukan di DB: $orderId");
                    return; // Keluar dari closure DB::transaction secara aman
                }

                // Logika Status
                $newStatus = match ($transactionStatus) {
                    'capture', 'settlement' => 'verified',
                    'deny', 'expire', 'cancel' => 'rejected',
                    default => 'pending',
                };

                $transaction->update(['status' => $newStatus]);

                // Update status akun user jika transaksi diverifikasi
                if ($transaction->user && $transaction->user->role !== 'admin') {
                    // PERBAIKAN 3: Ubah 'active' menjadi 'aktif' untuk mengatasi Error SQL Data Truncated.
                    // Pastikan ini sesuai dengan nilai ENUM di database MySQL Anda (misal: 'aktif' dan 'nonaktif')
                    $userStatus = ($newStatus === 'verified') ? 'aktif' : 'nonaktif'; 
                    $transaction->user->update(['status_akun' => $userStatus]);
                }
            });

            // PERBAIKAN 4: Selalu pastikan merespons dengan 200 OK
            return response()->json(['status' => 'success', 'message' => 'OK'], 200);

        } catch (Exception $e) {
            Log::error('Error callback Midtrans: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}