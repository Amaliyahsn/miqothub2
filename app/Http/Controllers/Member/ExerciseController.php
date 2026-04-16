<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\ExerciseScore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    public function show(Material $material)
    {
        // ✅ PERBAIKAN 1: Wajib meload chapter agar course_id bisa diakses di React
        $material->load('chapter');

        $exercise = $material->exercise()->with('questions')->firstOrFail();
        $user = Auth::user();

        // Cek apakah user sudah pernah mengerjakan kuis ini
        $existingScore = ExerciseScore::where('user_id', $user->id)
                                      ->where('exercise_id', $exercise->id)
                                      ->first();

        // Jika sudah ada nilai, langsung arahkan ke halaman Result
        if ($existingScore) {
            return Inertia::render('Member/Exercises/Result', [
                'material' => $material,
                'exercise' => $exercise,
                'score' => $existingScore
            ]);
        }

        // Jika kuis ditutup oleh instruktur
        if (!$exercise->is_active) {
            return Inertia::render('Member/Exercises/Closed', [
                'material' => $material,
                'exercise' => $exercise
            ]);
        }

        // Cek password kuis jika ada
        $sessionKey = 'unlocked_exercise_' . $exercise->id;
        if ($exercise->password && !session()->has($sessionKey)) {
            return Inertia::render('Member/Exercises/Unlock', [
                'material' => $material,
                'exercise' => $exercise
            ]);
        }

        // Sembunyikan jawaban benar dari payload yang dikirim ke frontend (keamanan)
        $questions = $exercise->questions->map(function($q) {
            return collect($q)->except(['jawaban_benar', 'created_at', 'updated_at']);
        });

        // Tampilkan halaman pengerjaan kuis
        return Inertia::render('Member/Exercises/Quiz', [
            'material' => $material,
            'exercise' => $exercise,
            'questions' => $questions
        ]);
    }

    public function verifyPassword(Request $request, Material $material)
    {
        $exercise = $material->exercise;
        if ($request->password === $exercise->password) {
            session()->put('unlocked_exercise_' . $exercise->id, true);
            return redirect()->route('member.exercise.show', $material->id);
        }
        return back()->withErrors(['password' => 'Password yang Anda masukkan salah.']);
    }

    public function submit(Request $request, Material $material)
    {
        $exercise = $material->exercise;
        $questions = $exercise->questions;
        $userAnswers = $request->input('answers', []);

        $benar = 0;
        
        // Hitung jawaban benar
        foreach ($questions as $q) {
            if (isset($userAnswers[$q->id]) && $userAnswers[$q->id] === $q->jawaban_benar) {
                $benar++;
            }
        }

        $totalSoal = $questions->count();
        $nilai = $totalSoal > 0 ? round(($benar / $totalSoal) * 100) : 0;

        // Simpan nilai ke database
        \App\Models\ExerciseScore::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'exercise_id' => $exercise->id,
            ],
            [
                'skor' => $nilai,
                'jumlah_benar' => $benar,
                'total_soal' => $totalSoal,
                'dikerjakan_pada' => now(), 
            ]
        );

        // ✅ PERBAIKAN 2: Redirect kembali ke 'show', karena fungsi 'show' 
        // otomatis mendeteksi nilai dan memunculkan halaman Result
        return redirect()->route('member.exercise.show', $material->id)
                         ->with('success', 'Latihan berhasil diselesaikan!');
    }

    // Fungsi untuk mengulang kuis
    public function reset(Material $material)
    {
        $exercise = $material->exercise;
        $user = auth()->user();

        // Cari dan hapus skor kuis ini untuk user yang sedang login
        \App\Models\ExerciseScore::where('user_id', $user->id)
            ->where('exercise_id', $exercise->id)
            ->delete();

        // Redirect kembali ke halaman kuis (otomatis akan masuk ke mode Quiz dari awal)
        return redirect()->route('member.exercise.show', $material->id);
    }
}