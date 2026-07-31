@php
    $config = config('pdf');
    $supplier = $config['supplier'];
    $items = $invoice->deliveryNote->items;
    $itemRows = max((int) $config['item_rows'], $items->count());
    $bankAccount = $invoice->bankAccount;

    $fmtMoney = fn (float $value): string => number_format($value, 0, ',', '.');
    $fmtQty = fn (float $value): string => number_format($value, fmod($value, 1.0) === 0.0 ? 0 : 2, ',', '.');
    $documentDate = $invoice->tanggal_invoice->locale('id')->translatedFormat('d F Y');
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $invoice->nomor_invoice }}</title>
    <style>
        @page { margin: 20px 24px; }
        body { color: #000; font-family: DejaVu Sans, sans-serif; font-size: 9px; line-height: 1.25; }
        table { border-collapse: collapse; width: 100%; }
        .header td { vertical-align: top; }
        .supplier { width: 50%; }
        .customer { width: 50%; padding-left: 26px; }
        .supplier-name { font-size: 22px; font-weight: bold; letter-spacing: 1px; }
        .supplier-block { margin-top: 5px; }
        .line { margin: 0; }
        .customer-label { margin-bottom: 3px; }
        .customer-name { font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .meta { margin: 7px 0 5px; }
        .meta td { vertical-align: bottom; }
        .title-cell { text-align: center; width: 50%; }
        .title { font-size: 18px; font-weight: bold; text-decoration: underline; }
        .invoice-number { font-size: 12px; font-weight: bold; margin-top: 2px; }
        .details { width: 50%; padding-left: 26px; }
        .details-label { display: inline-block; width: 75px; font-weight: bold; }
        .items { margin-top: 5px; }
        .items thead { display: table-header-group; }
        .items tr { page-break-inside: avoid; }
        .items th, .items td { border: 1px solid #000; padding: 4px 5px; }
        .items th { font-weight: bold; text-align: center; text-transform: uppercase; }
        .empty-row td { height: 13px; }
        .center { text-align: center; }
        .right { text-align: right; }
        .summary { margin-top: 5px; page-break-inside: avoid; }
        .summary-left { width: 59%; vertical-align: top; padding-right: 10px; }
        .summary-right { width: 41%; vertical-align: top; }
        .terbilang-label { font-weight: bold; margin-bottom: 2px; }
        .terbilang { font-style: italic; border: 1px solid #000; min-height: 31px; padding: 5px; }
        .totals td { padding: 3px 5px; }
        .totals .label { font-weight: bold; text-align: right; }
        .totals .value { font-weight: bold; text-align: right; width: 110px; }
        .grand td { border-top: 1px solid #000; font-size: 10px; }
        .footer { margin-top: 14px; page-break-inside: avoid; }
        .payment { width: 55%; vertical-align: top; }
        .signature { width: 45%; padding-left: 30px; text-align: center; vertical-align: top; }
        .payment-title { margin-bottom: 4px; }
        .payment-company { font-weight: bold; text-transform: uppercase; }
        .signature-space { height: 48px; }
        .signature-name { border-top: 1px solid #000; display: inline-block; min-width: 150px; padding-top: 2px; }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td class="supplier">
                <div class="supplier-name">{{ $supplier['name'] }}</div>
                <div class="supplier-block">
                    <div class="line"><strong>{{ $supplier['tagline'] }}</strong></div>
                    @foreach ($supplier['tagline_lines'] as $line)
                        <div class="line">{{ $line }}</div>
                    @endforeach
                </div>
                <div class="supplier-block">
                    <div class="line"><strong>{{ $supplier['office_label'] }}</strong></div>
                    @foreach ($supplier['office_lines'] as $line)
                        <div class="line">{{ $line }}</div>
                    @endforeach
                    <div class="line">{{ $supplier['phone'] }}</div>
                    <div class="line"><strong>{{ $supplier['email_label'] }}</strong> {{ $supplier['email'] }}</div>
                </div>
            </td>
            <td class="customer">
                <div class="customer-label">{{ $config['recipient_label'] }}</div>
                <div class="customer-name">{{ $invoice->customer->nama }}</div>
                <div>{{ $invoice->customer->alamat }}</div>
                @if ($invoice->customer->kota)<div>{{ $invoice->customer->kota }}</div>@endif
                @if ($invoice->customer->pic)<div>Attn: {{ $invoice->customer->pic }}</div>@endif
            </td>
        </tr>
    </table>

    <table class="meta">
        <tr>
            <td class="title-cell">
                <div class="title">{{ $config['invoice_title'] }}</div>
                <div class="invoice-number">{{ $invoice->nomor_invoice }}</div>
            </td>
            <td class="details">
                <div><span class="details-label">Tanggal</span>: {{ $documentDate }}</div>
                <div><span class="details-label">No. PO</span>: {{ $invoice->no_po ?: $invoice->deliveryNote->no_po ?: '-' }}</div>
                <div><span class="details-label">No. DN</span>: {{ $invoice->deliveryNote->nomor_dn }}</div>
            </td>
        </tr>
    </table>

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
                        <td></td><td></td><td></td><td></td><td></td>
                    @endif
                </tr>
            @endfor
        </tbody>
    </table>

    <table class="summary">
        <tr>
            <td class="summary-left">
                <div class="terbilang-label">Terbilang:</div>
                <div class="terbilang"># {{ $terbilang }} #</div>
            </td>
            <td class="summary-right">
                <table class="totals">
                    <tr><td class="label">Subtotal</td><td class="value">{{ $fmtMoney((float) $invoice->subtotal) }}</td></tr>
                    <tr><td class="label">PPN 11%</td><td class="value">{{ $fmtMoney((float) $invoice->ppn) }}</td></tr>
                    <tr class="grand"><td class="label">Grand Total</td><td class="value">{{ $fmtMoney((float) $invoice->grand_total) }}</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <table class="footer">
        <tr>
            <td class="payment">
                <div class="payment-title">Pembayaran agar ditransfer ke rekening</div>
                <div class="payment-company">{{ $invoice->company->nama }}</div>
                <div>Bank {{ $bankAccount->nama_bank }}</div>
                <div>{{ $bankAccount->nomor_rekening }}</div>
                <div>a.n. {{ $bankAccount->atas_nama }}</div>
            </td>
            <td class="signature">
                <div>{{ $invoice->customer->kota ?: 'Sangatta' }}, {{ $documentDate }}</div>
                <div><strong>{{ $config['issuer_label'] }}</strong></div>
                <div class="signature-space"></div>
                <span class="signature-name">{{ $config['issuer_signature_name'] }}</span>
            </td>
        </tr>
    </table>
</body>
</html>
