<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentCallbackController extends Controller
{
    /**
     * Menangani webhook notification dari Midtrans.
     */
    public function handleNotification(Request $request)
    {
        $payload = $request->all();
        
        // Log notifikasi untuk keperluan debugging jika terjadi kendala
        Log::info('Midtrans Notification Received: ', $payload);

        $orderId = $payload['order_id'];
        $statusCode = $payload['status_code'];
        $grossAmount = $payload['gross_amount'];
        $transactionStatus = $payload['transaction_status'];
        $type = $payload['payment_type'];
        $serverKey = env('MIDTRANS_SERVER_KEY');

        // 🔥 PERBAIKAN 1: Validasi Keamanan Signature Key dari Midtrans
        $localSignature = hash("sha512", $orderId . $statusCode . $grossAmount . $serverKey);
        if ($localSignature !== $payload['signature_key']) {
            return response()->json([
                'status' => 'error',
                'message' => 'Signature Key tidak valid!'
            ], 403);
        }

        // Cari transaksi berdasarkan order_id / kode_transaksi
        $transaction = Transaction::where('kode_transaksi', $orderId)->first();

        if (!$transaction) {
            return response()->json([
                'status' => 'error',
                'message' => 'Transaksi tidak ditemukan'
            ], 404);
        }

        // Cari user pemilik transaksi tersebut
        $user = User::find($transaction->user_id);

        // 🔥 PERBAIKAN 2: Sesuaikan string status dengan ENUM database ('pending', 'verified', 'rejected')
        if ($transactionStatus == 'capture') {
            if ($type == 'credit_card') {
                if ($payload['fraud_status'] == 'challenge') {
                    $transaction->status = 'pending';
                } else {
                    $transaction->status = 'verified'; // Sukses = verified
                    if ($user) $user->update(['status_akun' => 'active']);
                }
            }
        } elseif ($transactionStatus == 'settlement') {
            // Pembayaran sukses (QRIS, VA, Gopay, dll)
            $transaction->status = 'verified'; // Sukses = verified
            if ($user) $user->update(['status_akun' => 'active']);
            
        } elseif ($transactionStatus == 'pending') {
            // Menunggu pembayaran
            $transaction->status = 'pending';
            
        } elseif (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
            // Pembayaran gagal / kedaluwarsa
            $transaction->status = 'rejected'; // Gagal = rejected
            if ($user) $user->update(['status_akun' => 'pending']); 
        }

        // Simpan perubahan ke database
        $transaction->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Callback Midtrans berhasil diproses'
        ], 200);
    }
}