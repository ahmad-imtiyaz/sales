<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $rules = [
            'delivery_note_id' => [
                'required',
                'integer',
                Rule::exists('delivery_notes', 'id')->where(fn ($query) => $query->where('status', 'available')),
            ],
            'bank_account_id' => ['required', 'integer', 'exists:bank_accounts,id'],
            'nomor_invoice' => ['required', 'string', 'max:255', 'unique:invoices,nomor_invoice'],
            'tanggal_invoice' => ['required', 'date'],
            'no_po' => ['nullable', 'string', 'max:255'],
        ];

        return $rules;
    }
}
