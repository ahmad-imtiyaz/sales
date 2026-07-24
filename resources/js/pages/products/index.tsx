import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Package } from 'lucide-react';
import products from '@/routes/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form } from '@inertiajs/react';
import { toast } from 'sonner';
import { Pagination } from '@/components/ui/pagination';
import { useState } from 'react';

interface Product {
    id: number;
    kode: string;
    nama_barang: string;
    satuan: string;
    harga: string | number;
    created_at: string;
    updated_at: string;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface ProductsIndexProps {
    products: PaginatedProducts;
    filters: { search?: string };
}

export default function ProductsIndex({ products, filters }: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        products.index({ search });
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (!deleteId) return;

        new Form({ _method: 'delete' }).delete(products.destroy(deleteId), {
            onSuccess: () => {
                toast.success('Barang berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus barang.');
                setDeleteId(null);
            },
        });
    };

    return (
        <>
            <Head title="Master Barang" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Master Barang</h1>
                        <p className="text-muted-foreground">Kelola data barang untuk Delivery Note dan Invoice</p>
                    </div>
                    <Link href={products.create.url()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Barang
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Barang</CardTitle>
                        <CardDescription>Data barang Material Renovasi Ruang TBT dan lainnya</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari kode, nama barang, atau satuan..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit">Cari</Button>
                                {search && (
                                    <Link href={products.index.url()}>
                                        <Button type="button" variant="outline">Reset</Button>
                                    </Link>
                                )}
                            </div>
                        </form>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">#</TableHead>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Barang</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead className="text-right">Harga</TableHead>
                                        <TableHead className="w-32 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <p className="text-muted-foreground">Belum ada data barang. Klik "Tambah Barang" untuk memulai.</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.data.map((product, index) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">
                                                    {(products.from ?? 0) + index}
                                                </TableCell>
                                                <TableCell className="font-mono font-medium">{product.kode}</TableCell>
                                                <TableCell className="font-medium">{product.nama_barang}</TableCell>
                                                <TableCell>{product.satuan}</TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {new Intl.NumberFormat('id-ID', {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                        minimumFractionDigits: 0,
                                                    }).format(Number(product.harga))}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={products.edit(product.id).url}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(product.id)}
                                                                className="text-destructive focus:text-destructive"
                                                                inset
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {products.last_page > 1 && (
                            <Pagination
                                currentPage={products.current_page}
                                totalPages={products.last_page}
                                baseUrl={products.index.url()}
                                searchParams={{ search }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {deleteId && (
                <form onSubmit={(e) => { e.preventDefault(); confirmDelete(); }}>
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteId(null)}>
                        <div className="bg-background w-full max-w-md rounded-lg border p-6" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-semibold mb-2">Hapus Barang</h3>
                            <p className="text-muted-foreground mb-4">
                                Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
                                    Batal
                                </Button>
                                <Button type="submit" variant="destructive">
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Master',
            href: '#',
        },
        {
            title: 'Barang',
            href: products.index.url(),
        },
    ],
};