<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; // Pastikan ini ada
use Inertia\Inertia;
use App\Models\Transaction; 
use Carbon\Carbon;

class FinanceController extends Controller
{
    // Tambahkan parameter Request $request di sini
    public function index(Request $request)
    {
        $today = Carbon::today();
        
        // 1. STATISTIK CEPAT KOTAK ATAS (Tetap Fix / Tidak Terpengaruh Filter)
        $pendapatanHariIni = Transaction::where('status', 'verified')->whereDate('created_at', $today)->sum('total_harga');
        $pendapatanMingguIni = Transaction::where('status', 'verified')->whereBetween('created_at', [$today->copy()->startOfWeek(), $today->copy()->endOfWeek()])->sum('total_harga');
        $pendapatanBulanIni = Transaction::where('status', 'verified')->whereMonth('created_at', $today->month)->whereYear('created_at', $today->year)->sum('total_harga');
        $pendapatanTahunIni = Transaction::where('status', 'verified')->whereYear('created_at', $today->year)->sum('total_harga');

        // 2. LOGIKA PENERIMA TANGGAL DARI REACT (Filter Dinamis)
        // Jika tidak ada klik filter, otomatis ambil 7 hari terakhir
        $startDate = $request->input('start_date', Carbon::today()->subDays(6)->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::today()->format('Y-m-d'));

        // Pastikan mencakup waktu 00:00:00 sampai 23:59:59
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // Hitung Total Uang Khusus di Rentang Tanggal Tersebut
        $totalFiltered = Transaction::where('status', 'verified')
            ->whereBetween('created_at', [$start, $end])
            ->sum('total_harga');

        // 3. GENERATE DATA GRAFIK DINAMIS
        $diffInDays = $start->diffInDays($end);
        $chartData = [];

        // Jika user narik kalender lebih dari 90 hari, otomatis kelompokkan per bulan
        if ($diffInDays > 90) {
            $transactions = Transaction::where('status', 'verified')
                ->whereBetween('created_at', [$start, $end])
                ->selectRaw('YEAR(created_at) year, MONTH(created_at) month, SUM(total_harga) as total')
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();

            foreach ($transactions as $t) {
                $dateObj = Carbon::createFromDate($t->year, $t->month, 1);
                $chartData[] = [
                    'name' => $dateObj->translatedFormat('M Y'),
                    'pendapatan' => (int) $t->total
                ];
            }
        } else {
            // Jika kurang dari 90 hari, kelompokkan per hari
            $transactions = Transaction::where('status', 'verified')
                ->whereBetween('created_at', [$start, $end])
                ->selectRaw('DATE(created_at) date, SUM(total_harga) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->pluck('total', 'date');

            // Looping agar hari yang kosong penjualannya (Rp 0) tetap masuk ke grafik
            for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
                $dateString = $date->format('Y-m-d');
                $chartData[] = [
                    'name' => $date->translatedFormat('d M'), 
                    'pendapatan' => (int) ($transactions[$dateString] ?? 0)
                ];
            }
        }

        // Return Data ke React Inertia (Menggunakan 'Finance' agar tidak 404)
        return Inertia::render('Finance', [
            'keuangan' => [
                'hari_ini' => $pendapatanHariIni,
                'minggu_ini' => $pendapatanMingguIni,
                'bulan_ini' => $pendapatanBulanIni,
                'tahun_ini' => $pendapatanTahunIni,
            ],
            'chartData' => $chartData,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_filtered' => (int) $totalFiltered
            ]
        ]);
    }
}