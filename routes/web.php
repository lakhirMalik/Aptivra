<?php

use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/prototype/candidate', 'prototype/candidate');
Route::inertia('/prototype/employer', 'prototype/employer');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::post('organizations', [OrganizationController::class, 'store']);
    Route::post('organizations/{organization}/approve', [OrganizationController::class, 'approve']);

    Route::post('organizations/{organization}/vacancies', [VacancyController::class, 'store']);
    Route::put('vacancies/{vacancy}', [VacancyController::class, 'update']);
    Route::post('vacancies/{vacancy}/publish', [VacancyController::class, 'publish']);
});

require __DIR__.'/settings.php';