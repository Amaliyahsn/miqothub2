<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // 🔥 HAPUS SEMUA REVIEW LAMA
        Review::truncate();

        // 🔥 PASTIKAN ADA 6 USER
        if (User::count() < 6) {
            User::factory(6)->create();
        }

        // Ambil 6 user
        $users = User::inRandomOrder()->take(6)->get();

        $komentarList = [
            "Materinya sangat membantu, penjelasan mentor mudah dipahami!",
            "Try out-nya mirip banget dengan soal asli, jadi lebih siap.",
            "Platformnya enak dipakai, fiturnya lengkap.",
            "Sangat worth it untuk persiapan ujian!",
            "Mentornya responsif dan berpengalaman.",
            "Belajar jadi lebih terarah dan terstruktur."
        ];

        foreach ($users as $index => $user) {
            Review::create([
                'user_id' => $user->id,
                'rating' => rand(4, 5),
                'komentar' => $komentarList[$index % count($komentarList)],
                'tampilkan_di_landing' => true,
            ]);
        }
    }
}