# Spesifikasi Aplikasi — Delivery Note & Invoice (Mini ERP)

> **Catatan penting:** Di dalam Invoice terdapat **PPN flat 11%** dari subtotal.

## 1. Ringkasan

Aplikasi web sederhana bergaya mini-ERP untuk mengelola **Delivery Note (DN)** dan **Invoice**, mendukung **2 perusahaan** (CV Agus Jaya & CV Sumber Sukses Utama). Invoice tidak input barang ulang — semua data barang & customer diambil otomatis dari Delivery Note yang dipilih. Rekening pembayaran pada Invoice dipilih dari Master Rekening, sehingga info transfer di PDF bisa berubah tanpa edit template.

## 2. Tech Stack

| Komponen | Pilihan |
|---|---|
| Framework | **Laravel 12** |
| Database | **MySQL**, nama database: `invoice` |
| Auth / Login | **Laravel Breeze** (single admin user, tidak ada multi-role) |
| PDF Generator | **barryvdh/laravel-dompdf** |

**.env (relevan):**
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=invoice
DB_USERNAME=root
DB_PASSWORD=
```

## 3. Flow Sistem (Sitemap)

```
Login
  │
  ▼
Dashboard
  │
  ├── Master
  │      ├── Perusahaan
  │      ├── Customer
  │      ├── Barang
  │      └── Rekening
  │
  ├── Transaksi
  │      ├── Delivery Note
  │      └── Invoice
  │
  ├── Laporan
  │      ├── Delivery Note
  │      └── Invoice
  │
  └── Logout
```

## 4. Modul Master

### 4.1 Master Perusahaan
Dipakai untuk memilih perusahaan saat membuat Delivery Note maupun Invoice.

**Field:** Nama Perusahaan, Logo, Alamat, Telepon, Email

**Data awal:**
- CV Agus Jaya
- CV Sumber Sukses Utama

### 4.2 Master Customer
**Field:** Nama Customer, Alamat, Kota, PIC, Telepon, Email

**Contoh:** PT Orica Mining Services

### 4.3 Master Barang
**Field:** Kode Barang, Nama Barang, Satuan, Harga

### 4.4 Master Rekening
Karena rekening pada invoice bisa berubah-ubah, dibuat master sendiri.

**Field:** Nama Bank, Nomor Rekening, Atas Nama, Perusahaan (relasi ke Master Perusahaan), Status Aktif

**Contoh data:**

| Bank | No Rekening | Atas Nama | Perusahaan |
|---|---|---|---|
| BRI | 0563-01-000400-30-3 | CV Agus Jaya | Agus Jaya |
| BCA | 123456789 | CV Agus Jaya | Agus Jaya |
| Mandiri | 987654321 | CV Sumber Sukses Utama | SSU |

## 5. Modul Delivery Note

### Flow
```
Dashboard → Delivery Note → Tambah Delivery Note
  → Pilih Perusahaan
  → Pilih Customer
  → Input No. PO
  → Input No. Delivery Note
  → Input Tanggal
  → Tambah Barang
  → Simpan
  → Cetak PDF
```

### Form
- Perusahaan
- Customer
- No PO
- No Delivery Note
- Tanggal
- --- Daftar Barang ---
- Barang, Qty, Harga (tombol "Tambah Barang" untuk baris berikutnya)
- --- Simpan ---

### Status DN
Setiap DN punya status **`available`** atau **`used`**.
- Saat DN pertama kali dibuat → status `available`.
- Saat DN dipilih dan berhasil disimpan sebagai Invoice → status otomatis berubah jadi `used`.
- DN berstatus `used` **tidak muncul lagi** di dropdown pemilihan DN saat membuat Invoice baru (tidak bisa dipakai dobel).

## 6. Modul Invoice

Invoice **tidak** menginput barang lagi — semua barang berasal dari Delivery Note.

### Flow
```
Dashboard → Invoice → Tambah Invoice
  → Pilih Perusahaan
  → Pilih Delivery Note (hanya yang berstatus "available")
  → Sistem otomatis mengambil: Customer, Alamat Customer, Barang, Qty
  → Input No Invoice
  → Input Tanggal Invoice
  → Input No PO
  → Pilih Rekening
  → Simpan (DN terkait otomatis dikunci → status "used")
  → Cetak PDF
```

### Form
- Perusahaan
- No Delivery Note (Customer muncul otomatis)
- --- 
- No Invoice
- Tanggal Invoice
- No PO
- Rekening (dropdown dari Master Rekening)
- ---
- Barang (otomatis), Qty, Harga, Total
- Subtotal, **PPN 11% (flat)**, Grand Total
- --- Simpan ---

### Perilaku saat memilih Delivery Note
Contoh: dipilih **DN-00987** → otomatis muncul:
- Customer: PT ORICA MINING SERVICES
- Alamat: Pondok Indah Office Tower 3, Jl Sultan Iskandar Muda
- Barang: Material Renovasi Ruang TBT
- Qty: 1, Harga: 413.500

Tidak perlu mengetik ulang.

### Perilaku saat memilih Rekening
Dropdown contoh:
- BRI - 0563-01-000400-30-3
- BCA - 123456789
- Mandiri - 987654321

Jika dipilih **BRI**, footer PDF invoice otomatis:
```
Pembayaran agar ditransfer ke rekening
CV AGUS JAYA
Bank BRI
0563-01-000400-30-3
```

Jika dipilih **Mandiri**, langsung berubah:
```
Pembayaran agar ditransfer ke rekening
CV AGUS JAYA
Bank Mandiri
987654321
```

Jadi tidak perlu edit template PDF secara manual.

## 7. Relasi Database

```
Company
   │
   ├────────────┐
   │            │
Customer     Rekening
   │            │
Delivery Note   │
      │         │
      ▼         │
Delivery Note Item
      │
      ▼
Invoice ──────────────► Rekening
      │
      ▼
Invoice Item (opsional)
```

## 8. Struktur Database

```
companies
  id
  nama
  logo
  alamat
  telepon
  email

customers
  id
  nama
  alamat
  telepon
  email

products
  id
  kode
  nama_barang
  satuan
  harga

bank_accounts
  id
  company_id
  nama_bank
  nomor_rekening
  atas_nama
  status

delivery_notes
  id
  company_id
  customer_id
  nomor_dn
  tanggal
  no_po
  status          -- enum: available | used

delivery_note_items
  id
  delivery_note_id
  product_id
  qty
  harga
  subtotal

invoices
  id
  delivery_note_id     -- unique, 1 DN hanya boleh dipakai 1 invoice
  company_id
  customer_id
  bank_account_id
  nomor_invoice
  tanggal_invoice
  no_po
  subtotal
  ppn          -- flat 11% dari subtotal
  grand_total
```

## 9. Aturan Perhitungan PPN

- PPN dihitung **flat 11%** dari subtotal invoice.
- `subtotal = SUM(qty * harga)` dari seluruh item Delivery Note terkait.
- `ppn = subtotal * 0.11`
- `grand_total = subtotal + ppn`

## 10. Keunggulan Sistem

- Mendukung 2 perusahaan (Agus Jaya & Sumber Sukses Utama), template PDF menyesuaikan otomatis.
- Invoice mengambil data barang langsung dari Delivery Note — tidak ada input ulang.
- Customer dan alamat otomatis muncul berdasarkan Delivery Note yang dipilih.
- Rekening pembayaran dapat dipilih dari Master Rekening, footer PDF berubah otomatis sesuai pilihan.
- DN yang sudah dipakai jadi Invoice otomatis terkunci, mencegah dobel pemakaian.
- Login sederhana 1 admin (Laravel Breeze), siap dikembangkan ke multi-user/role di masa mendatang.
- Siap dikembangkan ke fitur tambahan: approval, export Excel, laporan penjualan.
