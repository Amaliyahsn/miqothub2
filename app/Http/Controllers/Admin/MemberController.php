<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\MemberPaymentAccepted;
use App\Mail\MemberRegistrationRejected; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class MemberController extends Controller
{
    public function index()
    {
        $members = User::where('role', 'member')
            // Menambahkan eager loading agar data course langsung terbawa
            ->with(['transactions.courses']) 
            ->latest()
            ->get()
            ->map(function ($member) {
                // Memastikan status 'pending' atau 'rejected' membawa URL bukti pembayaran jika ada
                $relevantTrx = $member->transactions
                    ->whereIn('status', ['pending', 'rejected'])
                    ->first();
                    
                if ($relevantTrx && $relevantTrx->bukti_pembayaran && Storage::disk('public')->exists($relevantTrx->bukti_pembayaran)) {
                    $relevantTrx->bukti_url = asset('storage/' . $relevantTrx->bukti_pembayaran);
                }
                return $member;
            });

        // Mengambil semua kelas untuk dropdown di modal tambah/edit
        $allCourses = Course::select('id', 'nama', 'harga', 'batch')
            ->orderBy('nama', 'asc')
            ->get();

        return Inertia::render('Admin/Members/Index', [
            'members' => $members,
            'allCourses' => $allCourses, // Nama variabel disamakan dengan props di React
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'pekerjaan' => 'nullable|string|max:255',
            'umur' => 'nullable|integer|min:1',
            'alamat' => 'nullable|string',
            'status' => 'nullable|in:menikah,belum',
            'status_akun' => 'required|in:pending,aktif,suspen',
            'course_id' => 'nullable|exists:courses,id', 
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'member',
            'pekerjaan' => $request->pekerjaan,
            'umur' => $request->umur,
            'alamat' => $request->alamat,
            'status' => $request->status,
            'status_akun' => $request->status_akun,
        ]);

        // Jika admin memilih kelas saat membuat user manual
        if ($request->filled('course_id')) {
            $this->enrollCourse($request, $user);
        }

        return back()->with('success', 'Member baru berhasil ditambahkan.');
    }

    public function verify(Request $request, User $member)
    {
        $member->update(['status_akun' => 'aktif']);

        // PERBAIKAN: Menambahkan 'rejected' ke array pencarian.
        // Ini memungkinkan proses "Unreject" dengan cara memverifikasi ulang transaksi yang sudah ditolak.
        $transaction = Transaction::where('user_id', $member->id)
            ->whereIn('status', ['pending', 'rejected']) 
            ->with('courses')
            ->first();

        if ($transaction) {
            $transaction->update([
                'status' => 'verified',
                'total_harga' => $transaction->courses->sum('harga')
            ]);

            $firstCourse = $transaction->courses->first();
            
            // Pengiriman email jika Mailable sudah siap
            if (class_exists(MemberPaymentAccepted::class)) {
                Mail::to($member->email)->send(new MemberPaymentAccepted($member, $firstCourse));
            }
        }

        return back()->with('success', 'Pembayaran diverifikasi dan akun telah aktif.');
    }

    public function reject(User $member)
    {
        // Tetap simpan sebagai suspen agar data tidak hilang
        $member->update(['status_akun' => 'suspen']);

        $transaction = Transaction::where('user_id', $member->id)
            ->where('status', 'pending')
            ->with('courses')
            ->first();

        if ($transaction) {
            $courseNames = $transaction->courses->pluck('nama')->implode(', ');
            $transaction->update(['status' => 'rejected']);

            // Jika Mailable penolakan sudah dibuat, aktifkan baris di bawah:
            // Mail::to($member->email)->send(new MemberRegistrationRejected($member, $courseNames));
        }

        return back()->with('success', 'Pendaftaran telah ditolak dan akun ditangguhkan.');
    }

    public function update(Request $request, User $member)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $member->id,
            'pekerjaan' => 'nullable|string|max:255',
            'umur' => 'nullable|integer|min:1',
            'alamat' => 'nullable|string',
            'status' => 'nullable|in:menikah,belum',
            'status_akun' => 'required|in:pending,aktif,suspen',
            'password' => 'nullable|string|min:8', 
            'foto_profile' => 'nullable|image|max:2048',
            'class_id' => 'nullable|exists:courses,id', // Untuk update akses kelas
        ]);

        $data = $request->only(['name', 'email', 'pekerjaan', 'umur', 'alamat', 'status', 'status_akun']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('foto_profile')) {
            if ($member->foto_profile) {
                Storage::disk('public')->delete($member->foto_profile);
            }
            $data['foto_profile'] = $request->file('foto_profile')->store('profile_photos', 'public');
        }

        $member->update($data);

        // Jika ada penambahan kelas di form edit
        if ($request->filled('class_id')) {
            $this->enrollCourse($request, $member);
        }

        return back()->with('success', 'Profil member berhasil diperbarui.');
    }

    public function destroy(User $member)
    {
        if ($member->foto_profile) {
            Storage::disk('public')->delete($member->foto_profile);
        }
        $member->delete();
        return back()->with('success', 'Data member dihapus permanen.');
    }

    public function enrollCourse(Request $request, User $member)
    {
        // Mengakomodasi key 'course_id' (dari modal tambah) atau 'class_id' (dari form edit)
        $targetId = $request->course_id ?? $request->class_id;

        if (!$targetId) {
            return; 
        }

        $course = Course::findOrFail($targetId);

        // Cek apakah user sudah punya akses ke kelas ini (menghindari duplikasi)
        $exists = $member->transactions()->whereHas('courses', function($q) use ($course) {
            $q->where('courses.id', $course->id);
        })->exists();

        if ($exists) {
            return;
        }

        $transaction = Transaction::create([
            'user_id' => $member->id,
            'kode_transaksi' => 'MANUAL-' . date('Ymd') . '-' . strtoupper(uniqid()),
            'total_harga' => $course->harga ?? 0, 
            'status' => 'verified',
            'bukti_pembayaran' => 'Input Admin',
        ]);

        $transaction->courses()->attach($course->id, [
            'harga_saat_beli' => $course->harga ?? 0
        ]);
    }

    public function unenrollCourse(User $member, $courseId)
    {
        $transactions = $member->transactions()->whereHas('courses', function($q) use ($courseId) {
            $q->where('courses.id', $courseId);
        })->get();

        foreach ($transactions as $trx) {
            $trx->courses()->detach($courseId);
            // Jika transaksi tidak punya kursus lain lagi, hapus transaksinya
            if ($trx->courses()->count() === 0) {
                $trx->delete();
            }
        }

        return back()->with('success', 'Akses kelas berhasil dicabut.');
    }
}