<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Customer;
use App\Models\DeliveryNote;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DeliveryNoteSeeder extends Seeder
{
    public function run(): void
    {
        $companies = Company::query()->orderBy('id')->get();
        $customer = Customer::query()->first();
        $products = Product::query()->limit(2)->get();

        if ($companies->isEmpty() || $customer === null || $products->isEmpty()) {
            return;
        }

        foreach ($companies->take(2) as $index => $company) {
            $deliveryNote = DeliveryNote::query()->create([
                'company_id' => $company->id,
                'customer_id' => $customer->id,
                'nomor_dn' => 'DN-'.str_pad((string) ($index + 1), 5, '0', STR_PAD_LEFT),
                'tanggal' => now()->subDays($index),
                'no_po' => 'PO-'.str_pad((string) ($index + 1), 5, '0', STR_PAD_LEFT),
            ]);

            foreach ($products as $product) {
                $qty = $index + 1;

                $deliveryNote->items()->create([
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'harga' => $product->harga,
                    'subtotal' => $qty * (float) $product->harga,
                ]);
            }
        }
    }
}
