<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\DeliveryNote;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function deliveryNotes(Request $request): Response
    {
        $query = DeliveryNote::query()
            ->with(['company:id,nama', 'customer:id,nama'])
            ->withCount('items');

        if ($request->filled('tanggal_dari')) {
            $query->whereDate('tanggal', '>=', $request->tanggal_dari);
        }

        if ($request->filled('tanggal_sampai')) {
            $query->whereDate('tanggal', '<=', $request->tanggal_sampai);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $deliveryNotes = $query
            ->latest('tanggal')
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('laporan/delivery-notes', [
            'deliveryNotes' => $deliveryNotes,
            'filters' => $request->only(['tanggal_dari', 'tanggal_sampai', 'status']),
        ]);
    }

    public function invoices(Request $request): Response
    {
        $query = Invoice::query()
            ->with(['company:id,nama', 'customer:id,nama', 'bankAccount:id,nama_bank,nomor_rekening']);

        if ($request->filled('tanggal_dari')) {
            $query->whereDate('tanggal_invoice', '>=', $request->tanggal_dari);
        }

        if ($request->filled('tanggal_sampai')) {
            $query->whereDate('tanggal_invoice', '<=', $request->tanggal_sampai);
        }

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        $invoices = $query
            ->latest('tanggal_invoice')
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        $totalGrandTotal = (clone $query)->sum('grand_total');

        return Inertia::render('laporan/invoices', [
            'invoices' => $invoices,
            'filters' => $request->only(['tanggal_dari', 'tanggal_sampai', 'company_id']),
            'totalGrandTotal' => $totalGrandTotal,
            'companies' => Company::query()->select('id', 'nama')->orderBy('nama')->get(),
        ]);
    }
}
