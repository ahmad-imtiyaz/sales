<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode' => 'BRG-'.fake()->unique()->numberBetween(1000, 9999),
            'nama_barang' => fake()->words(3, true),
            'satuan' => fake()->randomElement(['Unit', 'Pcs', 'M2', 'M3', 'Kaleng', 'Sak', 'Roll', 'Box']),
            'harga' => fake()->numberBetween(10000, 5000000),
        ];
    }
}
