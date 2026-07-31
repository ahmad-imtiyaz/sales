<?php

namespace Database\Seeders;

use App\Models\BankAccount;
use App\Models\DeliveryNote;
use App\Models\Invoice;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $deliveryNotes = DeliveryNote::query()
            ->with('items.product')
            ->where('status', 'available')
            ->get();

        $bankAccounts = BankAccount::query()->where('status', true)->get();

        if ($deliveryNotes->isEmpty() || $bankAccounts->isEmpty()) {
            return;
        }

        foreach ($deliveryNotes as $index => $deliveryNote) {
            $subtotal = (float) $deliveryNote->items->sum('subtotal');
            $ppn = round($subtotal * Invoice::PPN_RATE, 2);
            $grandTotal = round($subtotal + $ppn, 2);

            $bankAccount = $bankAccounts->firstWhere('company_id', $deliveryNote->company_id)
                ?? $bankAccounts->first();

            $invoice = Invoice::query()->create([
                'delivery_note_id' => $deliveryNote->id,
                'company_id' => $deliveryNote->company_id,
                'customer_id' => $deliveryNote->customer_id,
                'bank_account_id' => $bankAccount->id,
                'nomor_invoice' => 'INV-'.str_pad((string) ($index + 1), 5, '0', STR_PAD_LEFT),
                'tanggal_invoice' => $deliveryNote->tanggal->copy()->addDay(),
                'no_po' => $deliveryNote->no_po,
                'subtotal' => $subtotal,
                'ppn' => $ppn,
                'grand_total' => $grandTotal,
            ]);

            $deliveryNote->update(['status' => 'used']);

            $this->command?->info("Created Invoice: {$invoice->nomor_invoice} from {$deliveryNote->nomor_dn} - Grand Total: {$grandTotal}");
        }
    }
}