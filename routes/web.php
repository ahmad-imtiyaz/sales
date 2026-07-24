<?php

use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Master Perusahaan
    Route::resource('companies', CompanyController::class)
        ->names('companies');

    // Master Customer
    Route::resource('customers', CustomerController::class)
        ->names('customers');

    // Master Barang
    Route::resource('products', ProductController::class)
        ->names('products');

    // Master Rekening
    Route::resource('bank-accounts', BankAccountController::class)
        ->names('bank-accounts');
});

require __DIR__.'/settings.php';
