<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeliveryNoteRequest;
use App\Http\Requests\UpdateDeliveryNoteRequest;
use App\Models\Company;
use App\Models\Customer;
use App\Models\DeliveryNote;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class DeliveryNoteController extends Controller
{
    public function index(Request $request): Response
    {
        $deliveryNotes = DeliveryNote::query()
            ->with(['company:id,nama', 'customer:id,nama'])
            ->withCount('items')
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->string('search')->trim()->toString();

                $query->where(function ($query) use ($search): void {
                    $query->where('nomor_dn', 'like', "%{$search}%")
                        ->orWhere('no_po', 'like', "%{$search}%")
                        ->orWhereHas('company', fn ($query) => $query->where('nama', 'like', "%{$search}%"))
                        ->orWhereHas('customer', fn ($query) => $query->where('nama', 'like', "%{$search}%"));
                });
            })
            ->latest('updated_at')
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('delivery-notes/index', [
            'deliveryNotes' => $deliveryNotes,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('delivery-notes/create', $this->formOptions());
    }

    public function store(StoreDeliveryNoteRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated): void {
            $deliveryNote = DeliveryNote::create(Arr::except($validated, 'items'));
            $deliveryNote->items()->createMany($this->itemsWithSubtotals($validated['items']));
        });

        return redirect()->route('delivery-notes.index')
            ->with('success', 'Delivery Note berhasil ditambahkan.');
    }

    public function edit(DeliveryNote $deliveryNote): Response|RedirectResponse
    {
        if ($deliveryNote->isUsed()) {
            return redirect()->route('delivery-notes.index')
                ->with('error', 'Delivery Note yang sudah digunakan tidak dapat diedit.');
        }

        $deliveryNote->load('items');

        return Inertia::render('delivery-notes/edit', [
            ...$this->formOptions(),
            'deliveryNote' => [
                ...$deliveryNote->toArray(),
                'tanggal' => $deliveryNote->tanggal->format('Y-m-d'),
                'items' => $deliveryNote->items->toArray(),
            ],
        ]);
    }

    public function update(UpdateDeliveryNoteRequest $request, DeliveryNote $deliveryNote): RedirectResponse
    {
        if ($deliveryNote->isUsed()) {
            return redirect()->route('delivery-notes.index')
                ->with('error', 'Delivery Note yang sudah digunakan tidak dapat diedit.');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($deliveryNote, $validated): void {
            $deliveryNote->update(Arr::except($validated, 'items'));
            $deliveryNote->items()->delete();
            $deliveryNote->items()->createMany($this->itemsWithSubtotals($validated['items']));
        });

        return redirect()->route('delivery-notes.index')
            ->with('success', 'Delivery Note berhasil diperbarui.');
    }

    public function showJson(DeliveryNote $deliveryNote): JsonResponse
    {
        $deliveryNote->load([
            'company:id,nama',
            'customer:id,nama,alamat,kota,pic',
            'items.product:id,kode,nama_barang,satuan',
        ]);

        return response()->json([
            'id' => $deliveryNote->id,
            'nomor_dn' => $deliveryNote->nomor_dn,
            'tanggal' => $deliveryNote->tanggal->format('Y-m-d'),
            'no_po' => $deliveryNote->no_po,
            'status' => $deliveryNote->status,
            'company' => $deliveryNote->company,
            'customer' => $deliveryNote->customer,
            'items' => $deliveryNote->items->map(fn ($item): array => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'qty' => (float) $item->qty,
                'harga' => (float) $item->harga,
                'subtotal' => (float) $item->subtotal,
                'product' => $item->product,
            ]),
            'subtotal' => (float) $deliveryNote->items->sum('subtotal'),
        ]);
    }

    public function print(DeliveryNote $deliveryNote): HttpResponse
    {
        $deliveryNote->load([
            'company:id,nama,logo,alamat,telepon,email',
            'customer:id,nama,alamat,kota,pic,telepon,email',
            'items.product:id,kode,nama_barang,satuan',
        ]);

        return Pdf::loadView('pdf.delivery-note', [
            'deliveryNote' => $deliveryNote,
        ])->setPaper('a4')->stream("delivery-note-{$deliveryNote->nomor_dn}.pdf");
    }

    public function destroy(DeliveryNote $deliveryNote): RedirectResponse
    {
        if ($deliveryNote->isUsed()) {
            return redirect()->route('delivery-notes.index')
                ->with('error', 'Delivery Note yang sudah digunakan tidak dapat dihapus.');
        }

        $deliveryNote->delete();

        return redirect()->route('delivery-notes.index')
            ->with('success', 'Delivery Note berhasil dihapus.');
    }

    /** @return array{companies: mixed, customers: mixed, products: mixed} */
    private function formOptions(): array
    {
        return [
            'companies' => Company::query()->select('id', 'nama')->orderBy('nama')->get(),
            'customers' => Customer::query()->select('id', 'nama')->orderBy('nama')->get(),
            'products' => Product::query()->select('id', 'kode', 'nama_barang', 'satuan', 'harga')->orderBy('nama_barang')->get(),
        ];
    }

    /**
     * @param  array<int, array{product_id: int, qty: numeric-string|int|float, harga: numeric-string|int|float}>  $items
     * @return array<int, array{product_id: int, qty: numeric-string|int|float, harga: numeric-string|int|float, subtotal: float}>
     */
    private function itemsWithSubtotals(array $items): array
    {
        return array_map(fn (array $item): array => [
            ...$item,
            'subtotal' => round((float) $item['qty'] * (float) $item['harga'], 2),
        ], $items);
    }
}
