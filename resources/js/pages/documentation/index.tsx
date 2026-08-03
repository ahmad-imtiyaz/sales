import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Settings, User, Key, Image, Building2, Users, Package, Banknote, Truck, FileText, FileBarChart, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { dashboard } from '@/routes';

interface Section {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    content: React.ReactNode;
}

const sections: Section[] = [
    {
        id: 'overview',
        title: 'Tentang Aplikasi',
        icon: BookOpen,
        content: (
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Aplikasi ini adalah sistem <strong>Mini ERP</strong> untuk mengelola <strong>Delivery Note (DN)</strong> dan <strong>Invoice</strong>, mendukung 2 perusahaan (CV Agus Jaya & CV Sumber Sukses Utama).
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h4 className="font-medium text-center">2 Perusahaan</h4>
                            <p className="text-sm text-muted-foreground text-center">CV Agus Jaya & CV Sumber Sukses Utama</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h4 className="font-medium text-center">DN & Invoice</h4>
                            <p className="text-sm text-muted-foreground text-center">Transaksi terintegrasi otomatis</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            <Settings className="h-8 w-8 text-primary mx-auto mb-2" />
                            <h4 className="font-medium text-center">PPN 11%</h4>
                            <p className="text-sm text-muted-foreground text-center">Flat dari subtotal invoice</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        ),
    },
    {
        id: 'master-data',
        title: 'Master Data',
        icon: Package,
        content: (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Building2 className="h-4 w-4" />
                                Perusahaan
                            </CardTitle>
                            <CardDescription>Nama, logo, alamat, telepon, email</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Digunakan untuk memilih perusahaan saat membuat DN & Invoice. Logo akan tampil di sidebar & halaman login.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Users className="h-4 w-4" />
                                Customer
                            </CardTitle>
                            <CardDescription>Nama, alamat, kota, PIC, telepon, email</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Data pelanggan yang akan dipilih saat membuat Delivery Note.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Package className="h-4 w-4" />
                                Barang
                            </CardTitle>
                            <CardDescription>Kode, nama, satuan, harga</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Master barang/jasa yang akan dipilih di Delivery Note. Harga otomatis terisi saat pilih barang.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Banknote className="h-4 w-4" />
                                Rekening
                            </CardTitle>
                            <CardDescription>Bank, no rekening, atas nama, perusahaan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Pilih rekening saat buat Invoice &rarr; footer PDF otomatis berubah sesuai rekening dipilih.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        ),
    },
    {
        id: 'delivery-note',
        title: 'Delivery Note (DN)',
        icon: Truck,
        content: (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Alur Membuat DN
                        </CardTitle>
                        <CardDescription>Dashboard &rarr; Delivery Note &rarr; Tambah</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ol className="space-y-2 list-decimal list-inside text-sm">
                            <li>Pilih <strong>Perusahaan</strong></li>
                            <li>Pilih <strong>Customer</strong></li>
                            <li>Input <strong>No. PO</strong></li>
                            <li>Input <strong>No. Delivery Note</strong></li>
                            <li>Input <strong>Tanggal</strong></li>
                            <li>Tambah Barang (bisa multiple baris)</li>
                            <li>Klik <strong>Simpan</strong></li>
                            <li>Cetak PDF</li>
                        </ol>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Status DN
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span className="font-medium text-green-700 dark:text-green-400">Available</span>
                            <span className="text-sm text-muted-foreground">DN baru dibuat, bisa dipakai untuk Invoice</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                            <span className="font-medium text-amber-700 dark:text-amber-400">Used</span>
                            <span className="text-sm text-muted-foreground">Sudah dijadikan Invoice, tidak bisa dipakai lagi (terkunci otomatis)</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        ),
    },
    {
        id: 'invoice',
        title: 'Invoice',
        icon: FileText,
        content: (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Alur Membuat Invoice
                        </CardTitle>
                        <CardDescription>Dashboard &rarr; Invoice &rarr; Tambah (data barang otomatis dari DN)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <ol className="space-y-2 list-decimal list-inside text-sm">
                            <li>Pilih <strong>Perusahaan</strong></li>
                            <li>Pilih <strong>Delivery Note</strong> (hanya yang status <code>available</code>)</li>
                            <li>Sistem otomatis ambil: Customer, Alamat, Barang, Qty, Harga</li>
                            <li>Input <strong>No. Invoice</strong></li>
                            <li>Input <strong>Tanggal Invoice</strong></li>
                            <li>Input <strong>No. PO</strong></li>
                            <li>Pilih <strong>Rekening</strong> (footer PDF otomatis ikut berubah)</li>
                            <li>Klik <strong>Simpan</strong> &rarr; DN terkait otomatis jadi <code>used</code></li>
                            <li>Cetak PDF</li>
                        </ol>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Perhitungan PPN
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="font-mono bg-muted p-3 rounded">
                            Subtotal = Σ (Qty × Harga) dari item DN<br />
                            PPN = Subtotal × 11% (flat)<br />
                            Grand Total = Subtotal + PPN
                        </div>
                    </CardContent>
                </Card>
            </div>
        ),
    },
    {
        id: 'reports',
        title: 'Laporan',
        icon: FileBarChart,
        content: (
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Truck className="h-4 w-4" />
                                Laporan Delivery Note
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Filter berdasarkan periode, perusahaan, customer. Export & cetak tersedia.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4" />
                                Laporan Invoice
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Rekap invoice per periode dengan subtotal, PPN, grand total. Filter perusahaan, rekening.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        ),
    },
    {
        id: 'settings',
        title: 'Pengaturan Website & Akun',
        icon: Settings,
        content: (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Image className="h-5 w-5" />
                            Pengaturan Website (Logo & Nama Company)
                        </CardTitle>
                        <CardDescription>Akses: Sidebar Settings &rarr; Pengaturan Website</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                                <h5 className="font-medium flex items-center gap-2">
                                    <Image className="h-4 w-4" />
                                    Logo Website
                                </h5>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>Format: <strong>SVG, PNG, JPG, GIF, WebP</strong></li>
                                    <li>Maksimal: <strong>2MB</strong></li>
                                    <li>Kosongkan untuk hapus logo (pakai default Laravel)</li>
                                    <li>Tampil di: Sidebar, Header, Halaman Login</li>
                                </ul>
                            </div>
                            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                                <h5 className="font-medium flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Nama Company
                                </h5>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>Contoh: <code>CV Agus Jaya</code></li>
                                    <li>Tampil di: Sidebar, Halaman Login (di bawah logo)</li>
                                    <li>Default: <code>config('app.name')</code></li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile (Nama & Email)
                        </CardTitle>
                        <CardDescription>Akses: Sidebar Settings &rarr; Profile</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Ganti <strong>Nama</strong> (tampil di header dropdown user)</li>
                            <li>Ganti <strong>Email</strong> (untuk login & notifikasi)</li>
                            <li>Klik <strong>Save</strong> untuk simpan</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            Security (Ganti Password)
                        </CardTitle>
                        <CardDescription>Akses: Sidebar Settings &rarr; Security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Input <strong>Password lama</strong></li>
                            <li>Input <strong>Password baru</strong> & konfirmasi</li>
                            <li>Klik <strong>Update Password</strong></li>
                            <li>Minimal 8 karakter, wajib huruf besar, kecil, angka, simbol</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Appearance (Tema)
                        </CardTitle>
                        <CardDescription>Akses: Sidebar Settings &rarr; Appearance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li><strong>Light</strong> / <strong>Dark</strong> / <strong>System</strong></li>
                            <li>Tersimpan di localStorage & database</li>
                            <li>Mengaruhi seluruh aplikasi</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        ),
    },
    {
        id: 'tips',
        title: 'Tips & Catatan Penting',
        icon: HelpCircle,
        content: (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <HelpCircle className="h-5 w-5" />
                            Perhatian
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>DN yang sudah dipakai Invoice tidak bisa dipakai lagi</strong> (status otomatis jadi <code>used</code>)</li>
                            <li><strong>1 DN = 1 Invoice</strong> (relasi unique di database)</li>
                            <li><strong>PPN selalu 11% flat</strong> dari subtotal, tidak bisa diubah</li>
                            <li>Rekening pada Invoice <strong>harus dipilih</strong>, tidak boleh kosong</li>
                            <li>Logo website: format SVG direkomendasikan untuk kualitas terbaik di semua ukuran</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Settings className="h-5 w-5" />
                            Keyboard Shortcuts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <div className="grid gap-2 md:grid-cols-2">
                            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + K</kbd>
                            <span>Search / Command palette (jika ada)</span>
                            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Esc</kbd>
                            <span>Tutup modal / dropdown</span>
                            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Tab</kbd>
                            <span>Navigasi form</span>
                            <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd>
                            <span>Submit form</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        ),
    },
];

export default function Documentation() {
    const [openSections, setOpenSections] = useState<string[]>(['overview']);

    const toggleSection = (id: string) => {
        setOpenSections(prev => prev.includes(id)
            ? prev.filter(s => s !== id)
            : [...prev, id]);
    };

    return (
        <>
            <Head title="Dokumentasi Aplikasi" />

            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={dashboard()}>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dokumentasi Aplikasi</h1>
                        <p className="text-muted-foreground">
                            Panduan lengkap penggunaan sistem Delivery Note & Invoice
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {sections.map((section) => {
                        const isOpen = openSections.includes(section.id);
                        return (
                            <Card key={section.id} className="overflow-hidden">
                                <CardHeader className="py-3 cursor-pointer" onClick={() => toggleSection(section.id)}>
                                    <div className="flex items-center gap-3">
                                        <section.icon className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">{section.title}</CardTitle>
                                        <span className="ml-auto text-muted-foreground">
                                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </span>
                                    </div>
                                </CardHeader>
                                {isOpen && (
                                    <CardContent className="pb-6">
                                        {section.content}
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
}