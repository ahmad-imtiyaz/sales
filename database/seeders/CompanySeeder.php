<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Company::create([
            'nama' => 'CV Agus Jaya',
            'logo' => null,
            'alamat' => 'Jl. Raya No. 123, Jakarta Selatan',
            'telepon' => '021-1234567',
            'email' => 'info@agusjaya.com',
        ]);

        Company::create([
            'nama' => 'CV Sumber Sukses Utama',
            'logo' => null,
            'alamat' => 'Jl. Sudirman No. 456, Jakarta Pusat',
            'telepon' => '021-7654321',
            'email' => 'info@suksesutama.com',
        ]);
    }
}
