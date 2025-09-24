<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectChangesController;
use App\Http\Controllers\ProjectsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public admin routes - no authentication required
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::get('projects', [ProjectsController::class, 'index'])->name('projects.index');
Route::get('projects/{project}', [ProjectsController::class, 'show'])->name('projects.show');
Route::get('changes', [ProjectChangesController::class, 'index'])->name('changes.index');
Route::get('changes/{change}', [ProjectChangesController::class, 'show'])->name('changes.show');

// Disable settings and auth for public access
// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
