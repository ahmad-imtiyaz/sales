<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Delivery Note — Supplier Identity
    |--------------------------------------------------------------------------
    |
    | Identity block rendered on the Delivery Note PDF header. Replace these
    | values (or read them from a Company model field once it supports them)
    | without editing the Blade template.
    |
    */

    'supplier' => [
        'name' => env('PDF_SUPPLIER_NAME', 'AGUS JAYA'),
        'tagline' => env('PDF_SUPPLIER_TAGLINE', 'GENERAL SUPPLIER :'),
        'tagline_lines' => [
            'Hydraulic Hose, Air Hose, Steam Hose, Spare Parts, Filter, Coupling',
            'Camlock, Perlengkapan Safety, Oli/Grease Pertamina, etc.',
        ],
        'office_label' => 'OFFICE :',
        'office_lines' => [
            'Jln. APT Pranoto RT 30 No.68',
            'Sangatta Utara, Kutai Timur',
            'Kalimantan Timur',
        ],
        'phone' => 'Telp. 0811 537 4040 / 0812 5481 2785',
        'email_label' => 'Email :',
        'email' => 'agusjaya74040@gmail.com',
    ],

    'invoice_supplier' => [
        'name' => 'CV. AGUS JAYA',
        'address_lines' => [
            'Jln. APT. Pranoto, RT 30. No. 68',
            'Sangatta, Kutai Timur, Kalimantan Timur.',
        ],
        'phone' => 'Phone 0811 53 7404 / 0811 58 9404',
        'email' => 'email : agusjaya7404@gmail.com',
    ],

    /*
    |--------------------------------------------------------------------------
    | Document Defaults
    |--------------------------------------------------------------------------
    */

    'document_title' => 'DELIVERY NOTE',
    'recipient_label' => 'Kepada Yth.',
    'po_label' => 'NO. PO :',
    'total_label' => 'TOTAL AMOUNT',
    'received_copies' => [
        'Tanda terima barang, Barang diatas telah kami terima dalam keadaan cukup dan baik.',
    ],
    'issuer_label' => 'Hormat Kami,',
    'issuer_signature_name' => env('PDF_ISSUER_NAME', 'Agus Sumanto'),
    'issuer_position' => 'Direktur',
    'recipient_signature_name' => env('PDF_RECIPIENT_NAME', 'Muktasir'),

    'item_rows' => 10,

    /*
    |--------------------------------------------------------------------------
    | Invoice — Specific
    |--------------------------------------------------------------------------
    |
    | Additional config for Invoice PDF that differs from Delivery Note.
    |
    */

    'invoice_title' => 'SALES INVOICE',
    'invoice_item_rows' => 16,
    'invoice_issuer_city' => 'Sangatta',
    'invoice_bank_branch' => 'Sangatta',
    'invoice_stamp' => env('PDF_INVOICE_STAMP'),
    'invoice_signature' => env('PDF_INVOICE_SIGNATURE'),
    'payment_label' => 'INFORMASI PEMBAYARAN',
    'ppn_rate' => 0.11,

];
