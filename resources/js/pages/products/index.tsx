import { Head } from '@inertiajs/react';
import { Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import productsRoutes from '@/routes/products';

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

export default function ProductsIndex({
    products,
    filters,
}: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const deleteForm = useForm({ _method: 'delete' });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit(productsRoutes.index.url({ search }));
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (!deleteId) {
            return;
        }

        deleteForm.delete(productsRoutes.destroy(deleteId), {
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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Master Barang
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data barang untuk Delivery Note dan Invoice
                        </p>
                    </div>
                    <Link href={productsRoutes.create.url()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Barang
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Barang</CardTitle>
                        <CardDescription>
                            Data barang Material Renovasi Ruang TBT dan lainnya
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex gap-2">
                                <div className="relative max-w-md flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari kode, nama barang, atau satuan..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit">Cari</Button>
                                {search && (
                                    <Link href={productsRoutes.index.url()}>
                                        <Button type="button" variant="outline">
                                            Reset
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </form>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            #
                                        </TableHead>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Barang</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead className="text-right">
                                            Harga
                                        </TableHead>
                                        <TableHead className="w-32 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-8 text-center"
                                            >
                                                <p className="text-muted-foreground">
                                                    Belum ada data barang. Klik
                                                    "Tambah Barang" untuk
                                                    memulai.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.data.map((product, index) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">
                                                    {(products.from ?? 0) +
                                                        index}
                                                </TableCell>
                                                <TableCell className="font-mono font-medium">
                                                    {product.kode}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {product.nama_barang}
                                                </TableCell>
                                                <TableCell>
                                                    {product.satuan}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {new Intl.NumberFormat(
                                                        'id-ID',
                                                        {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                            minimumFractionDigits: 0,
                                                        },
                                                    ).format(
                                                        Number(product.harga),
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={
                                                                productsRoutes.edit(
                                                                    product.id,
                                                                ).url
                                                            }
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                title="Edit"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                            title="Hapus"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
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
                                baseUrl={productsRoutes.index.url()}
                                searchParams={{ search }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {deleteId && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        confirmDelete();
                    }}
                >
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setDeleteId(null)}
                    >
                        <div
                            className="w-full max-w-md rounded-lg border bg-background p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="mb-2 text-lg font-semibold">
                                Hapus Barang
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                Apakah Anda yakin ingin menghapus barang ini?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDeleteId(null)}
                                >
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
            href: productsRoutes.index.url(),
        },
    ],
};
