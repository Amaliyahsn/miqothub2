<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction; 
use Carbon\Carbon;

class FinanceController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        
        // PERBAIKAN 1: Ubah 'approved' menjadi 'verified' sesuai Model Database kamu
        $pendapatanHariIni = Transaction::where('status', 'verified')->whereDate('created_at', $today)->sum('total_harga');
        $pendapatanMingguIni = Transaction::where('status', 'verified')->whereBetween('created_at', [$today->copy()->startOfWeek(), $today->copy()->endOfWeek()])->sum('total_harga');
        $pendapatanBulanIni = Transaction::where('status', 'verified')->whereMonth('created_at', $today->month)->whereYear('created_at', $today->year)->sum('total_harga');
        $pendapatanTahunIni = Transaction::where('status', 'verified')->whereYear('created_at', $today->year)->sum('total_harga');

        // DATA GRAFIK 7 HARI TERAKHIR
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            
            // PERBAIKAN 1: Ubah 'approved' menjadi 'verified'
            $total = Transaction::where('status', 'verified')->whereDate('created_at', $date)->sum('total_harga');
            
            $chartData[] = [
                'name' => $date->translatedFormat('d M'), 
                'pendapatan' => $total
            ];
        }

        // PERBAIKAN 2: Tambahkan 'Admin/' di depan 'Finance' agar Inertia bisa menemukan file React-nya
        // (Asumsi file Finance.jsx kamu ada di folder resources/js/Pages/Admin/)
        return Inertia::render('Finance', [
            'keuangan' => [
                'hari_ini' => $pendapatanHariIni,
                'minggu_ini' => $pendapatanMingguIni,
                'bulan_ini' => $pendapatanBulanIni,
                'tahun_ini' => $pendapatanTahunIni,
            ],
            'chartData' => $chartData
        ]);
    }
}