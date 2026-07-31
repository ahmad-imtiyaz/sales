@php
    $config = config('pdf');
    $supplier = $config['invoice_supplier'];
    $items = $invoice->deliveryNote->items;
    $emptyAreaHeight = max(90, ((int) $config['invoice_item_rows'] - $items->count()) * 15);
    $bankAccount = $invoice->bankAccount;

    $fmtMoney = fn (float $value): string => number_format($value, 0, ',', '.');
    $fmtQty = fn (float $value): string => number_format($value, fmod($value, 1.0) === 0.0 ? 0 : 2, ',', '.');
    $invoiceDate = $invoice->tanggal_invoice;
    $displayDate = $invoiceDate->format('j / n / Y');
    $signatureDate = $invoiceDate->locale('id')->translatedFormat('d F Y');
    $poNumber = $invoice->no_po ?: $invoice->deliveryNote->no_po ?: '-';
    $stampPath = $config['invoice_stamp'] ? public_path($config['invoice_stamp']) : null;
    $signaturePath = $config['invoice_signature'] ? public_path($config['invoice_signature']) : null;
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Sales Invoice {{ $invoice->nomor_invoice }}</title>
    <style>
        @page { margin: 24px 32px; }
        body { color: #000; font-family: DejaVu Sans, sans-serif; font-size: 9px; line-height: 1.3; }
        table { border-collapse: collapse; width: 100%; }
        .company-header { border-bottom: 2px solid #000; padding-bottom: 7px; text-align: center; }
        .company-name { font-size: 19px; font-weight: bold; letter-spacing: .7px; }
        .company-line { margin: 1px 0; }
        .company-email { text-decoration: underline; }
        .document-title { font-size: 14px; font-weight: bold; margin: 8px 0 10px; text-align: center; text-decoration: underline; }
        .party-table { margin-bottom: 8px; }
        .party-table td { vertical-align: top; }
        .invoice-meta { width: 45%; padding-right: 18px; }
        .customer { width: 55%; padding-left: 18px; }
        .meta-label { display: inline-block; font-weight: bold; width: 78px; }
        .customer-name { font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .customer-address { margin-top: 1px; }
        .items { table-layout: fixed; }
        .items th, .items td { border: 1px solid #000; padding: 4px 5px; }
        .items th { font-weight: bold; }
        .items .description { text-align: left; }
        .center { text-align: center; }
        .right { text-align: right; }
        .item-row td { height: 16px; }
        .blank-space td { height: {{ $emptyAreaHeight }}px; vertical-align: top; }
        .blank-space .blank-number { color: transparent; }
        .total-label { font-weight: normal; text-align: right; }
        .total-value { text-align: right; }
        .total-row td { border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; font-weight: bold; }
        .terbilang { margin-top: 9px; max-width: 96%; }
        .terbilang-label { font-weight: bold; }
        .footer { margin-top: 17px; page-break-inside: avoid; }
        .footer td { vertical-align: top; }
        .payment { width: 56%; }
        .signature-block { width: 44%; text-align: center; }
        .payment-title { margin-bottom: 3px; }
        .payment-company { font-weight: bold; text-transform: uppercase; }
        .stamp-signature-area { height: 65px; margin: 3px auto 0; position: relative; width: 155px; }
        .stamp-image { height: 64px; left: 38px; opacity: .72; position: absolute; top: 0; width: 78px; }
        .signature-image { height: 55px; left: 12px; position: absolute; top: 5px; width: 125px; }
        .issuer-name { font-weight: bold; }
        .issuer-position { margin-top: 1px; }
    </style>
</head>
<body>
    <div class="company-header">
        <div class="company-name">{{ $supplier['name'] }}</div>
        @foreach ($supplier['address_lines'] as $line)
            <div class="company-line">{{ $line }}</div>
        @endforeach
        <div class="company-line">{{ $supplier['phone'] }}</div>
        <div class="company-line company-email">{{ $supplier['email'] }}</div>
    </div>

    <div class="document-title">{{ $config['invoice_title'] }}</div>

    <table class="party-table">
        <tr>
            <td class="invoice-meta">
                <div><span class="meta-label">Invoice No.</span>: {{ $invoice->nomor_invoice }}</div>
                <div><span class="meta-label">Invoice Date</span>: {{ $displayDate }}</div>
                <div><span class="meta-label">Ref. No. PO</span>: {{ $poNumber }}</div>
            </td>
            <td class="customer">
                <div class="customer-name">{{ $invoice->customer->nama }}</div>
                {{-- alamat may contain multiple lines (as in the source document, e.g.
                     "PONDOK INDAH OFFICE TOWER 3 LT.12\nJL. SULTAN ISKANDAR MUDA KAV.V-TA\n...")
                     preserve line breaks instead of forcing it into one line --}}
                <div class="customer-address">{!! nl2br(e($invoice->customer->alamat)) !!}</div>
                @if ($invoice->customer->kota)
                    <div>{{ $invoice->customer->kota }}</div>
                @endif
            </td>
        </tr>
    </table>

    <table class="items">
        <colgroup>
            <col style="width: 5%">
            <col style="width: 41%">
            <col style="width: 8%">
            <col style="width: 8%">
            <col style="width: 18%">
            <col style="width: 20%">
        </colgroup>
        <thead>
            <tr>
                <th class="center">No.</th>
                <th class="description">Description</th>
                <th class="center">Qty</th>
                <th class="center">Unit</th>
                <th class="right">Unit Price Rp.</th>
                <th class="right">Amount Rp.</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($items as $item)
                <tr class="item-row">
                    <td class="center">{{ $loop->iteration }}</td>
                    <td>{{ $item->product->nama_barang }}</td>
                    <td class="center">{{ $fmtQty((float) $item->qty) }}</td>
                    <td class="center">{{ $item->product->satuan }}</td>
                    <td class="right">{{ $fmtMoney((float) $item->harga) }}</td>
                    <td class="right">{{ $fmtMoney((float) $item->subtotal) }}</td>
                </tr>
            @endforeach
            <tr class="blank-space">
                <td class="blank-number"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colspan="4" rowspan="3"></td>
                <td class="total-label">Subtotal</td>
                <td class="total-value">{{ $fmtMoney((float) $invoice->subtotal) }}</td>
            </tr>
            <tr>
                <td class="total-label">PPN</td>
                <td class="total-value">{{ $fmtMoney((float) $invoice->ppn) }}</td>
            </tr>
            <tr class="total-row">
                <td class="total-label">Total</td>
                <td class="total-value">{{ $fmtMoney((float) $invoice->grand_total) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="terbilang">
        <span class="terbilang-label">Terbilang :</span> {{ $terbilang }}
    </div>

    <table class="footer">
        <tr>
            <td class="payment">
                <div class="payment-title">Pembayaran agar ditransfer ke Rekening</div>
                <div class="payment-company">{{ $invoice->company->nama }} No. Rek {{ $bankAccount->nomor_rekening }}</div>
                <div>Bank {{ $bankAccount->nama_bank }} Cabang {{ $config['invoice_bank_branch'] }}</div>
            </td>
            <td class="signature-block">
                <div>{{ $config['invoice_issuer_city'] }}, {{ $signatureDate }}</div>
                <div class="stamp-signature-area">
                    @if ($stampPath && file_exists($stampPath))
                        <img class="stamp-image" src="{{ $stampPath }}" alt="Stempel">
                    @endif
                    @if ($signaturePath && file_exists($signaturePath))
                        <img class="signature-image" src="{{ $signaturePath }}" alt="Tanda tangan">
                    @endif
                </div>
                <div class="issuer-name">{{ $config['issuer_signature_name'] }}</div>
                <div class="issuer-position">{{ $config['issuer_position'] }}</div>
            </td>
        </tr>
    </table>
</body>
</html>