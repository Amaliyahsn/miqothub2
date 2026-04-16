<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Material;
use App\Models\Exercise; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; 
use Inertia\Inertia;

class CurriculumController extends Controller
{
    public function show(Course $course)
    {
        $course->load(['chapters.materials']);
        return Inertia::render('Admin/Courses/Curriculum', [
            'course' => $course
        ]);
    }

    
    
    
    public function storeChapter(Request $request, Course $course)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'urutan' => 'required|integer|min:0',
        ]);

        $course->chapters()->create($request->all());
        return back()->with('success', 'Bab baru berhasil ditambahkan!');
    }

    public function updateChapter(Request $request, Chapter $chapter)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'urutan' => 'required|integer|min:0',
        ]);

        $chapter->update($request->all());
        return back()->with('success', 'Bab berhasil diperbarui!');
    }

    public function destroyChapter(Chapter $chapter)
    {
        $chapter->delete();
        return back()->with('success', 'Bab dan seluruh materinya berhasil dihapus.');
    }

    
    
    
    
    
    
    public function storeMaterial(Request $request, Chapter $chapter)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'tipe' => 'required|in:video,pdf,text_only',
            'deskripsi' => 'nullable|string',
            'link_video' => 'nullable|url|required_if:tipe,video',
            'file_path' => 'nullable|file|mimes:pdf|max:10240|required_if:tipe,pdf',
            'durasi' => 'nullable|string|max:50',
            'urutan' => 'required|integer|min:0',
        ]);

        $filePath = null;
        if ($request->hasFile('file_path')) {
            $file = $request->file('file_path');
            $fileName = \Illuminate\Support\Str::slug($request->judul) . '-' . time() . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('course_materials', $fileName, 'public');
        }

        $chapter->materials()->create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tipe' => $request->tipe,
            'link_video' => $request->link_video,
            'file_path' => $filePath,
            'durasi' => $request->durasi,
            'is_preview' => $request->is_preview ?? false,
            'urutan' => $request->urutan,
        ]);

        return back()->with('success', 'Materi berhasil ditambahkan!');
    }

    
    
    
    public function storeMeeting(Request $request, Chapter $chapter)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_waktu_meet' => 'required|date',
            'link_meet' => 'required|url',
            'password_meet' => 'nullable|string|max:50',
            'durasi' => 'nullable|string|max:50',
            'urutan' => 'required|integer|min:0',
        ]);

        $chapter->materials()->create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tipe' => 'pertemuan',
            'tanggal_waktu_meet' => $request->tanggal_waktu_meet,
            'link_meet' => $request->link_meet,
            'password_meet' => $request->password_meet,
            'durasi' => $request->durasi,
            'is_preview' => $request->is_preview ?? false,
            'urutan' => $request->urutan,
        ]);

        return back()->with('success', 'Jadwal Pertemuan berhasil ditambahkan!');
    }

    
    
    
    public function storeExercise(Request $request, Chapter $chapter)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'durasi' => 'nullable|string|max:50',
            'urutan' => 'required|integer|min:0',
        ]);

        
        $exercise = \App\Models\Exercise::create([
            'judul' => 'Kuis: ' . $request->judul,
            'deskripsi' => $request->deskripsi,
            'is_active' => true,
            'max_attempts' => 1,
        ]);

        $chapter->materials()->create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tipe' => 'latihan',
            'exercise_id' => $exercise->id,
            'durasi' => $request->durasi,
            'is_preview' => $request->is_preview ?? false,
            'urutan' => $request->urutan,
        ]);

        return back()->with('success', 'Modul Latihan berhasil dibuat!');
    }

    public function updateMaterial(Request $request, Material $material)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'tipe' => 'required|in:video,pdf,text_only,pertemuan,latihan',
            'deskripsi' => 'nullable|string',
            'link_video' => 'nullable|url|required_if:tipe,video',
            'file_path' => 'nullable|file|mimes:pdf|max:10240',
            'durasi' => 'nullable|string|max:50',
            'is_preview' => 'boolean',
            'urutan' => 'required|integer|min:0',
            
            'tanggal_waktu_meet' => 'nullable|date|required_if:tipe,pertemuan',
            'link_meet' => 'nullable|url|required_if:tipe,pertemuan',
            'password_meet' => 'nullable|string|max:50',
        ]);

        $data = $request->except(['file_path']); 
        $data['is_preview'] = $request->is_preview ?? false;

        
        if ($request->hasFile('file_path')) {
            if ($material->file_path) {
                Storage::disk('public')->delete($material->file_path);
            }
            $file = $request->file('file_path');
            $fileName = Str::slug($request->judul) . '-' . time() . '.' . $file->getClientOriginalExtension();
            $data['file_path'] = $file->storeAs('course_materials', $fileName, 'public');
        }

        
        if ($request->tipe !== 'pdf' && $material->file_path) {
            Storage::disk('public')->delete($material->file_path);
            $data['file_path'] = null;
        }

        
        if ($request->tipe === 'latihan' && !$material->exercise_id) {
            $exercise = Exercise::create([
                'judul' => 'Kuis: ' . $request->judul,
                'deskripsi' => $request->deskripsi,
                'is_active' => true,
                'max_attempts' => 1,
            ]);
            $data['exercise_id'] = $exercise->id;
        }

        $material->update($data);

        
        if ($request->tipe === 'latihan' && $material->exercise_id) {
            $material->exercise->update([
                'judul' => 'Kuis: ' . $request->judul,
                'deskripsi' => $request->deskripsi,
            ]);
        }

        return back()->with('success', 'Materi berhasil diperbarui!');
    }

    public function destroyMaterial(Material $material)
    {
        if ($material->file_path) {
            Storage::disk('public')->delete($material->file_path);
        }
        
        
        if ($material->tipe === 'latihan' && $material->exercise_id) {
            $material->exercise()->delete();
        }

        $material->delete();
        return back()->with('success', 'Materi berhasil dihapus.');
    }

    
    
    
    public function reorderChapter(Request $request, Chapter $chapter)
    {
        $direction = $request->direction;
        $course = $chapter->course;

        
        $chapters = $course->chapters()->orderBy('urutan', 'asc')->orderBy('id', 'asc')->get();

        
        $currentIndex = $chapters->search(function ($c) use ($chapter) {
            return $c->id === $chapter->id;
        });

        
        if ($direction === 'up' && $currentIndex > 0) {
            $swapIndex = $currentIndex - 1;
        } elseif ($direction === 'down' && $currentIndex < $chapters->count() - 1) {
            $swapIndex = $currentIndex + 1;
        } else {
            return back(); 
        }

        
        $temp = $chapters[$currentIndex];
        $chapters[$currentIndex] = $chapters[$swapIndex];
        $chapters[$swapIndex] = $temp;

        
        foreach ($chapters as $index => $c) {
            $c->update(['urutan' => $index + 1]);
        }

        return back();
    }

    public function reorderMaterial(Request $request, Material $material)
    {
        $direction = $request->direction;
        $chapter = $material->chapter;

        
        $materials = $chapter->materials()->orderBy('urutan', 'asc')->orderBy('id', 'asc')->get();

        
        $currentIndex = $materials->search(function ($m) use ($material) {
            return $m->id === $material->id;
        });

        
        if ($direction === 'up' && $currentIndex > 0) {
            $swapIndex = $currentIndex - 1;
        } elseif ($direction === 'down' && $currentIndex < $materials->count() - 1) {
            $swapIndex = $currentIndex + 1;
        } else {
            return back();
        }

        
        $temp = $materials[$currentIndex];
        $materials[$currentIndex] = $materials[$swapIndex];
        $materials[$swapIndex] = $temp;

        
        foreach ($materials as $index => $m) {
            $m->update(['urutan' => $index + 1]);
        }

        return back();
    }

public function streamPdf(Material $material)
{
    if (!auth()->check()) {
        abort(403, 'Unauthorized');
    }

    // Cek file
    if (Storage::disk('local')->exists($material->file_path)) {
        $path = storage_path('app/' . $material->file_path);
    } elseif (Storage::disk('public')->exists($material->file_path)) {
        $path = storage_path('app/public/' . $material->file_path);
    } else {
        abort(404, "File tidak ditemukan");
    }

    return response()->file($path, [
        'Content-Type' => 'application/pdf',

        // ❗ PENTING: paksa inline (bukan download)
        'Content-Disposition' => 'inline; filename="secured.pdf"',

        // ❗ PENTING: cegah download & cache
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma' => 'no-cache',
        'Expires' => '0',

        // ❗ PENTING: cegah iframe luar
        'X-Frame-Options' => 'SAMEORIGIN',

        // ❗ BONUS: proteksi tambahan
        'X-Content-Type-Options' => 'nosniff',
    ]);
}
}