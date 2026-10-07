<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VacancyController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

Route::inertia('/prototype/candidate', 'prototype/candidate');
Route::inertia('/prototype/employer', 'prototype/employer');

Route::inertia('/prototype/candidate', 'prototype/candidate');
Route::inertia('/prototype/employer', 'prototype/employer');
Route::middleware(['auth', 'verified'])->group(function () {
Route::post('organizations/{organization}/vacancies', [VacancyController::class, 'store']);
Route::put('vacancies/{vacancy}', [VacancyController::class, 'update']);
Route::post('vacancies/{vacancy}/publish', [VacancyController::class, 'publish']);
});