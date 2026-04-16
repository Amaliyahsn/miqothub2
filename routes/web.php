<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminManagementController; 
use App\Http\Controllers\Admin\CourseController; 
use App\Http\Controllers\Admin\MemberController; 
use App\Http\Controllers\Admin\CurriculumController;
use App\Http\Controllers\Admin\DashboardController; 
use App\Http\Controllers\Admin\FinanceController;
use App\Http\Controllers\Member\CourseController as MemberCourseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes (Bisa diakses siapa saja)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    $courses = \App\Models\Course::where('status', 'onsale')
        ->with(['chapters.materials' => function ($query) {
            $query->where('is_preview', true);
        }])
        ->get()
        ->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            return $course;
        });

    // Ambil data dari tabel settings agar tidak error "undefined" di React
    $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'courses' => $courses, 
        'settings' => $settings, // Kirim ke Welcome.jsx
    ]);
})->name('welcome');

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Harus Login - Berlaku untuk Member & Admin)
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Authenticated Routes (Harus Login - Berlaku untuk Member & Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        $user = auth()->user();

        // 1. Jika Admin, kita arahkan (redirect) ke route khusus admin
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard'); 
        }

        // 2. Jika Member, eksekusi logic di bawah ini
        $myCourses = $user->courses()->get()->map(function ($course) {
            $course->thumbnail_url = $course->thumbnail ? asset('storage/' . $course->thumbnail) : null;
            return $course;
        });

        $kelasAktif = $myCourses->count();
        $kuisSelesai = \App\Models\ExerciseScore::where('user_id', $user->id)->count(); 
        $sertifikat = 0; 
        
        $recentCourses = $myCourses->take(3);

        return Inertia::render('Member/Dashboard', [
            'stats' => [
                'kelas_aktif' => $kelasAktif,
                'kuis_selesai' => $kuisSelesai,
                'sertifikat' => $sertifikat,
            ],
            'recentCourses' => $recentCourses,
        ]);
    })->name('dashboard');

    // ... sisa route member lainnya biarkan sama persis ...
    Route::get('/my-courses', [MemberCourseController::class, 'index'])->name('member.courses.index');
    Route::get('/my-courses/{id}', [MemberCourseController::class, 'show'])->name('member.courses.show');
    



    Route::get('/katalog', [MemberCourseController::class, 'catalog'])->name('member.catalog');
    Route::post('/katalog/purchase', [MemberCourseController::class, 'purchase'])->name('member.purchase');

    
    
    
    
    Route::prefix('member/materials/{material}/exercise')->name('member.exercise.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Member\ExerciseController::class, 'show'])->name('show');
        Route::post('/verify', [\App\Http\Controllers\Member\ExerciseController::class, 'verifyPassword'])->name('verify');
        Route::post('/submit', [\App\Http\Controllers\Member\ExerciseController::class, 'submit'])->name('submit');

        Route::delete('/reset', [\App\Http\Controllers\Member\ExerciseController::class, 'reset'])->name('reset');
    });
    

    
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Letakkan di dalam Route::middleware(['auth', 'verified'])
    Route::get('/materials/stream-pdf/{material}', [CurriculumController::class, 'streamPdf'])
    ->name('materials.stream');

});

/*
|--------------------------------------------------------------------------
| Admin Only Routes (Harus Login & Role: Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/management', [AdminManagementController::class, 'index'])->name('management.index');
    Route::post('/management', [AdminManagementController::class, 'store'])->name('management.store');
    Route::put('/management/{admin}', [AdminManagementController::class, 'update'])->name('management.update');
    Route::delete('/management/{admin}', [AdminManagementController::class, 'destroy'])->name('management.destroy');
    
    
    Route::resource('courses', CourseController::class);

    
    Route::get('/courses/{course}/curriculum', [CurriculumController::class, 'show'])->name('courses.curriculum');
    
    
    Route::post('/courses/{course}/chapters', [CurriculumController::class, 'storeChapter'])->name('chapters.store');
    Route::delete('/chapters/{chapter}', [CurriculumController::class, 'destroyChapter'])->name('chapters.destroy');
    Route::put('/chapters/{chapter}', [CurriculumController::class, 'updateChapter'])->name('chapters.update');
    Route::put('/chapters/{chapter}/reorder', [CurriculumController::class, 'reorderChapter'])->name('chapters.reorder');
    
    
    
    Route::put('/materials/{material}', [CurriculumController::class, 'updateMaterial'])->name('materials.update');
    Route::delete('/materials/{material}', [CurriculumController::class, 'destroyMaterial'])->name('materials.destroy');
    
    
    Route::post('/chapters/{chapter}/materials', [CurriculumController::class, 'storeMaterial'])->name('materials.store');
    Route::post('/chapters/{chapter}/meetings', [CurriculumController::class, 'storeMeeting'])->name('meetings.store');
    Route::post('/chapters/{chapter}/exercises', [CurriculumController::class, 'storeExercise'])->name('exercises.store');
    
    
    Route::put('/materials/{material}', [CurriculumController::class, 'updateMaterial'])->name('materials.update');
    Route::delete('/materials/{material}', [CurriculumController::class, 'destroyMaterial'])->name('materials.destroy');
    Route::put('/materials/{material}/reorder', [CurriculumController::class, 'reorderMaterial'])->name('materials.reorder');


    Route::get('/members', [MemberController::class, 'index'])->name('members.index');
    Route::post('/members', [MemberController::class, 'store'])->name('members.store');
    Route::post('/members/{member}/enroll', [MemberController::class, 'enrollCourse'])->name('members.enroll');
    Route::delete('/members/{member}/unenroll/{course}', [MemberController::class, 'unenrollCourse'])->name('members.unenroll');
    Route::put('/members/{member}/verify', [MemberController::class, 'verify'])->name('members.verify');
    Route::put('/members/{member}/reject', [MemberController::class, 'reject'])->name('members.reject');
    Route::put('/members/{member}', [MemberController::class, 'update'])->name('members.update');
    Route::delete('/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');

    
    Route::resource('exercises', \App\Http\Controllers\Admin\ExerciseController::class);
    Route::post('/exercises/{exercise}/questions', [\App\Http\Controllers\Admin\ExerciseController::class, 'storeQuestion'])->name('questions.store');
    Route::delete('/questions/{question}', [\App\Http\Controllers\Admin\ExerciseController::class, 'destroyQuestion'])->name('questions.destroy');
    
    
    Route::put('/exercises/{exercise}/reorder-questions', [\App\Http\Controllers\Admin\ExerciseController::class, 'reorderQuestions'])->name('questions.reorder');
    Route::put('/questions/{question}', [\App\Http\Controllers\Admin\ExerciseController::class, 'updateQuestion'])->name('questions.update');

    Route::get('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');

    Route::get('/finance', [FinanceController::class, 'index'])->name('finance.index');
    
});

/*
|--------------------------------------------------------------------------
| Authentication Routes (Bawaan Laravel Breeze)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';