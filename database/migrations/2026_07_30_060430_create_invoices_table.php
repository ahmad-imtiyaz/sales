<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_note_id')->unique()->constrained('delivery_notes')->cascadeOnDelete();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('bank_account_id')->constrained('bank_accounts')->cascadeOnDelete();
            $table->string('nomor_invoice');
            $table->date('tanggal_invoice');
            $table->string('no_po')->nullable();
            $table->decimal('subtotal', 14, 2);
            $table->decimal('ppn', 14, 2);
            $table->decimal('grand_total', 14, 2);
            $table->timestamps();

            $table->unique('nomor_invoice');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
