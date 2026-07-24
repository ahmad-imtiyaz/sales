<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'kode' => 'BRG-001',
            'nama_barang' => 'Material Renovasi Ruang TBT',
            'satuan' => 'Unit',
            'harga' => 413500,
        ]);

        Product::create([
            'kode' => 'BRG-002',
            'nama_barang' => 'Cat Tembok Interior Premium',
            'satuan' => 'Kaleng',
            'harga' => 185000,
        ]);

        Product::create([
            'kode' => 'BRG-003',
            'nama_barang' => 'Keramik Lantai 60x60',
            'satuan' => 'M2',
            'harga' => 125000,
        ]);

        Product::create([
            'kode' => 'BRG-004',
            'nama_barang' => 'Semen Portland Tipe 1',
            'satuan' => 'Sak',
            'harga' => 68000,
        ]);

        Product::create([
            'kode' => 'BRG-005',
            'nama_barang' => 'Pasir Beton Halus',
            'satuan' => 'M3',
            'harga' => 250000,
        ]);
    }
}
