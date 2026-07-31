@php
    use Illuminate\Support\Number;

    $config = config('pdf');
    $supplier = $config['supplier'];
    $items = $deliveryNote->items;
    $itemRows = (int) $config['item_rows'];
    $totalAmount = (float) $items->sum('subtotal');

    $fmtMoney = fn (float $value): string => number_format($value, 0, ',', '.');
    $fmtQty = fn (float $value): string => number_format($value, fmod($value, 1.0) === 0.0 ? 0 : 2, ',', '.');

    $recipientCity = $deliveryNote->customer->kota ?: 'Sangatta';
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Delivery Note {{ $deliveryNote->nomor_dn }}</title>
    <style>
        @page { margin: 28px 28px; }
        body { color: #000; font-family: DejaVu Sans, sans-serif; font-size: 10px; line-height: 1.35; }
        table { border-collapse: collapse; width: 100%; }

        /* Top row: supplier (left) + customer (right) */
        .header { margin-bottom: 0; }
        .header > tbody > tr > td { vertical-align: top; }
        .supplier { width: 58%; padding-right: 12px; }
        .customer-header { width: 42%; padding-left: 12px; text-align: right; }
        .customer-header .recipient-label { margin-bottom: 2px; }
        .customer-header .recipient-name { font-size: 12px; font-weight: bold; }

        .supplier-name { font-size: 24px; font-weight: bold; letter-spacing: 1px; margin-bottom: 4px; }
        .supplier-line { margin: 0; }
        .supplier-section { margin-top: 8px; }
        .supplier-section .supplier-line { margin: 0; }

        /* Title row: centered document title + number */
        .title-row { text-align: center; margin: 14px 0 2px; }
        .document-title { font-size: 18px; font-weight: bold; text-decoration: underline; letter-spacing: 1px; }
        .document-number { font-size: 14px; font-weight: bold; margin-top: 4px; }

        /* PO row: right-aligned, same block as title, below it */
        .po-row { text-align: right; font-weight: bold; margin: 2px 0 8px; }

        .items { margin-top: 4px; page-break-inside: auto; }
        .items thead { display: table-header-group; }
        .items tr { page-break-inside: avoid; }
        .items th, .items td { border: 1px solid #000; padding: 5px; }
        .items th { text-align: center; text-transform: uppercase; font-weight: bold; }
        .center { text-align: center; }
        .right { text-align: right; }
        .empty-row td { height: 14px; }

        .total-label-cell { font-weight: bold; text-align: right; line-height: 1.2; }
        .total-value-cell { font-weight: bold; text-align: right; }

        .footer { margin-top: 18px; page-break-inside: avoid; }
        .footer > tbody > tr > td { vertical-align: top; }
        .footer-receipt { width: 50%; padding-right: 24px; }
        .footer-issuer { width: 50%; padding-left: 24px; }
        .footer-note { font-style: italic; margin-bottom: 50px; }
        .signature-line { border-top: 1px solid #000; display: inline-block; min-width: 150px; padding-top: 2px; margin-top: 50px; }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td class="supplier">
                <div class="supplier-name">{{ $supplier['name'] }}</div>

                <div class="supplier-section">
                    <div class="supplier-line"><strong>{{ $supplier['tagline'] }}</strong></div>
                    @foreach ($supplier['tagline_lines'] as $line)
                        <div class="supplier-line">{{ $line }}</div>
                    @endforeach
                </div>

                <div class="supplier-section">
                    <div class="supplier-line"><strong>{{ $supplier['office_label'] }}</strong></div>
                    @foreach ($supplier['office_lines'] as $line)
                        <div class="supplier-line">{{ $line }}</div>
                    @endforeach
                    <div class="supplier-line">{{ $supplier['phone'] }}</div>
                    <div class="supplier-line"><strong>{{ $supplier['email_label'] }}</strong></div>
                    <div class="supplier-line">{{ $supplier['email'] }}</div>
                </div>
            </td>
            <td class="customer-header">
                <div class="recipient-label">{{ $config['recipient_label'] }}</div>
                <div class="recipient-name">{{ $deliveryNote->customer->nama }}</div>
            </td>
        </tr>
    </table>

    <div class="title-row">
        <div class="document-title">{{ $config['document_title'] }}</div>
        <div class="document-number">{{ $deliveryNote->nomor_dn }}</div>
    </div>

    <div class="po-row">
        {{ $config['po_label'] }} {{ $deliveryNote->no_po ?: '-' }}
    </div>

    <table class="items">
        <thead>
            <tr>
                <th style="width: 5%">No.</th>
                <th>Description</th>
                <th style="width: 10%">Quantity</th>
                <th style="width: 8%">Unit</th>
                <th style="width: 14%">Unit Price</th>
                <th style="width: 14%">Total Price</th>
            </tr>
        </thead>
        <tbody>
            @for ($i = 0; $i < $itemRows; $i++)
                @php $item = $items[$i] ?? null; @endphp
                <tr @class(['empty-row' => $item === null])>
                    <td class="center">{{ $i + 1 }}</td>
                    @if ($item)
                        <td>{{ $item->product->nama_barang }}</td>
                        <td class="right">{{ $fmtQty((float) $item->qty) }}</td>
                        <td class="center">{{ $item->product->satuan }}</td>
                        <td class="right">{{ $fmtMoney((float) $item->harga) }}</td>
                        <td class="right">{{ $fmtMoney((float) $item->subtotal) }}</td>
                    @else
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    @endif
                </tr>
            @endfor
            <tr>
                <td colspan="4"></td>
                <td class="total-label-cell">
                    <div>TOTAL</div>
                    <div>AMOUNT</div>
                </td>
                <td class="total-value-cell">{{ $fmtMoney($totalAmount) }}</td>
            </tr>
        </tbody>
    </table>

    <table class="footer">
        <tr>
            <td class="footer-receipt">
                @foreach ($config['received_copies'] as $line)
                    <div class="footer-note">{{ $line }}</div>
                @endforeach
                <span class="signature-line">{{ $config['recipient_signature_name'] }}</span>
            </td>
            <td class="footer-issuer">
                <div class="footer-note" style="margin-bottom: 4px;">{{ $recipientCity }},</div>
                <div class="footer-note" style="margin-bottom: 50px;"><strong>{{ $config['issuer_label'] }}</strong></div>
                <div>{{ $config['issuer_signature_name'] }}</div>
            </td>
        </tr>
    </table>
</body>
</html>