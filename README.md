# Sales Mini ERP — Delivery Note & Invoice System

Aplikasi **Mini ERP** berbasis Laravel 13 + React (Inertia.js) untuk mengelola **Delivery Note (DN)** dan **Invoice** dengan mendukung multi-perusahaan (CV Agus Jaya & CV Sumber Sukses Utama).

> **Catatan:** Di dalam Invoice terdapat **PPN flat 11%** dari subtotal.

---

## 🎯 Ringkasan Fitur

| Modul | Deskripsi |
|-------|-----------|
| **Master Perusahaan** | CRUD perusahaan (logo, alamat, telepon, email) |
| **Master Customer** | CRUD customer (nama, alamat, kota, PIC, telepon, email) |
| **Master Barang** | CRUD barang (kode, nama, satuan, harga) |
| **Master Rekening** | CRUD rekening bank per perusahaan |
| **Delivery Note** | Buat DN, pilih barang, cetak PDF, status `available`/`used` |
| **Invoice** | Buat dari DN (data barang otomatis), PPN 11%, pilih rekening, cetak PDF |
| **Laporan** | Filter & export laporan DN & Invoice per periode |
| **Pengaturan Website** | Upload logo (SVG/PNG/JPG), ganti nama company |
| **Profil & Security** | Ganti nama/email, ganti password, tema (Light/Dark/System) |

---

## 🛠 Tech Stack

| Komponen | Versi |
|----------|-------|
| **Backend** | Laravel 13 (PHP 8.4) |
| **Frontend** | React 19 + Inertia.js v3 |
| **Styling** | Tailwind CSS v4 + Shadcn/UI |
| **Database** | MySQL |
| **Auth** | Laravel Breeze (Fortify) |
| **PDF** | barryvdh/laravel-dompdf |
| **Testing** | Pest PHP |
| **Code Style** | Laravel Pint, ESLint, Prettier, PHPStan |
| **Routing (FE)** | Laravel Wayfinder (type-safe routes) |

---

## 📋 Requirements

- **PHP** >= 8.4
- **Composer** >= 2.x
- **Node.js** >= 22.x (LTS)
- **npm** >= 10.x
- **MySQL** >= 8.0 / MariaDB >= 10.5

---

## ⚡ Quick Start (Development)

### 1. Clone Repository

```bash
git clone https://github.com/ahmad-imtiyaz/sales.git
cd sales
```

### 2. Install Dependencies

```bash
# Backend
composer install

# Frontend
npm install
```

### 3. Environment Setup

```bash
# Copy file env
cp .env.example .env

# Generate APP_KEY
php artisan key:generate
```

Edit `.env` dan sesuaikan database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=invoice
DB_USERNAME=root
DB_PASSWORD=
```

> **Tip:** Database `invoice` harus sudah dibuat di MySQL sebelum migrate.

### 4. Migrasi & Seeding

```bash
# Jalankan migrasi + seeder (master data + user admin)
php artisan migrate:fresh --seed
```

Seeder akan membuat:
- 2 Perusahaan: **CV Agus Jaya**, **CV Sumber Sukses Utama**
- Sample Customer, Barang, Rekening Bank
- User Admin: `admin@gmail.com` / `password`
- Setting default: `site_name = "CV Agus Jaya"`, `logo = null`

### 5. Build Frontend & Jalankan Server

```bash
# Development (hot reload)
npm run dev

# Atau production build
npm run build
```

```bash
# Terminal terpisah - jalankan Laravel server
php artisan serve
```

Akses: **http://127.0.0.1:8000**

---

## 🔐 Login Default

| Email | Password |
|-------|----------|
| `admin@gmail.com` | `password` |

> **Catatan:** User dibuat via `DatabaseSeeder`. Ganti password setelah login pertama via menu **Settings → Security**.

---

## 🎮 Cara Menggunakan

### 1. Master Data (Wajib diisi dulu)

| Menu | Aksi |
|------|------|
| **Perusahaan** | Tambah/Edit logo, alamat, telepon, email |
| **Customer** | Tambah data pelanggan (nama, alamat, PIC, dll) |
| **Barang** | Tambah master barang (kode, nama, satuan, harga) |
| **Rekening** | Tambah rekening bank per perusahaan (footer Invoice otomatis ikut berubah) |

### 2. Delivery Note (DN)

1. Masuk menu **Delivery Note → Tambah**
2. Isi: Perusahaan, Customer, No. PO, No. DN, Tanggal
3. Tambah Barang (bisa multiple baris)
4. **Simpan** → Status otomatis `Available`
5. Cetak PDF jika perlu

### 3. Invoice

1. Masuk menu **Invoice → Tambah**
2. Pilih **Perusahaan** & **Delivery Note** (hanya yang status `Available`)
3. Data Customer, Barang, Qty, Harga → **otomatis terisi** dari DN
4. Isi: No. Invoice, Tanggal, No. PO
5. Pilih **Rekening** (footer PDF ikut berubah)
6. **Simpan** → DN terkait otomatis jadi `Used` (tidak bisa dipakai lagi)
7. Cetak PDF

### 4. Laporan

- **Laporan DN** → Filter: tanggal, perusahaan, customer, status
- **Laporan Invoice** → Filter: tanggal, perusahaan, rekening
- Bisa **Cetak** & **Export**

### 5. Pengaturan Website (Settings → Pengaturan Website)

| Field | Format | Maksimal | Tampil Di |
|-------|--------|----------|-----------|
| **Logo** | SVG, PNG, JPG, GIF, WebP | 2 MB | Sidebar, Header, Login Page, Favicon |
| **Nama Company** | Text | 255 char | Sidebar, Login Page |

> Jika logo belum di-set → pakai default Laravel logo
> Jika nama company belum di-set → pakai `config('app.name')`

---

## 📁 Struktur Project (Penting)

```
app/
├── Http/
│   ├── Controllers/          # Semua controller (Resource + Custom)
│   ├── Middleware/
│   │   └── HandleInertiaRequests.php  # Share data (name, logo, auth) ke FE
│   ├── Requests/             # FormRequest validation
│   └── Resources/
├── Models/                   # Eloquent Models + Relations
└── Providers/
    └── FortifyServiceProvider.php

database/
├── migrations/               # Schema tables
├── seeders/                  # DatabaseSeeder + Master seeders
└── factories/                # Model factories

resources/
├── js/
│   ├── pages/                # Inertia Pages (React)
│   │   ├── settings/         # Website, Profile, Security, Appearance
│   │   ├── companies/        # CRUD Master
│   │   ├── customers/
│   │   ├── products/
│   │   ├── bank-accounts/
│   │   ├── delivery-notes/   # DN + Print
│   │   ├── invoices/         # Invoice + Print
│   │   ├── laporan/          # Reports
│   │   └── documentation/    # Internal docs page
│   ├── components/           # Shared UI components
│   ├── layouts/              # AppLayout, AuthLayout, SettingsLayout
│   ├── hooks/                # Custom React hooks
│   ├── routes/               # Wayfinder generated (type-safe)
│   └── app.tsx               # Entry point
├── views/
│   └── app.blade.php         # Root template + dynamic favicon

routes/
├── web.php                   # Main routes
└── settings.php              # Profile, Security, Appearance routes
```

---

## 🧪 Testing

```bash
# Jalankan semua test (Pest)
php artisan test

# Atau dengan filter
php artisan test --filter=Invoice

# Test coverage (jika dikonfigurasi)
php artisan test --coverage
```

- **50 tests** covering: Auth, CRUD Master, DN/Invoice flow, PDF Print, Laporan, Settings
- Test menggunakan `RefreshDatabase` + Factories

---

## 🧹 Code Quality (CI Checks)

```bash
# Lint JS/TS
npm run lint:check

# Format check
npm run format:check

# TypeScript check
npm run types:check

# PHP Code Style (Pint)
vendor/bin/pint --parallel --test

# Static Analysis (PHPStan)
phpstan analyse

# Build production
npm run build
```

Semua checks dijalankan otomatis di **GitHub Actions** (`.github/workflows/tests.yml`) saat push ke `main`.

---

## 🚀 Deployment (Production)

### 1. Server Requirements

- PHP 8.4 + extensions: `bcmath`, `ctype`, `fileinfo`, `gd`, `mbstring`, `pdo_mysql`, `xml`, `zip`
- Node.js 22+ (untuk build assets)
- MySQL 8.0+
- Nginx/Apache + SSL

### 2. Deploy Steps

```bash
# Di server
git clone https://github.com/ahmad-imtiyaz/sales.git
cd sales

composer install --optimize-autoloader --no-dev
npm ci && npm run build

cp .env.example .env
# Edit .env production (APP_ENV=production, APP_DEBUG=false, DB_*, dll)

php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Storage link (untuk logo upload)
php artisan storage:link

# Queue worker (jika pakai queue)
php artisan queue:work --daemon
```

### 3. Nginx Config (Contoh)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/sales/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| **Logo/favicon tidak muncul** | `php artisan storage:link` + cek `public/storage/settings/` |
| **Vite manifest not found** | `npm run build` (production) atau `npm run dev` (development) |
| **Migration error** | Pastikan DB `invoice` sudah dibuat, user MySQL punya privilege |
| **PDF error (dompdf)** | Install font: `apt-get install fonts-dejavu-core` (Linux) |
| **Session/CSRF error** | `php artisan config:clear && php artisan cache:clear` |
| **Wayfinder route not found** | `php artisan wayfinder:generate` setelah tambah route baru |

---

## 📄 License

MIT License — bebas digunakan, dimodifikasi, dan didistribusikan.

---

## 👨‍💻 Author

**Ahmad Imtiyaz**  
GitHub: [@ahmad-imtiyaz](https://github.com/ahmad-imtiyaz)

---

## 🙏 Acknowledgments

- Laravel Framework
- Inertia.js + React
- Shadcn/UI + Tailwind CSS
- Laravel Breeze / Fortify
- barryvdh/laravel-dompdf
- Pest PHP
- Laravel Wayfinder