<?php

namespace Database\Factories;

use App\Models\BankAccount;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BankAccount>
 */
class BankAccountFactory extends Factory
{
    protected $model = BankAccount::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'nama_bank' => fake()->randomElement(['BRI', 'BCA', 'Mandiri', 'BNI', 'CIMB Niaga']),
            'nomor_rekening' => fake()->numerify('##########'),
            'atas_nama' => fake()->company(),
            'status' => true,
        ];
    }
}
