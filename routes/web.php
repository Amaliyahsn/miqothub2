<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminManagementController; 
use App\Http\Controllers\Admin\CourseController; 
use App\Http\Controllers\Admin\MemberController; 
use App\Http\Controllers\Admin\CurriculumController;
use App\Http\Controllers\Admin\DashboardController; 
use App\Http\Controllers\Admin\FinanceController;
use App\Http\Controllers\Member\ReviewController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Member\CourseController as MemberCourseController;
use App\Http\Controllers\Member\ExerciseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    // 1. Ambil Data Courses (Sudah benar)
    $courses = \App\Models\Course::where('status', 'onsale')
        ->with(['chapters.materials' => function ($query) {
            $query->where('is_preview', true);
        }])
        ->get()
        ->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            return $course;
        });

$reviews = \App\Models\Review::with('user:id,name')
    ->where('tampilkan_di_landing', true)
    ->where('rating', '>=', 4)
    ->latest()
    ->get(); // 🔥 HAPUS take(6)

    // 3. Ambil Pengaturan Situs (Sudah benar)
    $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

    // --- TAMBAHKAN BAGIAN INI AGAR TIDAK ERROR ---
    // 4. Ambil Data Berita/Kegiatan Terbaru
    $latestPosts = \App\Models\Post::latest()->take(6)->get()->map(function ($post) {
        // Tambahkan URL gambar agar bisa tampil di frontend
        $post->image_url = $post->image ? asset('storage/' . $post->image) : null;
        return $post;
    });

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'courses' => $courses, 
        'settings' => $settings,
        'reviews' => $reviews,
        'latestPosts' => $latestPosts, // Sekarang variabel ini sudah ada isinya
    ]);
})->name('welcome');

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Member & Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard Logic
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard'); 
        }

        // Ambil Data Kursus Member
        $myCourses = $user->courses()->get()->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            return $course;
        });

        // Hitung Statistik Nilai (Tingkat Keberhasilan)
        $scoreQuery = \App\Models\ExerciseScore::where('user_id', $user->id);
        $kuisSelesai = $scoreQuery->count();
        $persentaseLulus = $kuisSelesai > 0 ? round($scoreQuery->avg('skor')) : 0;

        return Inertia::render('Member/Dashboard', [
            'stats' => [
                'kelas_aktif' => $myCourses->count(),
                'kuis_selesai' => $kuisSelesai,
                'sertifikat' => 0, 
                'persentase_lulus' => $persentaseLulus,
            ],
            'recentCourses' => $myCourses->take(3),
        ]);
    })->name('dashboard');

    // Member Course Routes
    Route::get('/my-courses', [MemberCourseController::class, 'index'])->name('member.courses.index');
    Route::get('/my-courses/{id}', [MemberCourseController::class, 'show'])->name('member.courses.show');
    Route::get('/katalog', [MemberCourseController::class, 'catalog'])->name('member.catalog');
    Route::post('/katalog/purchase', [MemberCourseController::class, 'purchase'])->name('member.purchase');

    // Exercise / Kuis Routes
    Route::prefix('member/materials/{material}/exercise')->name('member.exercise.')->group(function () {
        Route::get('/', [ExerciseController::class, 'show'])->name('show');
        Route::post('/verify', [ExerciseController::class, 'verifyPassword'])->name('verify');
        Route::post('/submit', [ExerciseController::class, 'submit'])->name('submit');
        Route::delete('/reset', [ExerciseController::class, 'reset'])->name('reset');
    });

    // Profile Management
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Utilities (PDF Stream & Review)
    Route::get('/materials/stream-pdf/{material}', [CurriculumController::class, 'streamPdf'])->name('materials.stream');
    Route::post('/member/reviews', [ReviewController::class, 'store'])->name('member.reviews.store');

});

/*
|--------------------------------------------------------------------------
| Admin Only Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Admin Management
    Route::resource('management', AdminManagementController::class)->except(['show', 'create', 'edit']);
    
    // Kursus & Kurikulum
    Route::resource('courses', CourseController::class);
    Route::get('/courses/{course}/curriculum', [CurriculumController::class, 'show'])->name('courses.curriculum');
    
    // Chapters
    Route::post('/courses/{course}/chapters', [CurriculumController::class, 'storeChapter'])->name('chapters.store');
    Route::put('/chapters/{chapter}', [CurriculumController::class, 'updateChapter'])->name('chapters.update');
    Route::delete('/chapters/{chapter}', [CurriculumController::class, 'destroyChapter'])->name('chapters.destroy');
    Route::put('/chapters/{chapter}/reorder', [CurriculumController::class, 'reorderChapter'])->name('chapters.reorder');
    
    // Materials
    Route::post('/chapters/{chapter}/materials', [CurriculumController::class, 'storeMaterial'])->name('materials.store');
    Route::post('/chapters/{chapter}/meetings', [CurriculumController::class, 'storeMeeting'])->name('meetings.store');
    Route::post('/chapters/{chapter}/exercises', [CurriculumController::class, 'storeExercise'])->name('exercises.store');
    Route::put('/materials/{material}', [CurriculumController::class, 'updateMaterial'])->name('materials.update');
    Route::delete('/materials/{material}', [CurriculumController::class, 'destroyMaterial'])->name('materials.destroy');
    Route::put('/materials/{material}/reorder', [CurriculumController::class, 'reorderMaterial'])->name('materials.reorder');

    // Management Member
    Route::get('/members', [MemberController::class, 'index'])->name('members.index');
    Route::post('/members', [MemberController::class, 'store'])->name('members.store');
    Route::put('/members/{member}', [MemberController::class, 'update'])->name('members.update');
    Route::delete('/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');
    Route::post('/members/{member}/enroll', [MemberController::class, 'enrollCourse'])->name('members.enroll');
    Route::delete('/members/{member}/unenroll/{course}', [MemberController::class, 'unenrollCourse'])->name('members.unenroll');
    Route::put('/members/{member}/verify', [MemberController::class, 'verify'])->name('members.verify');
    Route::put('/members/{member}/reject', [MemberController::class, 'reject'])->name('members.reject');

    // Exercise & Question Management
    Route::resource('exercises', \App\Http\Controllers\Admin\ExerciseController::class);
    Route::post('/exercises/{exercise}/questions', [\App\Http\Controllers\Admin\ExerciseController::class, 'storeQuestion'])->name('questions.store');
    Route::put('/questions/{question}', [\App\Http\Controllers\Admin\ExerciseController::class, 'updateQuestion'])->name('questions.update');
    Route::delete('/questions/{question}', [\App\Http\Controllers\Admin\ExerciseController::class, 'destroyQuestion'])->name('questions.destroy');
    Route::put('/exercises/{exercise}/reorder-questions', [\App\Http\Controllers\Admin\ExerciseController::class, 'reorderQuestions'])->name('questions.reorder');

    // Settings & Finance
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
    Route::get('/finance', [FinanceController::class, 'index'])->name('finance.index');

    Route::resource('posts', PostController::class);
    
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';