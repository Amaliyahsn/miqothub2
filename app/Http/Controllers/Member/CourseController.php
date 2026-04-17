<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
// TAMBAHAN: Import Mail dan Mailable
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminPaymentNotification;

class CourseController extends Controller
{
    
    public function index()
    {
        $myCourses = Auth::user()->courses()->get()->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            return $course;
        });

        return Inertia::render('Member/Courses/Index', [
            'myCourses' => $myCourses
        ]);
    }

    
    public function show($id)
    {
        $user = Auth::user();
        
        $hasCourse = $user->courses()->where('courses.id', $id)->exists();

        if (!$hasCourse) {
            abort(403, 'Akses Ditolak. Anda belum membeli atau menyelesaikan pembayaran untuk kelas ini.');
        }

        $course = Course::with(['chapters' => function($query) {
            $query->orderBy('created_at', 'asc'); 
        }, 'chapters.materials' => function($query) {
            $query->orderBy('created_at', 'asc'); 
        }])->findOrFail($id);

        return Inertia::render('Member/Courses/Show', [
            'course' => $course
        ]);
    }

    
    public function catalog()
    {
        $user = auth()->user();
        
        $ownedCourseIds = \App\Models\Transaction::where('user_id', $user->id)
            ->whereIn('status', ['verified', 'pending'])
            ->with('courses')
            ->get()
            ->pluck('courses.*.id')
            ->flatten()
            ->unique()
            ->toArray();

        $availableCourses = \App\Models\Course::where('status', 'onsale')
            ->whereNotIn('id', $ownedCourseIds)
            ->get()
            ->map(function ($course) {
                $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
                return $course;
            });

        return \Inertia\Inertia::render('Member/Courses/Catalog', [
            'courses' => $availableCourses
        ]);
    }

    
    public function purchase(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $course = \App\Models\Course::find($request->course_id);
        $buktiPath = $request->file('bukti_pembayaran')->store('bukti_transfer', 'public');

        $transaction = \App\Models\Transaction::create([
            'user_id' => auth()->id(),
            'kode_transaksi' => 'INV-' . date('Ymd') . '-' . strtoupper(uniqid()),
            'total_harga' => $course->harga,
            'bukti_pembayaran' => $buktiPath,
            'status' => 'pending', 
        ]);

        $transaction->courses()->attach($course->id, ['harga_saat_beli' => $course->harga]);

        // ==========================================
        // FITUR BARU: KIRIM EMAIL KE ADMIN
        // ==========================================
        $dataEmail = [
            'nama_member' => auth()->user()->name,
            'nama_kelas' => $course->nama,
            'metode_pembayaran' => $request->payment_method ?? 'Transfer/QRIS',
        ];

        // Mengirim email ke email Admin
        Mail::to('amaliyahsyahidatunnimah27@gmail.com')->send(new AdminPaymentNotification($dataEmail));
        // ==========================================

        return redirect()->route('dashboard')->with('success', 'Pengajuan kelas berhasil dikirim! Mohon tunggu Admin memverifikasi bukti transfer Anda.');
    }
}