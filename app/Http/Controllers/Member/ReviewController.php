<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'required|string|min:5|max:500',
        ]);

        // Cek apakah user sudah pernah kasih review
        $exists = Review::where('user_id', Auth::id())->exists();

        if ($exists) {
            return back()->with('error', 'Anda sudah memberikan testimoni sebelumnya.');
        }

        Review::create([
            'user_id' => Auth::id(),
            'rating' => $request->rating,
            'komentar' => $request->komentar,
            // Otomatis tampilkan jika bintang 4 atau 5 (bisa disesuaikan)
            'tampilkan_di_landing' => $request->rating >= 4 ? true : false,
        ]);

        return back()->with('success', 'Terima kasih atas ulasan Anda!');
    }
}