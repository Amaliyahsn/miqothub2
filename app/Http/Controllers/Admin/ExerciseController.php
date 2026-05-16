<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    public function index()
    {
        $exercises = Exercise::withCount('questions')->with('materials')->latest()->get();
        return Inertia::render('Admin/Exercises/Index', ['exercises' => $exercises]);
    }

    public function show(Exercise $exercise)
    {
        $exercise->load([
            'questions' => function ($query) { $query->orderBy('urutan', 'asc'); },
            'materials.chapter' 
        ]);

        $scores = \App\Models\ExerciseScore::where('exercise_id', $exercise->id)
            ->with('user:id,name,email') 
            ->orderBy('skor', 'desc') 
            ->get();

        return Inertia::render('Admin/Exercises/Show', [
            'exercise' => $exercise,
            'scores' => $scores
        ]);
    }

    public function update(Request $request, Exercise $exercise)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'password' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'waktu_menit' => 'required|integer|min:1', 
        ]);

        $exercise->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'password' => $request->password,
            'is_active' => $request->is_active ?? false,
            'waktu_menit' => $request->waktu_menit, 
        ]);

        return back()->with('success', 'Pengaturan Kuis/Latihan berhasil diperbarui!');
    }

    private function uploadImage($request, $fieldName, $oldPath = null)
    {
        if ($request->hasFile($fieldName)) {
            if ($oldPath) Storage::disk('public')->delete($oldPath);
            return $request->file($fieldName)->store('question_images', 'public');
        }
        return $oldPath; 
    }

    public function storeQuestion(Request $request, Exercise $exercise)
    {
        $request->validate([
            'pertanyaan' => 'required|string',
            'jawaban_benar' => 'required|in:a,b,c,d,e',
            'opsi_a' => 'required|string', 
            'opsi_b' => 'required|string',
            'opsi_c' => 'nullable|string', 
            'opsi_d' => 'nullable|string', 
            'opsi_e' => 'nullable|string',
            
            'gambar_soal' => 'nullable|image|max:2048',
            'gambar_a' => 'nullable|image|max:2048', 'gambar_b' => 'nullable|image|max:2048',
            'gambar_c' => 'nullable|image|max:2048', 'gambar_d' => 'nullable|image|max:2048', 'gambar_e' => 'nullable|image|max:2048',
        ]);

        $data = $request->all();
        
        // 💡 PERBAIKAN: Paksa nilai null menjadi string kosong agar database MySQL tidak error
        $data['opsi_c'] = $request->opsi_c ?? '';
        $data['opsi_d'] = $request->opsi_d ?? '';
        $data['opsi_e'] = $request->opsi_e ?? '';
        
        $maxUrutan = $exercise->questions()->max('urutan');
        $data['urutan'] = $maxUrutan ? $maxUrutan + 1 : 1;
        $data['exercise_id'] = $exercise->id;

        $fields = ['gambar_soal', 'gambar_a', 'gambar_b', 'gambar_c', 'gambar_d', 'gambar_e'];
        foreach ($fields as $field) {
            $data[$field] = $this->uploadImage($request, $field);
        }

        Question::create($data);
        return back()->with('success', 'Soal berhasil ditambahkan!');
    }

    public function updateQuestion(Request $request, Question $question)
    {
        $request->validate([
            'pertanyaan' => 'required|string',
            'jawaban_benar' => 'required|in:a,b,c,d,e',
            'opsi_a' => 'required|string', 
            'opsi_b' => 'required|string',
            'opsi_c' => 'nullable|string', 
            'opsi_d' => 'nullable|string', 
            'opsi_e' => 'nullable|string',
            
            'gambar_soal' => 'nullable|image|max:2048',
            'gambar_a' => 'nullable|image|max:2048', 'gambar_b' => 'nullable|image|max:2048',
            'gambar_c' => 'nullable|image|max:2048', 'gambar_d' => 'nullable|image|max:2048', 'gambar_e' => 'nullable|image|max:2048',
        ]);

        $data = $request->except(['_method', 'remove_gambar_soal', 'remove_gambar_a', 'remove_gambar_b', 'remove_gambar_c', 'remove_gambar_d', 'remove_gambar_e']);

        // 💡 PERBAIKAN: Paksa nilai null menjadi string kosong agar database MySQL tidak error
        $data['opsi_c'] = $request->opsi_c ?? '';
        $data['opsi_d'] = $request->opsi_d ?? '';
        $data['opsi_e'] = $request->opsi_e ?? '';

        $fields = ['gambar_soal', 'gambar_a', 'gambar_b', 'gambar_c', 'gambar_d', 'gambar_e'];
        foreach ($fields as $field) {
            $removeField = 'remove_' . $field;
            
            if ($request->$removeField == 'true' || $request->$removeField == 1) {
                if ($question->$field) Storage::disk('public')->delete($question->$field);
                $data[$field] = null;
            } else {
                $data[$field] = $this->uploadImage($request, $field, $question->$field);
            }
        }

        $question->update($data);
        return back()->with('success', 'Soal berhasil diperbarui!');
    }

    public function reorderQuestions(Request $request, Exercise $exercise)
    {
        $request->validate([
            'ordered_ids' => 'required|array',
        ]);

        foreach ($request->ordered_ids as $index => $id) {
            Question::where('id', $id)->where('exercise_id', $exercise->id)->update(['urutan' => $index + 1]);
        }

        return back()->with('success', 'Urutan soal berhasil diperbarui!');
    }

    public function destroyQuestion(Question $question)
    {
        $fields = ['gambar_soal', 'gambar_a', 'gambar_b', 'gambar_c', 'gambar_d', 'gambar_e'];
        foreach ($fields as $field) {
            if ($question->$field) Storage::disk('public')->delete($question->$field);
        }

        $question->delete();
        return back()->with('success', 'Soal berhasil dihapus!');
    }
}