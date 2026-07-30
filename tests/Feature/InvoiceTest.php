<?php

use App\Models\BankAccount;
use App\Models\Company;
use App\Models\Customer;
use App\Models\DeliveryNote;
use App\Models\DeliveryNoteItem;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

function invoiceContext(): array
{
    $company = Company::factory()->create();
    $customer = Customer::factory()->create();
    $bankAccount = BankAccount::factory()->create([
        'company_id' => $company->id,
        'nama_bank' => 'BRI',
        'nomor_rekening' => '0563-01-000400-30-3',
        'atas_nama' => 'CV Agus Jaya',
        'status' => true,
    ]);

    return [
        'company' => $company,
        'customer' => $customer,
        'bankAccount' => $bankAccount,
    ];
}

function buildDeliveryNote(array $context, array $items = [], ?string $nomorDn = null): DeliveryNote
{
    $deliveryNote = DeliveryNote::factory()->create([
        'company_id' => $context['company']->id,
        'customer_id' => $context['customer']->id,
        'nomor_dn' => $nomorDn ?? 'DN-INV-001',
        'tanggal' => '2026-01-15',
        'no_po' => 'PO-INV-001',
    ]);

    foreach ($items as $item) {
        $product = Product::factory()->create(['harga' => $item['harga']]);
        DeliveryNoteItem::factory()->recycle($deliveryNote)->recycle($product)->create([
            'qty' => $item['qty'],
            'harga' => $item['harga'],
            'subtotal' => round($item['qty'] * $item['harga'], 2),
        ]);
    }

    return $deliveryNote;
}

test('invoice index page loads successfully', function () {
    $this->get(route('invoices.index'))->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('invoices/index'));
});

test('invoice create form only lists available delivery notes', function () {
    $context = invoiceContext();
    $available = buildDeliveryNote($context, [['qty' => 1, 'harga' => 100000]], 'DN-AVAIL');
    $used = buildDeliveryNote($context, [['qty' => 1, 'harga' => 200000]], 'DN-USED');
    $used->update(['status' => 'used']);

    $this->get(route('invoices.create'))
        ->assertInertia(fn ($page) => $page
            ->component('invoices/create')
            ->has('deliveryNotes', 1)
            ->where('deliveryNotes.0.id', $available->id));
});

test('creating invoice locks delivery note and computes ppn correctly', function () {
    $context = invoiceContext();
    $deliveryNote = buildDeliveryNote($context, [['qty' => 1, 'harga' => 413500]]);

    $response = $this->postWithCsrf(route('invoices.store'), [
        'delivery_note_id' => $deliveryNote->id,
        'bank_account_id' => $context['bankAccount']->id,
        'nomor_invoice' => 'INV-TEST-001',
        'tanggal_invoice' => '2026-01-16',
        'no_po' => 'PO-INV-001',
    ]);

    $response->assertRedirect(route('invoices.show', Invoice::query()->first()));
    $invoice = Invoice::query()->where('nomor_invoice', 'INV-TEST-001')->firstOrFail();

    expect((float) $invoice->subtotal)->toBe(413500.0);
    expect((float) $invoice->ppn)->toBe(45485.0);
    expect((float) $invoice->grand_total)->toBe(458985.0);
    expect($deliveryNote->fresh()->status)->toBe('used');
});

test('creating invoice for already used delivery note fails validation', function () {
    $context = invoiceContext();
    $deliveryNote = buildDeliveryNote($context, [['qty' => 1, 'harga' => 100000]]);
    $deliveryNote->update(['status' => 'used']);

    $this->postWithCsrf(route('invoices.store'), [
        'delivery_note_id' => $deliveryNote->id,
        'bank_account_id' => $context['bankAccount']->id,
        'nomor_invoice' => 'INV-TEST-002',
        'tanggal_invoice' => '2026-01-16',
    ])->assertSessionHasErrors('delivery_note_id');
});

test('deleting invoice returns delivery note to available', function () {
    $context = invoiceContext();
    $deliveryNote = buildDeliveryNote($context, [['qty' => 1, 'harga' => 100000]]);
    $invoice = Invoice::factory()->recycle($deliveryNote)->recycle($context['bankAccount'])->create([
        'nomor_invoice' => 'INV-TEST-003',
        'subtotal' => 100000,
        'ppn' => 11000,
        'grand_total' => 111000,
    ]);
    $deliveryNote->update(['status' => 'used']);

    $this->deleteWithCsrf(route('invoices.destroy', $invoice))
        ->assertRedirect(route('invoices.index'));

    $this->assertModelMissing($invoice);
    expect($deliveryNote->fresh()->status)->toBe('available');
});

test('invoice show page loads with related records', function () {
    $context = invoiceContext();
    $deliveryNote = buildDeliveryNote($context, [['qty' => 1, 'harga' => 413500]]);
    $invoice = Invoice::factory()->recycle($deliveryNote)->recycle($context['bankAccount'])->create([
        'nomor_invoice' => 'INV-TEST-004',
    ]);

    $this->get(route('invoices.show', $invoice))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('invoices/show')
            ->where('invoice.nomor_invoice', 'INV-TEST-004'));
});

test('delivery note JSON endpoint exposes customer and items', function () {
    $context = invoiceContext();
    $deliveryNote = buildDeliveryNote($context, [['qty' => 2, 'harga' => 413500]]);

    $this->getJson(route('delivery-notes.showJson', $deliveryNote))
        ->assertSuccessful()
        ->assertJsonPath('id', $deliveryNote->id)
        ->assertJsonPath('customer.nama', $context['customer']->nama)
        ->assertJsonPath('subtotal', 827000)
        ->assertJsonCount(1, 'items');
});
