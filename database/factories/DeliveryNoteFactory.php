<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Customer;
use App\Models\DeliveryNote;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<DeliveryNote> */
class DeliveryNoteFactory extends Factory
{
    protected $model = DeliveryNote::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'customer_id' => Customer::factory(),
            'nomor_dn' => 'DN-'.fake()->unique()->numerify('#####'),
            'tanggal' => fake()->date(),
            'no_po' => 'PO-'.fake()->numerify('#####'),
            'status' => 'available',
        ];
    }

    public function used(): static
    {
        return $this->state(fn (): array => ['status' => 'used']);
    }
}
