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
    'issuer_signature_name' => env('PDF_ISSUER_NAME', 'Agus Jaya'),
    'recipient_signature_name' => env('PDF_RECIPIENT_NAME', 'Muktasir'),

    'item_rows' => 10,

];
