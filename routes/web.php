<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

Route::inertia('/prototype/candidate', 'prototype/candidate');
Route::inertia('/prototype/employer', 'prototype/employer');

Route::inertia('/prototype/candidate', 'prototype/candidate');
Route::inertia('/prototype/employer', 'prototype/employer');
