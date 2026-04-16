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
        // Hanya hitung user yang memiliki role 'member'
        $totalMember = User::where('role', 'member')->count(); 
        
        $modulAktif = Course::count(); 
        $lulusUjian = ExerciseScore::count(); 
        
        $totalUjian = ExerciseScore::count();
        $tingkatKelulusan = $totalUjian > 0 ? round(($lulusUjian / $totalUjian) * 100) : 0;

        // 2. Mengambil 5 Member Terbaru (Kecualikan Admin)
        $recentMembers = User::where('role', 'member') // Filter hanya role member
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'pekerjaan' => 'Pelajar/Mahasiswa', 
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