<?php

use App\Models\Company;
use App\Models\Customer;
use App\Models\DeliveryNote;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

function deliveryNotePayload(): array
{
    return [
        'company_id' => Company::factory()->create()->id,
        'customer_id' => Customer::factory()->create()->id,
        'nomor_dn' => 'DN-TEST-001',
        'tanggal' => '2026-01-15',
        'no_po' => 'PO-TEST-001',
        'items' => [[
            'product_id' => Product::factory()->create(['harga' => 100000])->id,
            'qty' => 2,
            'harga' => 125000,
        ]],
    ];
}

test('delivery note index page loads successfully', function () {
    $response = $this->get(route('delivery-notes.index'));

    $response->assertSuccessful()->assertInertia(fn ($page) => $page->component('delivery-notes/index'));
});

test('delivery note can be created with items', function () {
    $payload = deliveryNotePayload();

    $response = $this->postWithCsrf(route('delivery-notes.store'), $payload);

    $response->assertRedirect(route('delivery-notes.index'));
    $deliveryNote = DeliveryNote::query()->where('nomor_dn', 'DN-TEST-001')->firstOrFail();
    $this->assertModelExists($deliveryNote);
    expect($deliveryNote->items)->toHaveCount(1);
    expect((float) $deliveryNote->items->first()->subtotal)->toBe(250000.0);
});

test('delivery note can be updated', function () {
    $payload = deliveryNotePayload();
    $deliveryNote = DeliveryNote::factory()->create(collect($payload)->except('items')->all());
    $product = Product::query()->findOrFail($payload['items'][0]['product_id']);

    $response = $this->putWithCsrf(route('delivery-notes.update', $deliveryNote), [
        ...collect($payload)->except(['company_id', 'customer_id', 'items'])->all(),
        'company_id' => $deliveryNote->company_id,
        'customer_id' => $deliveryNote->customer_id,
        'nomor_dn' => 'DN-UPDATED',
        'items' => [['product_id' => $product->id, 'qty' => 3, 'harga' => 50000]],
    ]);

    $response->assertRedirect(route('delivery-notes.index'));
    expect($deliveryNote->fresh()->nomor_dn)->toBe('DN-UPDATED');
    expect((float) $deliveryNote->fresh()->items->first()->subtotal)->toBe(150000.0);
});

test('delivery note can be deleted', function () {
    $deliveryNote = DeliveryNote::factory()->create();

    $response = $this->deleteWithCsrf(route('delivery-notes.destroy', $deliveryNote));

    $response->assertRedirect(route('delivery-notes.index'));
    $this->assertModelMissing($deliveryNote);
});

test('used delivery note cannot be edited or deleted', function () {
    $deliveryNote = DeliveryNote::factory()->used()->create();

    $this->get(route('delivery-notes.edit', $deliveryNote))
        ->assertRedirect(route('delivery-notes.index'))
        ->assertSessionHas('error');

    $this->putWithCsrf(route('delivery-notes.update', $deliveryNote), [
        'company_id' => $deliveryNote->company_id,
        'customer_id' => $deliveryNote->customer_id,
        'nomor_dn' => 'DN-CHANGED',
        'tanggal' => '2026-01-15',
        'items' => [['product_id' => Product::factory()->create()->id, 'qty' => 1, 'harga' => 100]],
    ])->assertRedirect(route('delivery-notes.index'));

    $this->deleteWithCsrf(route('delivery-notes.destroy', $deliveryNote))
        ->assertRedirect(route('delivery-notes.index'))
        ->assertSessionHas('error');

    expect($deliveryNote->fresh()->status)->toBe('used');
});
