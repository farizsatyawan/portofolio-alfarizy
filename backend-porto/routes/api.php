<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SkillController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Semua endpoint di bawah ini otomatis mendapat prefix /api.
| Contoh: Route::get('/profiles') => GET /api/profiles
|
*/

// ─── PUBLIC ROUTES (tanpa auth, untuk React frontend) ───────────────────────

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Contact: store dari React form (publik)
Route::post('/contacts', [ContactController::class, 'store']);

// Public read-only endpoints (untuk ditampilkan di React frontend)
Route::get('/profiles',     [ProfileController::class, 'index']);
Route::get('/profiles/{profile}', [ProfileController::class, 'show']);
Route::get('/experiences',  [ExperienceController::class, 'index']);
Route::get('/skills',       [SkillController::class, 'index']);
Route::get('/projects',     [ProjectController::class, 'index']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);
Route::get('/view-certificate/{filename}', [SkillController::class, 'viewCertificate']);


// ─── PROTECTED ROUTES (auth:sanctum, untuk Dashboard Admin) ─────────────────

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Profiles CRUD (create, update, delete hanya admin)
    Route::post('/profiles',              [ProfileController::class, 'store']);
    Route::post('/profiles/{profile}',    [ProfileController::class, 'update']); // POST+_method atau form-data
    Route::delete('/profiles/{profile}',  [ProfileController::class, 'destroy']);

    // Experiences CRUD
    Route::apiResource('experiences', ExperienceController::class)->except(['index']);

    // Skills CRUD
    Route::apiResource('skills', SkillController::class)->except(['index']);

    // Projects CRUD (create, update, delete hanya admin)
    Route::post('/projects',            [ProjectController::class, 'store']);
    Route::post('/projects/{project}',  [ProjectController::class, 'update']); // POST untuk form-data upload
    Route::delete('/projects/{project}',[ProjectController::class, 'destroy']);

    // Contacts: hanya lihat & hapus
    Route::get('/contacts',             [ContactController::class, 'index']);
    Route::delete('/contacts/{contact}',[ContactController::class, 'destroy']);
});
