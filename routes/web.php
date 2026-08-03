<?php

use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeliveryNoteController;
use App\Http\Controllers\DocumentationController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

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

    // Transaksi Invoice
    Route::get('invoices/{invoice}/print', [InvoiceController::class, 'print'])
        ->name('invoices.print');
    Route::resource('invoices', InvoiceController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->names('invoices');

    // Transaksi Delivery Note
    Route::get('delivery-notes/{delivery_note}/print', [DeliveryNoteController::class, 'print'])
        ->name('delivery-notes.print');
    Route::get('delivery-notes/{delivery_note}/json', [DeliveryNoteController::class, 'showJson'])
        ->name('delivery-notes.showJson');
    Route::resource('delivery-notes', DeliveryNoteController::class)
        ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
        ->names('delivery-notes');

    // Laporan
    Route::get('laporan/delivery-notes', [LaporanController::class, 'deliveryNotes'])
        ->name('laporan.delivery-notes');
    Route::get('laporan/invoices', [LaporanController::class, 'invoices'])
        ->name('laporan.invoices');

    // Dokumentasi
    Route::get('documentation', [DocumentationController::class, 'index'])
        ->name('documentation.index');

    // Pengaturan
    Route::get('settings', [SettingController::class, 'index'])
        ->name('settings.index');
    Route::put('settings', [SettingController::class, 'update'])
        ->name('settings.update');
});

require __DIR__.'/settings.php';
