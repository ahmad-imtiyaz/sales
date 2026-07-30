<?php

namespace Database\Factories;

use App\Models\BankAccount;
use App\Models\Company;
use App\Models\Customer;
use App\Models\DeliveryNote;
use App\Models\DeliveryNoteItem;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Invoice> */
class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        return [
            'delivery_note_id' => DeliveryNote::factory(),
            'company_id' => Company::factory(),
            'customer_id' => Customer::factory(),
            'bank_account_id' => BankAccount::factory(),
            'nomor_invoice' => 'INV-'.fake()->unique()->numerify('#####'),
            'tanggal_invoice' => fake()->date(),
            'no_po' => 'PO-'.fake()->numerify('#####'),
            'subtotal' => 0,
            'ppn' => 0,
            'grand_total' => 0,
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Invoice $invoice): void {
            $deliveryNote = DeliveryNote::query()->with('items')->find($invoice->delivery_note_id);
            if ($deliveryNote === null) {
                return;
            }
            $subtotal = (float) $deliveryNote->items->sum(fn (DeliveryNoteItem $item): float => (float) $item->qty * (float) $item->harga);
            $ppn = round($subtotal * Invoice::PPN_RATE, 2);
            $invoice->fill([
                'company_id' => $deliveryNote->company_id,
                'customer_id' => $deliveryNote->customer_id,
                'subtotal' => $subtotal,
                'ppn' => $ppn,
                'grand_total' => round($subtotal + $ppn, 2),
            ]);
        });
    }
}
