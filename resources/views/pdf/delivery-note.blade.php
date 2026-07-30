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
    $documentDate = $deliveryNote->tanggal->locale('id')->translatedFormat('d F Y');
    $signedAt = "{$recipientCity}, {$documentDate}";
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
        .header { margin-bottom: 6px; }
        .header > tbody > tr > td { vertical-align: top; }
        .supplier { width: 42%; padding-right: 12px; }
        .title-block { width: 22%; text-align: center; vertical-align: top; }
        .recipient { width: 36%; padding-left: 12px; }
        .supplier-name { font-size: 24px; font-weight: bold; letter-spacing: 1px; margin-bottom: 4px; }
        .supplier-line { margin: 0; }
        .supplier-section { margin-top: 8px; }
        .supplier-section .supplier-line { margin: 0; }
        .document-title { font-size: 18px; font-weight: bold; text-decoration: underline; margin-bottom: 6px; }
        .document-number { font-size: 14px; font-weight: bold; margin-bottom: 18px; }
        .po-line { font-weight: bold; margin-top: 4px; }
        .recipient-label { margin-bottom: 4px; }
        .recipient-name { font-size: 12px; font-weight: bold; margin-bottom: 8px; }
        .info-divider { border-bottom: 1px solid #000; margin: 8px 0 0; }
        .items { margin-top: 4px; }
        .items th, .items td { border: 1px solid #000; padding: 6px; }
        .items th { text-align: center; text-transform: uppercase; font-weight: bold; }
        .center { text-align: center; }
        .right { text-align: right; }
        .empty-row td { height: 18px; }
        .total-row td { font-weight: bold; }
        .total-row td.label { text-align: right; }
        .totals { margin-top: 6px; width: 50%; margin-left: auto; }
        .totals td { padding: 4px 8px; }
        .totals .label { text-align: right; font-weight: bold; }
        .totals .value { text-align: right; font-weight: bold; min-width: 110px; }
        .footer { margin-top: 28px; }
        .footer > tbody > tr > td { vertical-align: top; }
        .footer-receipt { width: 50%; padding-right: 24px; }
        .footer-issuer { width: 50%; padding-left: 24px; }
        .footer-note { font-style: italic; margin-bottom: 60px; }
        .signature-line { border-top: 1px solid #000; display: inline-block; min-width: 150px; padding-top: 2px; margin-top: 60px; }
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
                    <div class="supplier-line"><strong>{{ $supplier['email_label'] }}</strong> {{ $supplier['email'] }}</div>
                </div>
            </td>
            <td class="title-block">
                <div class="document-title">{{ $config['document_title'] }}</div>
                <div class="document-number">{{ $deliveryNote->nomor_dn }}</div>
                <div class="po-line">{{ $config['po_label'] }} {{ $deliveryNote->no_po ?: '-' }}</div>
            </td>
            <td class="recipient">
                <div class="recipient-label">{{ $config['recipient_label'] }}</div>
                <div class="recipient-name">{{ $deliveryNote->customer->nama }}</div>
            </td>
        </tr>
    </table>

    <div class="info-divider"></div>

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
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td class="label">{{ $config['total_label'] }}</td>
            <td class="value">{{ $fmtMoney($totalAmount) }}</td>
        </tr>
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
                <div class="footer-note">{{ $signedAt }}</div>
                <div class="footer-note"><strong>{{ $config['issuer_label'] }}</strong></div>
                <span class="signature-line">{{ $config['issuer_signature_name'] }}</span>
            </td>
        </tr>
    </table>
</body>
</html>
