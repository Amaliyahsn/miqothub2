<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // 1. Cek User berdasarkan email yang diinput SEBELUM login dieksekusi
        $userCheck = User::where('email', $request->email)->first();

        // 2. LOGIKA PEMBLOKIRAN DEVICE (Khusus Member)
        if ($userCheck && $userCheck->role === 'member') {
            
            // Ambil batas waktu session dari config (default: 120 menit diubah ke detik)
            $lifetime = config('session.lifetime') * 60; 

            // Cek apakah ada session yang masih aktif untuk user ini di database
            $activeSession = DB::table('sessions')
                ->where('user_id', $userCheck->id)
                ->where('last_activity', '>=', time() - $lifetime)
                ->first();

            // Jika ada session aktif, langsung TOLAK login-nya (Blokir)
            if ($activeSession) {
                return back()->withErrors([
                    'email' => 'Akun Anda sedang digunakan di perangkat atau browser lain. Harap logout dari perangkat sebelumnya.',
                ])->onlyInput('email');
            }
        }

        // 3. Jika aman (tidak ada device aktif), lanjutkan proses Login bawaan
        $request->authenticate();

        $user = Auth::user();

        // Pengecekan status akun Member
        if ($user->role === 'member') {
            if ($user->status_akun === 'pending') {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return back()->withErrors([
                    'email' => 'Akun Anda belum diverifikasi. Admin sedang mengecek pembayaran Anda. Harap tunggu atau hubungi Admin.',
                ]);
            }

            if ($user->status_akun === 'suspen') {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return back()->withErrors([
                    'email' => 'Akun Anda telah ditangguhkan. Silakan hubungi Admin.',
                ]);
            }
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}