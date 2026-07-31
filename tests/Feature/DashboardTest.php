<?php

use App\Models\Company;
use App\Models\Customer;
use App\Models\DeliveryNote;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('dashboard returns stats and latest invoices', function () {
    $company = Company::factory()->create(['nama' => 'CV Agus Jaya']);
    $customer = Customer::factory()->create(['nama' => 'PT Orica']);
    $product = Product::factory()->create(['harga' => 413500]);

    $availableDn = DeliveryNote::factory()->create([
        'company_id' => $company->id,
        'customer_id' => $customer->id,
        'nomor_dn' => 'DN-001',
        'status' => 'available',
    ]);
    $usedDn = DeliveryNote::factory()->create([
        'company_id' => $company->id,
        'customer_id' => $customer->id,
        'nomor_dn' => 'DN-002',
        'status' => 'used',
    ]);

    $inv = Invoice::factory()->recycle($availableDn)->create([
        'company_id' => $company->id,
        'customer_id' => $customer->id,
        'nomor_invoice' => 'INV-001',
        'tanggal_invoice' => now()->subDays(1),
        'subtotal' => 413500,
        'ppn' => 45485,
        'grand_total' => 458985,
    ]);

    $response = $this->get(route('dashboard'));

    $response->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('stats.delivery_notes.total', 2)
            ->where('stats.invoices_this_month.count', 1)
            ->where('latest_invoices.0.nomor_invoice', 'INV-001')
        );
});
