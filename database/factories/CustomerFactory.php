<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->company(),
            'alamat' => fake()->address(),
            'kota' => fake()->city(),
            'pic' => fake()->name(),
            'telepon' => fake()->phoneNumber(),
            'email' => fake()->companyEmail(),
        ];
    }
}
