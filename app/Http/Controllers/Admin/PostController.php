<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Posts/Index', [
            'posts' => Post::with('user')->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('posts', 'public');
        }

        $validated['slug'] = Str::slug($request->title);
        $validated['user_id'] = auth()->id();

        Post::create($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil diterbitkan!');
    }

    /**
     * 🔥 PERBAIKAN: Menambahkan method update untuk menangani edit data & file thumbnail berita
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Cek jika admin mengunggah file thumbnail baru
        if ($request->hasFile('image')) {
            // Hapus gambar lama dari storage public agar tidak menimbun sampah file
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            // Simpan gambar baru
            $validated['image'] = $request->file('image')->store('posts', 'public');
        } else {
            // Jika tidak upload gambar baru, tetap pertahankan path gambar yang lama
            unset($validated['image']);
        }

        // Regenerasi slug otomatis jika judulnya diubah oleh admin
        $validated['slug'] = Str::slug($request->title);

        // Eksekusi pembaruan data ke database
        $post->update($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Berita berhasil diperbarui!');
    }

    public function destroy(Post $post)
    {
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();
        return back();
    }
}