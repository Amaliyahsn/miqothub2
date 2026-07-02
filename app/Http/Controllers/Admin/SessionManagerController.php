<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SessionManagerController extends Controller
{
    /**
     * Menampilkan daftar semua session aktif yang terikat dengan User
     */
    public function index()
    {
        $activeSessions = DB::table('sessions')
            ->whereNotNull('user_id')
            ->join('users', 'sessions.user_id', '=', 'users.id')
            ->select([
                'sessions.id as session_id',
                'sessions.ip_address',
                'sessions.user_agent',
                'sessions.last_activity',
                'users.name',
                'users.email',
                'users.role'
            ])
            ->orderBy('sessions.last_activity', 'desc')
            ->get()
            ->map(function ($session) {
                // Format tanggal aktivitas agar ramah dibaca
                $session->last_active_human = date('d M Y, H:i:s', $session->last_activity) . ' WIB';
                $session->device = $this->parseUserAgent($session->user_agent);
                
                // 🔒 AMAN: Encode ID string session ke Base64 agar tidak rusak saat dilempar ke URL rute
                $session->hashed_id = base64_encode($session->session_id);
                
                return $session;
            });

        return Inertia::render('Admin/Sessions/Index', [
            'activeSessions' => $activeSessions
        ]);
    }

    /**
     * Menghapus session tertentu berdasarkan ID Session (Kick User)
     */
    public function destroy($hashedId)
    {
        // 🔒 AMAN: Kembalikan Base64 ke ID string session asli sebelum dihapus
        $sessionId = base64_decode($hashedId);

        // Eksekusi hapus baris di tabel sessions database
        DB::table('sessions')->where('id', $sessionId)->delete();

        return back()->with('success', 'Sesi login berhasil diputuskan. Pengguna otomatis ter-logout.');
    }

    /**
     * Helper untuk mendeteksi nama perangkat operasional
     */
    private function parseUserAgent($userAgent)
    {
        if (preg_match('/(iPhone|iPad|iPod)/i', $userAgent)) return 'Apple iOS Device';
        if (preg_match('/Android/i', $userAgent)) return 'Android Device';
        if (preg_match('/Macintosh/i', $userAgent)) return 'Mac (Safari/Chrome)';
        if (preg_match('/Windows/i', $userAgent)) return 'Windows PC';
        
        return 'PC / Perangkat Lain';
    }
}