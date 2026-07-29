<?php

namespace Database\Factories;

use App\Models\DeliveryNote;
use App\Models\DeliveryNoteItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<DeliveryNoteItem> */
class DeliveryNoteItemFactory extends Factory
{
    protected $model = DeliveryNoteItem::class;

    public function definition(): array
    {
        $qty = fake()->randomFloat(2, 1, 10);
        $harga = fake()->numberBetween(10000, 500000);

        return [
            'delivery_note_id' => DeliveryNote::factory(),
            'product_id' => Product::factory(),
            'qty' => $qty,
            'harga' => $harga,
            'subtotal' => round($qty * $harga, 2),
        ];
    }
}
