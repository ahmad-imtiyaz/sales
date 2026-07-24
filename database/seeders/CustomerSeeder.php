<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::create([
            'nama' => 'PT Orica Mining Services',
            'alamat' => 'Pondok Indah Office Tower 3, Jl Sultan Iskandar Muda',
            'kota' => 'Jakarta Selatan',
            'pic' => 'Budi Santoso',
            'telepon' => '021-72788888',
            'email' => 'budi@orica.com',
        ]);

        Customer::create([
            'nama' => 'PT Indofood Sukses Makmur',
            'alamat' => 'Sudirman Plaza, Jl. Jend. Sudirman Kav. 76-78',
            'kota' => 'Jakarta Pusat',
            'pic' => 'Siti Rahayu',
            'telepon' => '021-57958888',
            'email' => 'siti@indofood.co.id',
        ]);

        Customer::create([
            'nama' => 'PT Astra International Tbk',
            'alamat' => 'Menara Astra, Jl. Jend. Sudirman Kav. 5-6',
            'kota' => 'Jakarta Pusat',
            'pic' => 'Ahmad Wijaya',
            'telepon' => '021-2518000',
            'email' => 'ahmad@astra.co.id',
        ]);
    }
}
