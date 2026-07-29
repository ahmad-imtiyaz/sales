<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeliveryNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['required', 'exists:companies,id'],
            'customer_id' => ['required', 'exists:customers,id'],
            'nomor_dn' => ['required', 'string', 'max:255', 'unique:delivery_notes,nomor_dn'],
            'tanggal' => ['required', 'date'],
            'no_po' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.qty' => ['required', 'numeric', 'gt:0'],
            'items.*.harga' => ['required', 'numeric', 'min:0'],
        ];
    }
}
