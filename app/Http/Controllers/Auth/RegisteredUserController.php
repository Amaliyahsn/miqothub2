<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
// TAMBAHAN: Import Mail dan Mailable
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminPaymentNotification;

class RegisteredUserController extends Controller
{
    /**
     * Tampilkan halaman registrasi beserta daftar kelas yang aktif.
     */
    public function create(): Response
    {
        // Hanya ambil kelas yang statusnya 'onsale'
        $courses = Course::where('status', 'onsale')->latest()->get();

        return Inertia::render('Auth/Register', [
            'courses' => $courses
        ]);
    }

    /**
     * Proses pendaftaran, penyimpanan user, dan transaksi.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
    'password' => ['required', 'confirmed', Rules\Password::defaults()],
    'alamat' => 'required|string',
    'pekerjaan' => 'required|string|max:255',
    'status' => 'required|in:menikah,belum',
    'umur' => 'required|integer|min:1|max:120',

    'course_ids' => 'required|array|min:1', 
    'course_ids.*' => 'exists:courses,id',
    'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg|max:2048',
]);

        DB::transaction(function () use ($request) {
            $user = User::create([
    'name' => $request->name, 
    'email' => $request->email,
    'password' => Hash::make($request->password), 
    'role' => 'member',
    'alamat' => $request->alamat, 
    'pekerjaan' => $request->pekerjaan,
    'status' => $request->status, 
    'umur' => $request->umur, // 🔥 TAMBAHAN DI SINI
    'status_akun' => 'pending', 
]);

            $buktiPath = $request->file('bukti_pembayaran')->store('bukti_transfer', 'public');

            // Hitung Total Harga dari semua kelas yang dipilih
            $courses = Course::whereIn('id', $request->course_ids)->get();
            $totalHarga = $courses->sum('harga');

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'kode_transaksi' => 'INV-' . date('Ymd') . '-' . strtoupper(uniqid()),
                'total_harga' => $totalHarga,
                'bukti_pembayaran' => $buktiPath,
                'status' => 'pending',
            ]);

            // Siapkan data pivot (id_kelas => harga_saat_beli)
            $pivotData = [];
            foreach ($courses as $course) {
                $pivotData[$course->id] = ['harga_saat_beli' => $course->harga];
            }
            
            // Simpan banyak kelas sekaligus ke transaksi
            $transaction->courses()->attach($pivotData);

            // ==========================================
            // FITUR BARU: KIRIM EMAIL KE ADMIN
            // ==========================================
            $namaKelas = $courses->pluck('nama')->implode(', ');
            $dataEmail = [
                'nama_member' => $request->name,
                'nama_kelas' => $namaKelas,
                'metode_pembayaran' => $request->payment_method ?? 'Transfer/QRIS',
            ];

            // Mengirim email ke email Admin
            Mail::to('amaliyahsyahidatunnimah27@gmail.com')->send(new AdminPaymentNotification($dataEmail));
            // ==========================================

            event(new Registered($user));
        });

        return redirect()->route('login')->with('status', 'Pendaftaran berhasil! Akun dan bukti pembayaran Anda sedang dicek oleh Admin.');
    }
}