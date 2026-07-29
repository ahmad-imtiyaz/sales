<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BankAccountController extends Controller
{
    public function index(Request $request): Response
    {
        $query = BankAccount::query()->with('company');

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->toString();

            $query->where(function ($query) use ($search): void {
                $query->where('nama_bank', 'like', "%{$search}%")
                    ->orWhere('nomor_rekening', 'like', "%{$search}%")
                    ->orWhere('atas_nama', 'like', "%{$search}%")
                    ->orWhereHas('company', function ($query) use ($search): void {
                        $query->where('nama', 'like', "%{$search}%");
                    });
            });
        }

        $bankAccounts = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('bank-accounts/index', [
            'bankAccounts' => $bankAccounts,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $companies = Company::select('id', 'nama')->get();

        return Inertia::render('bank-accounts/create', [
            'companies' => $companies,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
            'nama_bank' => ['required', 'string', 'max:255'],
            'nomor_rekening' => ['required', 'string', 'max:255'],
            'atas_nama' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'boolean'],
        ]);

        $validated['status'] = filter_var($validated['status'] ?? true, FILTER_VALIDATE_BOOLEAN);

        BankAccount::create($validated);

        return redirect()->route('bank-accounts.index')
            ->with('success', 'Rekening berhasil ditambahkan.');
    }

    public function edit(BankAccount $bankAccount): Response
    {
        $companies = Company::select('id', 'nama')->get();

        return Inertia::render('bank-accounts/edit', [
            'bankAccount' => $bankAccount,
            'companies' => $companies,
        ]);
    }

    public function update(Request $request, BankAccount $bankAccount)
    {
        $validated = $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
            'nama_bank' => ['required', 'string', 'max:255'],
            'nomor_rekening' => ['required', 'string', 'max:255'],
            'atas_nama' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'boolean'],
        ]);

        $validated['status'] = filter_var($validated['status'] ?? true, FILTER_VALIDATE_BOOLEAN);

        $bankAccount->update($validated);

        return redirect()->route('bank-accounts.index')
            ->with('success', 'Rekening berhasil diperbarui.');
    }

    public function destroy(BankAccount $bankAccount)
    {
        $bankAccount->delete();

        return redirect()->route('bank-accounts.index')
            ->with('success', 'Rekening berhasil dihapus.');
    }
}
