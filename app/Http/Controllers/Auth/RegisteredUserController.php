<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail;
use App\Mail\AdminPaymentNotification;
use App\Mail\MemberRegistrationNotification; // 🔥 IMPORT MAILBARU UNTUK MEMBER
use Illuminate\Support\Facades\Log;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        // ✅ Perbaikan: Ambil data kelas beserta hitungan transaksi terverifikasi secara real-time
        $courses = Course::where('status', 'onsale')
            ->withCount(['transactions' => function ($query) {
                $query->where('status', 'verified');
            }])
            ->latest()
            ->get()
            ->map(function ($course) {
                // Sediakan flag penanda kuota penuh agar form pendaftaran publik (Inertia/React) bisa men-disable opsi ini
                $course->is_full = $course->kuota !== null && $course->transactions_count >= $course->kuota;
                return $course;
            });

        return Inertia::render('Auth/Register', ['courses' => $courses]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'nullable|string|max:20', 
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'alamat' => 'required|string',
            'pekerjaan' => 'required|string|max:255',
            'status' => 'required|in:menikah,belum',
            'umur' => 'required|integer|min:1|max:120',
            'course_ids' => 'required|array|min:1', 
            'course_ids.*' => 'exists:courses,id',
            'midtrans_order_id' => 'required|string',
            'midtrans_status' => 'required|string|in:success',
            'snap_token' => 'nullable|string', 
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // ✅ Perbaikan optimasi query & double check kuota menggunakan withCount untuk perlindungan ekstra
                $courses = Course::whereIn('id', $request->course_ids)
                    ->withCount(['transactions' => function ($query) {
                        $query->where('status', 'verified');
                    }])
                    ->get();

                foreach ($courses as $course) {
                    if ($course->kuota !== null) {
                        if ($course->transactions_count >= $course->kuota) {
                            throw \Illuminate\Validation\ValidationException::withMessages([
                                'course_ids' => "Maaf, kuota kelas '{$course->nama}' sudah penuh.",
                            ]);
                        }
                    }
                }

                // 1. Buat User
                $user = User::create([
                    'name' => $request->name, 
                    'email' => $request->email,
                    'phone' => $request->phone ?? '-',
                    'password' => Hash::make($request->password), 
                    'role' => 'member',
                    'alamat' => $request->alamat, 
                    'pekerjaan' => $request->pekerjaan,
                    'status' => $request->status, 
                    'umur' => $request->umur,
                    'status_akun' => 'pending', 
                ]);

                // 3. Buat Transaksi
                $totalHarga = $courses->sum(function($course) {
                    return ($course->harga_coret > 0 && $course->harga_coret < $course->harga) 
                        ? $course->harga_coret 
                        : $course->harga;
                });

                $transaction = Transaction::create([
                    'user_id' => $user->id,
                    'kode_transaksi' => $request->midtrans_order_id, 
                    'total_harga' => $totalHarga,
                    'bukti_pembayaran' => 'Midtrans (Lunas)',
                    'status' => 'pending', 
                    'snap_token' => $request->snap_token ?? null, 
                ]);

                $pivotData = [];
                foreach ($courses as $course) {
                    $price = ($course->harga_coret > 0 && $course->harga_coret < $course->harga) 
                        ? $course->harga_coret 
                        : $course->harga;
                    $pivotData[$course->id] = ['harga_saat_beli' => $price]; 
                }
                $transaction->courses()->attach($pivotData);

                // 4. Kirim Email & Event
                $dataEmail = [
                    'nama_member' => $request->name,
                    'email_member' => $request->email,
                    'nama_kelas' => $courses->pluck('nama')->implode(', '),
                    'metode_pembayaran' => 'Midtrans Payment Gateway (Otomatis)',
                ];

                try {
                    Mail::to('miqothub@gmail.com')->send(new AdminPaymentNotification($dataEmail));
                } catch (\Exception $mailException) {
                    Log::warning('Email notifikasi admin gagal dikirim: ' . $mailException->getMessage());
                }

                try {
                    Mail::to($request->email)->send(new MemberRegistrationNotification($dataEmail));
                } catch (\Exception $mailMemberException) {
                    Log::warning('Email notifikasi pendaftar baru gagal dikirim: ' . $mailMemberException->getMessage());
                }

                event(new Registered($user));

                return redirect()->route('login')->with('success', 'Pendaftaran berhasil! Akun Anda sedang diverifikasi.');
            }); 

        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e; // Lempar kembali ke frontend agar error muncul di form
        } catch (\Exception $e) {
            Log::error('Gagal Registrasi: ' . $e->getMessage());
            return back()->withErrors(['email' => 'Terjadi kesalahan sistem. Silakan hubungi admin.']);
        }
    }

    /**
     * Method Kroscek Email & No HP Sebelum Pembayaran Midtrans
     */
    public function checkExistingData(Request $request)
    {
        if ($request->filled('email')) {
            $emailExists = User::where('email', $request->email)->exists();
            if ($emailExists) {
                return response()->json([
                    'exists' => true,
                    'message' => 'Email sudah terdaftar di sistem. Silakan gunakan email lain atau silakan login.'
                ]);
            }
        }

        if ($request->filled('phone') && $request->phone !== '-') {
            $phoneExists = User::where('phone', $request->phone)->exists();
            if ($phoneExists) {
                return response()->json([
                    'exists' => true,
                    'message' => 'Nomor WhatsApp sudah terdaftar. Silakan gunakan nomor lain.'
                ]);
            }
        }

        return response()->json([
            'exists' => false
        ]);
    }
}