<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminPaymentNotification;
use Carbon\Carbon;

class CourseController extends Controller
{
    /**
     * Menampilkan daftar kelas yang sudah dibeli oleh member
     */
    public function index()
    {
        $myCourses = Auth::user()->courses()->get()->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            
            // Tambahkan status expired untuk info di dashboard member
            $course->is_expired = $course->tanggal_selesai ? Carbon::parse($course->tanggal_selesai)->isPast() : false;
            
            return $course;
        });

        return Inertia::render('Member/Courses/Index', [
            'myCourses' => $myCourses
        ]);
    }

    /**
     * Menampilkan detail materi kelas
     */
    public function show($id)
    {
        $user = Auth::user();
        
        $course = Course::with(['chapters' => function($query) {
            $query->orderBy('created_at', 'asc'); 
        }, 'chapters.materials' => function($query) {
            $query->orderBy('created_at', 'asc'); 
        }])->findOrFail($id);

        // 1. Cek apakah user memiliki kelas ini
        $hasCourse = $user->courses()->where('courses.id', $id)->exists();
        if (!$hasCourse) {
            abort(403, 'Akses Ditolak. Anda belum membeli kelas ini.');
        }

        // 2. PROTEKSI: Cek apakah masa akses materi sudah berakhir
        if ($course->tanggal_selesai && Carbon::parse($course->tanggal_selesai)->isPast()) {
            return redirect()->route('member.courses.index')
                ->with('error', 'Maaf, masa aktif akses materi untuk kelas ini telah berakhir.');
        }

        return Inertia::render('Member/Courses/Show', [
            'course' => $course
        ]);
    }

    /**
     * Menampilkan katalog kelas yang tersedia untuk dibeli
     */
    public function catalog()
    {
        $user = auth()->user();
        
        // Ambil ID kelas yang sudah dibeli atau sedang diproses (pending)
        $ownedCourseIds = Transaction::where('user_id', $user->id)
            ->whereIn('status', ['verified', 'pending'])
            ->with('courses')
            ->get()
            ->pluck('courses.*.id')
            ->flatten()
            ->unique()
            ->toArray();

        // Ambil kelas yang:
        // - Statusnya 'onsale'
        // - BELUM dibeli user
        // - BELUM melewati tanggal_selesai (Otomatis tutup pendaftaran)
        $availableCourses = Course::where('status', 'onsale')
            ->whereNotIn('id', $ownedCourseIds)
            ->where(function ($query) {
                $query->whereNull('tanggal_selesai')
                      ->orWhere('tanggal_selesai', '>=', now());
            })
            ->get()
            ->map(function ($course) {
                $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
                return $course;
            });

        return Inertia::render('Member/Courses/Catalog', [
            'courses' => $availableCourses
        ]);
    }

    /**
     * Proses pengajuan pembelian kelas
     */
    public function purchase(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $course = Course::findOrFail($request->course_id);

        // PROTEKSI DOUBLE: Cek lagi apakah kelas sudah expired tepat sebelum bayar
        if ($course->tanggal_selesai && Carbon::parse($course->tanggal_selesai)->isPast()) {
            return redirect()->back()->with('error', 'Gagal! Pendaftaran untuk kelas ini sudah ditutup.');
        }

        $buktiPath = $request->file('bukti_pembayaran')->store('bukti_transfer', 'public');

        $transaction = Transaction::create([
            'user_id' => auth()->id(),
            'kode_transaksi' => 'INV-' . date('Ymd') . '-' . strtoupper(uniqid()),
            'total_harga' => $course->harga,
            'bukti_pembayaran' => $buktiPath,
            'status' => 'pending', 
        ]);

        $transaction->courses()->attach($course->id, ['harga_saat_beli' => $course->harga]);

        // Email ke Admin
        $dataEmail = [
            'nama_member' => auth()->user()->name,
            'nama_kelas' => $course->nama,
            'metode_pembayaran' => $request->payment_method ?? 'Transfer/QRIS',
        ];

        Mail::to('amaliyahsyahidatunnimah27@gmail.com')->send(new AdminPaymentNotification($dataEmail));

        return redirect()->route('dashboard')->with('success', 'Pengajuan kelas berhasil dikirim! Mohon tunggu verifikasi Admin.');
    }
}