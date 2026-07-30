<?php

namespace App\Models;

use Database\Factories\InvoiceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    /** @use HasFactory<InvoiceFactory> */
    use HasFactory;

    public const PPN_RATE = 0.11;

    protected $fillable = [
        'delivery_note_id',
        'company_id',
        'customer_id',
        'bank_account_id',
        'nomor_invoice',
        'tanggal_invoice',
        'no_po',
        'subtotal',
        'ppn',
        'grand_total',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_invoice' => 'date',
            'subtotal' => 'decimal:2',
            'ppn' => 'decimal:2',
            'grand_total' => 'decimal:2',
        ];
    }

    public function deliveryNote(): BelongsTo
    {
        return $this->belongsTo(DeliveryNote::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }
}
