<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction; // Sesuaikan jika nama model transaksimu berbeda
use Carbon\Carbon;

class FinanceController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        
        // Asumsi kolom total harga adalah 'total_harga' dan status yang sah adalah 'approved'
        $pendapatanHariIni = Transaction::where('status', 'approved')->whereDate('created_at', $today)->sum('total_harga');
        $pendapatanMingguIni = Transaction::where('status', 'approved')->whereBetween('created_at', [$today->copy()->startOfWeek(), $today->copy()->endOfWeek()])->sum('total_harga');
        $pendapatanBulanIni = Transaction::where('status', 'approved')->whereMonth('created_at', $today->month)->whereYear('created_at', $today->year)->sum('total_harga');
        $pendapatanTahunIni = Transaction::where('status', 'approved')->whereYear('created_at', $today->year)->sum('total_harga');

        // DATA GRAFIK 7 HARI TERAKHIR
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $total = Transaction::where('status', 'approved')->whereDate('created_at', $date)->sum('total_harga');
            
            $chartData[] = [
                'name' => $date->translatedFormat('d M'), 
                'pendapatan' => $total
            ];
        }

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