<?php

namespace App\Http\Controllers;

use App\Actions\NumberToIndonesianWords;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Models\BankAccount;
use App\Models\Company;
use App\Models\DeliveryNote;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $invoices = Invoice::query()
            ->with(['company:id,nama', 'customer:id,nama', 'bankAccount:id,nama_bank,nomor_rekening'])
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->trim()->toString();

                $query->where(function ($query) use ($search): void {
                    $query->where('nomor_invoice', 'like', "%{$search}%")
                        ->orWhere('no_po', 'like', "%{$search}%")
                        ->orWhereHas('company', fn ($query) => $query->where('nama', 'like', "%{$search}%"))
                        ->orWhereHas('customer', fn ($query) => $query->where('nama', 'like', "%{$search}%"));
                });
            })
            ->latest('updated_at')
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('invoices/index', [
            'invoices' => $invoices,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('invoices/create', $this->formOptions());
    }

    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $invoice = DB::transaction(function () use ($validated): Invoice {
            $deliveryNote = DeliveryNote::query()
                ->with('items')
                ->lockForUpdate()
                ->findOrFail($validated['delivery_note_id']);

            if ($deliveryNote->isUsed()) {
                abort(422, 'Delivery Note sudah dipakai Invoice lain.');
            }

            $subtotal = round((float) $deliveryNote->items->sum(
                fn ($item): float => (float) $item->qty * (float) $item->harga,
            ), 2);
            $ppn = round($subtotal * Invoice::PPN_RATE, 2);
            $grandTotal = round($subtotal + $ppn, 2);

            $invoice = Invoice::query()->create([
                'delivery_note_id' => $deliveryNote->id,
                'company_id' => $deliveryNote->company_id,
                'customer_id' => $deliveryNote->customer_id,
                'bank_account_id' => $validated['bank_account_id'],
                'nomor_invoice' => $validated['nomor_invoice'],
                'tanggal_invoice' => $validated['tanggal_invoice'],
                'no_po' => $validated['no_po'] ?? null,
                'subtotal' => $subtotal,
                'ppn' => $ppn,
                'grand_total' => $grandTotal,
            ]);

            $deliveryNote->update(['status' => 'used']);

            return $invoice;
        });

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice berhasil dibuat.');
    }

    public function show(Invoice $invoice): Response
    {
        $invoice->load([
            'company:id,nama',
            'customer:id,nama,alamat,kota',
            'bankAccount:id,nama_bank,nomor_rekening,atas_nama,company_id',
            'bankAccount.company:id,nama',
            'deliveryNote:id,nomor_dn,tanggal,no_po',
            'deliveryNote.items.product:id,kode,nama_barang,satuan',
        ]);

        return Inertia::render('invoices/show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice): Response
    {
        $invoice->load('deliveryNote:id,nomor_dn');

        return Inertia::render('invoices/edit', [
            'invoice' => [
                ...$invoice->toArray(),
                'tanggal_invoice' => $invoice->tanggal_invoice->format('Y-m-d'),
            ],
            'bankAccounts' => BankAccount::query()
                ->where('status', true)
                ->with('company:id,nama')
                ->orderBy('nama_bank')
                ->get(),
            'deliveryNotes' => DeliveryNote::query()
                ->with(['customer:id,nama', 'company:id,nama', 'items.product:id,kode,nama_barang,satuan,harga'])
                ->where(function ($query) use ($invoice): void {
                    $query->available()->orWhere('id', $invoice->delivery_note_id);
                })
                ->latest('id')
                ->get(),
        ]);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): RedirectResponse
    {
        $invoice->update($request->validated());

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice berhasil diperbarui.');
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        DB::transaction(function () use ($invoice): void {
            $deliveryNote = DeliveryNote::query()
                ->with('items')
                ->lockForUpdate()
                ->find($invoice->delivery_note_id);

            $invoice->delete();

            if ($deliveryNote !== null && $deliveryNote->isUsed()) {
                $deliveryNote->update(['status' => 'available']);
            }
        });

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice berhasil dihapus.');
    }

    public function print(Invoice $invoice, NumberToIndonesianWords $numberToWords): HttpResponse
    {
        $invoice->load([
            'company:id,nama,logo,alamat,telepon,email',
            'customer:id,nama,alamat,kota,pic,telepon,email',
            'bankAccount:id,nama_bank,nomor_rekening,atas_nama',
            'deliveryNote:id,nomor_dn,tanggal,no_po',
            'deliveryNote.items.product:id,kode,nama_barang,satuan',
        ]);

        return Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'terbilang' => $numberToWords->convert($invoice->grand_total).' Rupiah',
        ])->setPaper('a4')->stream("invoice-{$invoice->nomor_invoice}.pdf");
    }

    /** @return array{companies: mixed, deliveryNotes: mixed, bankAccounts: mixed} */
    private function formOptions(): array
    {
        $availableDeliveryNotes = DeliveryNote::query()
            ->available()
            ->with(['customer:id,nama', 'items.product:id,kode,nama_barang,satuan,harga'])
            ->latest('id')
            ->get();

        return [
            'companies' => Company::query()->select('id', 'nama')->orderBy('nama')->get(),
            'deliveryNotes' => $availableDeliveryNotes,
            'bankAccounts' => BankAccount::query()
                ->where('status', true)
                ->with('company:id,nama')
                ->orderBy('nama_bank')
                ->get(),
        ];
    }
}
