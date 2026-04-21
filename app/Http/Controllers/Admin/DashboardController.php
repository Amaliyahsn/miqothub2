<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Course;
use App\Models\ExerciseScore;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Hitung Data Statistik
        // PERBAIKAN: Hanya hitung user role 'member' yang status akunnya 'aktif'
        $totalMember = User::where('role', 'member')
            ->where('status_akun', 'aktif')
            ->count(); 
        
        // PERBAIKAN LOGIKA KELAS AKTIF:
        // Hitung kelas yang statusnya 'onsale' DAN (tanggal_selesai masih kosong ATAU belum lewat hari ini)
        $modulAktif = Course::where('status', 'onsale')
            ->where(function($query) {
                $query->whereNull('tanggal_selesai')
                      ->orWhereDate('tanggal_selesai', '>=', now());
            })->count(); 

        $lulusUjian = ExerciseScore::count(); 
        
        $totalUjian = ExerciseScore::count();
        $tingkatKelulusan = $totalUjian > 0 ? round(($lulusUjian / $totalUjian) * 100) : 0;

        // 2. Mengambil Semua Member (Kecualikan Admin) untuk fitur scroll di React
        $recentMembers = User::where('role', 'member') 
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'pekerjaan' => $user->pekerjaan,
                    'tanggal_daftar' => $user->created_at ? $user->created_at->diffForHumans() : 'Baru saja',
                    // Gunakan kolom status_akun dari database
                    'status' => $user->status_akun === 'aktif' ? 'Aktif' : 'Menunggu',
                ];
            });

        // 3. Render ke halaman React sambil mengirim data
        return Inertia::render('Dashboard', [
            'statsData' => [
                'totalMember' => number_format($totalMember),
                'modulAktif' => number_format($modulAktif),
                'lulusUjian' => number_format($lulusUjian),
                'tingkatKelulusan' => $tingkatKelulusan . '%',
            ],
            'recentMembers' => $recentMembers
        ]);
    }
}