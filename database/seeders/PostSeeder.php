<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil user (admin / random)
        $user = User::first();

        // kalau belum ada user, bikin 1
        if (!$user) {
            $user = User::factory()->create();
        }

        $posts = [
            [
                'title' => 'Kegiatan Zoom Brainstorming Batch 5',
                'category' => 'Kegiatan',
                'content' => '<p>Kegiatan brainstorming bersama mentor berjalan dengan sangat interaktif dan membantu peserta memahami strategi ujian.</p>',
            ],
            [
                'title' => 'Try Out Nasional MiqotHub',
                'category' => 'Event',
                'content' => '<p>Try out nasional diikuti oleh ratusan peserta dari seluruh Indonesia dengan hasil yang sangat memuaskan.</p>',
            ],
            [
                'title' => 'Sharing Alumni Lolos PPIH',
                'category' => 'Inspirasi',
                'content' => '<p>Alumni berbagi pengalaman dan tips sukses menghadapi seleksi PPIH.</p>',
            ],
            [
                'title' => 'Launching Batch Baru 2026',
                'category' => 'Info',
                'content' => '<p>MiqotHub resmi membuka batch terbaru dengan kurikulum yang lebih update.</p>',
            ],
            [
                'title' => 'Workshop Strategi CAT One Shot',
                'category' => 'Workshop',
                'content' => '<p>Workshop intensif untuk meningkatkan peluang lolos dalam sekali tes.</p>',
            ],
        ];

        foreach ($posts as $post) {
            Post::create([
                'user_id' => $user->id, // 🔥 INI YANG WAJIB
                'title' => $post['title'],
                'slug' => Str::slug($post['title']),
                'category' => $post['category'],
                'content' => $post['content'],
                'image' => null,
            ]);
        }
    }
}