<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $invoice = $this->route('invoice');

        return [
            'bank_account_id' => ['required', 'integer', 'exists:bank_accounts,id'],
            'nomor_invoice' => [
                'required',
                'string',
                'max:255',
                Rule::unique('invoices', 'nomor_invoice')->ignore($invoice),
            ],
            'tanggal_invoice' => ['required', 'date'],
            'no_po' => ['nullable', 'string', 'max:255'],
        ];
    }
}
