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
     * Proses pendaftaran, penyimpanan user, dan transaksi menggunakan Midtrans.
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
            
            // Validasi input tambahan dari Midtrans di frontend
            'midtrans_order_id' => 'required|string',
            'midtrans_status' => 'required|string|in:success',
            'snap_token' => 'nullable|string', 
        ]);

        DB::transaction(function () use ($request) {
            // 🔥 PERBAIKAN: Mengubah 'active' menjadi 'aktif' agar sesuai dengan opsi ENUM di MySQL lokal kamu
            // Catatan: Jika kolom bertipe boolean, ganti 'aktif' di bawah ini menjadi angka 1 tanpa tanda kutip.
            $user = User::create([
                'name' => $request->name, 
                'email' => $request->email,
                'password' => Hash::make($request->password), 
                'role' => 'member',
                'alamat' => $request->alamat, 
                'pekerjaan' => $request->pekerjaan,
                'status' => $request->status, 
                'umur' => $request->umur,
                'status_akun' => 'pending', // 🌟 DIUBAH: Agar masuk ke antrean "Registrasi Baru"
            ]);

            // Hitung Total Harga dari semua kelas yang dipilih
            $courses = Course::whereIn('id', $request->course_ids)->get();
            $totalHarga = $courses->sum('harga');

            // Menyimpan transaksi dengan mengakali kolom 'bukti_pembayaran' agar tidak NOT NULL error
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'kode_transaksi' => $request->midtrans_order_id, 
                'total_harga' => $totalHarga,
                'bukti_pembayaran' => 'Midtrans (Lunas)', // Penanda untuk admin bahwa ini dibayar otomatis
                'status' => 'pending', // 🌟 DIUBAH: Menjadi pending agar admin bisa memeriksa dan klik ACC manual
                'snap_token' => $request->snap_token ?? null, 
            ]);

            // Siapkan data pivot (id_kelas => harga_saat_beli)
            $pivotData = [];
            foreach ($courses as $course) {
                $pivotData[$course->id] = ['harga_saat_beli' => $course->harga];
            }
            
            // Simpan banyak kelas sekaligus ke transaksi
            $transaction->courses()->attach($pivotData);

            // ==========================================
            // FITUR KIRIM EMAIL KE ADMIN
            // ==========================================
            $namaKelas = $courses->pluck('nama')->implode(', ');
            $dataEmail = [
                'nama_member' => $request->name,
                'nama_kelas' => $namaKelas,
                'metode_pembayaran' => 'Midtrans Payment Gateway (Otomatis)',
            ];

            // Mengirim email ke email Admin
            Mail::to('miqothub@gmail.com')->send(new AdminPaymentNotification($dataEmail));
            // ==========================================

            event(new Registered($user));
        });

        return redirect()->route('login')->with('status', 'Pendaftaran dan pembayaran berhasil! Akun Anda sedang dalam proses verifikasi oleh Admin. Silakan tunggu beberapa saat.');
    }
}