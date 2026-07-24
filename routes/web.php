<?php

use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Master Perusahaan
    Route::resource('companies', CompanyController::class)
        ->names('companies');
});

require __DIR__.'/settings.php';
