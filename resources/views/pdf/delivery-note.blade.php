<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Delivery Note {{ $deliveryNote->nomor_dn }}</title>
    <style>
        @page { margin: 28px 34px; }
        body { color: #202020; font-family: DejaVu Sans, sans-serif; font-size: 10px; line-height: 1.4; }
        table { border-collapse: collapse; width: 100%; }
        .header { border-bottom: 2px solid #202020; margin-bottom: 20px; padding-bottom: 12px; }
        .header td { vertical-align: top; }
        .logo { max-height: 54px; max-width: 120px; }
        .company-name { font-size: 20px; font-weight: bold; text-transform: uppercase; }
        .document-title { font-size: 18px; font-weight: bold; text-align: right; }
        .muted { color: #5f5f5f; }
        .info { margin-bottom: 18px; }
        .info td { vertical-align: top; width: 50%; }
        .info-right { padding-left: 36px; }
        .label { display: inline-block; font-weight: bold; width: 82px; }
        .items th, .items td { border: 1px solid #666; padding: 7px 6px; }
        .items th { background: #ececec; font-weight: bold; text-align: center; }
        .center { text-align: center; }
        .right { text-align: right; }
        .total-label { font-weight: bold; text-align: right; }
        .total-value { font-weight: bold; }
        .notes { margin-top: 14px; }
        .signatures { margin-top: 48px; page-break-inside: avoid; }
        .signatures td { text-align: center; vertical-align: top; width: 50%; }
        .signature-space { height: 64px; }
        .signature-name { border-top: 1px solid #202020; display: inline-block; min-width: 170px; padding-top: 4px; }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td>
                @if ($deliveryNote->company->logo)
                    <img class="logo" src="{{ public_path('storage/'.$deliveryNote->company->logo) }}" alt="Logo">
                @endif
                <div class="company-name">{{ $deliveryNote->company->nama }}</div>
                <div class="muted">{{ $deliveryNote->company->alamat }}</div>
                <div class="muted">
                    {{ $deliveryNote->company->telepon }}
                    @if ($deliveryNote->company->telepon && $deliveryNote->company->email) | @endif
                    {{ $deliveryNote->company->email }}
                </div>
            </td>
            <td class="document-title">DELIVERY NOTE</td>
        </tr>
    </table>

    <table class="info">
        <tr>
            <td>
                <strong>Kepada:</strong><br>
                <strong>{{ $deliveryNote->customer->nama }}</strong><br>
                {{ $deliveryNote->customer->alamat }}
                @if ($deliveryNote->customer->kota)<br>{{ $deliveryNote->customer->kota }}@endif
                @if ($deliveryNote->customer->pic)<br>Attn: {{ $deliveryNote->customer->pic }}@endif
            </td>
            <td class="info-right">
                <div><span class="label">No. DN</span>: {{ $deliveryNote->nomor_dn }}</div>
                <div><span class="label">No. PO</span>: {{ $deliveryNote->no_po ?: '-' }}</div>
                <div><span class="label">Tanggal</span>: {{ $deliveryNote->tanggal->locale('id')->translatedFormat('d F Y') }}</div>
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th style="width: 5%">No.</th>
                <th style="width: 13%">Kode</th>
                <th>Nama Barang</th>
                <th style="width: 9%">Qty</th>
                <th style="width: 10%">Satuan</th>
                <th style="width: 15%">Harga</th>
                <th style="width: 17%">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($deliveryNote->items as $item)
                <tr>
                    <td class="center">{{ $loop->iteration }}</td>
                    <td>{{ $item->product->kode }}</td>
                    <td>{{ $item->product->nama_barang }}</td>
                    <td class="right">{{ number_format((float) $item->qty, 2, ',', '.') }}</td>
                    <td class="center">{{ $item->product->satuan }}</td>
                    <td class="right">Rp {{ number_format((float) $item->harga, 0, ',', '.') }}</td>
                    <td class="right">Rp {{ number_format((float) $item->subtotal, 0, ',', '.') }}</td>
                </tr>
            @endforeach
            <tr>
                <td class="total-label" colspan="6">TOTAL</td>
                <td class="right total-value">Rp {{ number_format((float) $deliveryNote->items->sum('subtotal'), 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <div class="notes">Barang tersebut di atas telah diterima dalam keadaan baik dan lengkap.</div>

    <table class="signatures">
        <tr>
            <td>
                Diterima oleh,<div class="signature-space"></div>
                <span class="signature-name">Nama &amp; Tanda Tangan</span>
            </td>
            <td>
                Hormat kami,<br>{{ $deliveryNote->company->nama }}<div class="signature-space"></div>
                <span class="signature-name">Nama &amp; Tanda Tangan</span>
            </td>
        </tr>
    </table>
</body>
</html>
