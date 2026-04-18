<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with(['transactions' => function ($query) {
            $query->where('status', 'verified')->with('user:id,name,email');
        }])->latest()->get()->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            // Menambahkan status expired agar bisa dibaca di frontend (opsional)
            $course->is_expired = $course->tanggal_selesai && \Carbon\Carbon::parse($course->tanggal_selesai)->isPast();
            return $course;
        });

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Courses/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'harga_coret' => 'nullable|numeric|min:0',
            'batch' => 'required|string|max:50',
            'status' => 'required|in:onsale,offsale',
            'kuota' => 'nullable|integer|min:1',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date', // Validasi tanggal selesai
            'link_grup_wa' => 'nullable|url',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'fitur' => 'nullable|array', 
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('course_thumbnails', 'public');
        }

        $slug = Str::slug($request->nama . '-' . $request->batch);

        Course::create([
            'nama' => $request->nama,
            'slug' => $slug,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'harga_coret' => $request->harga_coret ?? 0,
            'batch' => $request->batch,
            'status' => $request->status,
            'kuota' => $request->kuota,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai, // Simpan ke database
            'link_grup_wa' => $request->link_grup_wa,
            'fitur' => $request->fitur, 
            'thumbnail' => $thumbnailPath,
        ]);

        return redirect()->route('admin.courses.index')->with('success', 'Kelas baru berhasil ditambahkan!');
    }

    public function update(Request $request, Course $course)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'harga_coret' => 'nullable|numeric|min:0',
            'batch' => 'required|string|max:50',
            'status' => 'required|in:onsale,offsale',
            'kuota' => 'nullable|integer|min:1',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date', // Validasi tanggal selesai saat update
            'link_grup_wa' => 'nullable|url',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'fitur' => 'nullable|array',
        ]);

        $data = $request->except(['thumbnail']);
        $data['slug'] = Str::slug($request->nama . '-' . $request->batch); 
        $data['harga_coret'] = $request->harga_coret ?? 0;

        if ($request->hasFile('thumbnail')) {
            if ($course->thumbnail) {
                Storage::disk('public')->delete($course->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('course_thumbnails', 'public');
        }

        // Karena menggunakan $request->except(['thumbnail']), 
        // maka field 'tanggal_selesai' sudah otomatis ada di dalam array $data
        $course->update($data);

        return redirect()->route('admin.courses.index')->with('success', 'Data Kelas berhasil diperbarui!');
    }

    public function destroy(Course $course)
    {
        if ($course->thumbnail) {
            Storage::disk('public')->delete($course->thumbnail);
        }
        $course->delete();

        return redirect()->route('admin.courses.index')->with('success', 'Kelas berhasil dihapus permanen.');
    }
}