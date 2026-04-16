<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{

    public function index()
{
    $members = User::where('role', 'member')
        ->with(['transactions' => function($query) {
            // Hanya ambil transaksi yang statusnya pending untuk verifikasi
            $query->where('status', 'pending')->with('courses');
        }])
        ->latest()
        ->get()
        ->map(function ($member) {
            // Logika bukti_url tetap ada untuk menampilkan struk
            $pendingTrx = $member->transactions->where('status', 'pending')->first();
            if ($pendingTrx && $pendingTrx->bukti_pembayaran) {
                $pendingTrx->bukti_url = asset('storage/' . $pendingTrx->bukti_pembayaran);
            }
            return $member;
        });

    // Kita hapus $allCourses dari sini agar React tidak punya pilihan kelas lain selain yang dibeli
    return Inertia::render('Admin/Members/Index', [
        'members' => $members,
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
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => 'member',
            'pekerjaan' => $request->pekerjaan,
            'umur' => $request->umur,
            'alamat' => $request->alamat,
            'status' => $request->status,
            'status_akun' => $request->status_akun,
        ]);

        return back()->with('success', 'Member baru berhasil ditambahkan secara manual.');
    }

public function verify(Request $request, User $member)
{
    // Aktifkan akun member
    $member->update(['status_akun' => 'aktif']);

    // Cari transaksi yang pending milik member ini
    $transaction = Transaction::where('user_id', $member->id)
        ->where('status', 'pending')
        ->with('courses')
        ->first();

    if ($transaction) {
        // 1. Update status transaksi menjadi verified
        $transaction->update(['status' => 'verified']);
        
        // 2. Ambil semua ID kelas yang ada di dalam transaksi tersebut
        // Kita tidak perlu lagi $request->course_ids karena kita pakai data dari transaksi asli
        $courseIds = $transaction->courses->pluck('id')->toArray();

        // 3. Update total_harga berdasarkan jumlah harga kelas di dalam transaksi itu
        $transaction->update(['total_harga' => $transaction->courses->sum('harga')]);

        // Opsional: Jika kamu punya sistem email yang kita bahas di awal, 
        // taruh logic kirim email di sini.
    }

    return back()->with('success', 'Pembayaran diverifikasi dan akun member telah aktif!');
}

    

    
    public function reject(User $member)
    {
        $member->update(['status_akun' => 'suspen']);

        Transaction::where('user_id', $member->id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

        return back()->with('success', 'Pendaftaran ditolak/ditangguhkan.');
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
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'pekerjaan' => $request->pekerjaan,
            'umur' => $request->umur,
            'alamat' => $request->alamat,
            'status' => $request->status,
            'status_akun' => $request->status_akun,
        ];

        
        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        
        if ($request->hasFile('foto_profile')) {
            
            if ($member->foto_profile) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($member->foto_profile);
            }
            $data['foto_profile'] = $request->file('foto_profile')->store('profile_photos', 'public');
        }

        $member->update($data);

        return back()->with('success', 'Profil lengkap member berhasil diperbarui.');
    }

    public function destroy(User $member)
    {
        $member->delete();
        return back()->with('success', 'Data member dihapus permanen.');
    }

    public function enrollCourse(Request $request, User $member)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $course = \App\Models\Course::find($request->course_id);

        
        $transaction = \App\Models\Transaction::create([
            'user_id' => $member->id,
            'kode_transaksi' => 'MANUAL-' . date('Ymd') . '-' . strtoupper(uniqid()),
            'total_harga' => 0, 
            'status' => 'verified',
            'bukti_pembayaran' => 'Diinput Manual Oleh Admin',
        ]);

        
        $transaction->courses()->attach($course->id, [
            'harga_saat_beli' => $course->harga
        ]);

        return back()->with('success', "Berhasil! Member telah diberikan akses ke kelas {$course->nama}.");
    }

    
    
    
    public function unenrollCourse(User $member, $courseId)
    {
        
        $transactions = $member->transactions()->whereHas('courses', function($q) use ($courseId) {
            $q->where('courses.id', $courseId);
        })->get();

        foreach ($transactions as $trx) {
            
            $trx->courses()->detach($courseId);
            
            
            if ($trx->courses()->count() === 0) {
                $trx->delete();
            }
        }

        return back()->with('success', 'Akses member dari kelas tersebut berhasil dicabut.');
    }
}