<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'customer_id',
        'nomor_dn',
        'tanggal',
        'no_po',
        'status',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(DeliveryNoteItem::class);
    }

    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    public function isUsed(): bool
    {
        return $this->status === 'used';
    }
}
