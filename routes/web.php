<?php

use App\Http\Controllers\CvDocumentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\VacancyController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/prototype/candidate', 'prototype/candidate');
Route::inertia('/prototype/employer', 'prototype/employer');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::post('organizations', [OrganizationController::class, 'store']);
    Route::post('organizations/{organization}/approve', [OrganizationController::class, 'approve']);

    Route::post('organizations/{organization}/vacancies', [VacancyController::class, 'store']);
    Route::put('vacancies/{vacancy}', [VacancyController::class, 'update']);
    Route::post('vacancies/{vacancy}/publish', [VacancyController::class, 'publish']);
    Route::get('workspace', [WorkspaceController::class, 'index']);
    Route::get('organizations/{organization}/vacancies', [VacancyController::class, 'index']);
    Route::post('cv-documents', [CvDocumentController::class, 'store']);
    Route::get('cv-documents/{cvDocument}', [CvDocumentController::class, 'show']);
    Route::delete('cv-documents/{cvDocument}', [CvDocumentController::class, 'destroy']);
    Route::inertia('cv-upload', 'cv-upload')->name('cv-upload');
});

require __DIR__.'/settings.php';
