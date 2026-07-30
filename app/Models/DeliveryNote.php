<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected $attributes = [
        'status' => 'available',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
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

    /**
     * @param  Builder<DeliveryNote>  $query
     * @return Builder<DeliveryNote>
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }
}
