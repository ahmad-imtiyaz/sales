<?php

namespace Database\Seeders;

use App\Models\BankAccount;
use Illuminate\Database\Seeder;

class BankAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // CV Agus Jaya (company_id: 1)
        BankAccount::create([
            'company_id' => 1,
            'nama_bank' => 'BRI',
            'nomor_rekening' => '0563-01-000400-30-3',
            'atas_nama' => 'CV Agus Jaya',
            'status' => true,
        ]);

        BankAccount::create([
            'company_id' => 1,
            'nama_bank' => 'BCA',
            'nomor_rekening' => '123456789',
            'atas_nama' => 'CV Agus Jaya',
            'status' => true,
        ]);

        // CV Sumber Sukses Utama (company_id: 2)
        BankAccount::create([
            'company_id' => 2,
            'nama_bank' => 'Mandiri',
            'nomor_rekening' => '987654321',
            'atas_nama' => 'CV Sumber Sukses Utama',
            'status' => true,
        ]);
    }
}
