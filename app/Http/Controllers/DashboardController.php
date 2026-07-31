<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Customer;
use App\Models\DeliveryNote;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // Total Delivery Note (available vs used)
        $totalDnAvailable = DeliveryNote::query()->where('status', 'available')->count();
        $totalDnUsed = DeliveryNote::query()->where('status', 'used')->count();
        $totalDn = $totalDnAvailable + $totalDnUsed;

        // Total Invoice bulan ini + total grand_total bulan ini
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $invoicesThisMonth = Invoice::query()
            ->whereBetween('tanggal_invoice', [$startOfMonth, $endOfMonth])
            ->get();

        $totalInvoicesThisMonth = $invoicesThisMonth->count();
        $totalGrandTotalThisMonth = $invoicesThisMonth->sum('grand_total');

        // Jumlah Customer & Perusahaan aktif
        $totalCustomers = Customer::query()->count();
        $totalCompanies = Company::query()->count();

        // 5 Invoice terbaru
        $latestInvoices = Invoice::query()
            ->with(['company:id,nama', 'customer:id,nama'])
            ->latest('tanggal_invoice')
            ->latest('id')
            ->limit(5)
            ->get()
            ->map(fn ($invoice) => [
                'id' => $invoice->id,
                'nomor_invoice' => $invoice->nomor_invoice,
                'tanggal_invoice' => $invoice->tanggal_invoice->format('Y-m-d'),
                'grand_total' => $invoice->grand_total,
                'company' => $invoice->company->nama,
                'customer' => $invoice->customer->nama,
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'delivery_notes' => [
                    'total' => $totalDn,
                    'available' => $totalDnAvailable,
                    'used' => $totalDnUsed,
                ],
                'invoices_this_month' => [
                    'count' => $totalInvoicesThisMonth,
                    'grand_total' => $totalGrandTotalThisMonth,
                ],
                'customers' => $totalCustomers,
                'companies' => $totalCompanies,
            ],
            'latest_invoices' => $latestInvoices,
        ]);
    }
}
