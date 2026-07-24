import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Plus, Search, MoreHorizontal, Users } from 'lucide-react';
import customersRoutes from '@/routes/customers';
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

interface Customer {
    id: number;
    nama: string;
    alamat: string | null;
    kota: string | null;
    pic: string | null;
    telepon: string | null;
    email: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedCustomers {
    data: Customer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface CustomersIndexProps {
    customers: PaginatedCustomers;
    filters: { search?: string };
}

export default function CustomersIndex({ customers, filters }: CustomersIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        customersRoutes.index({ search });
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (!deleteId) return;

        new Form({ _method: 'delete' }).delete(customersRoutes.destroy(deleteId), {
            onSuccess: () => {
                toast.success('Customer berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus customer.');
                setDeleteId(null);
            },
        });
    };

    return (
        <>
            <Head title="Master Customer" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Master Customer</h1>
                        <p className="text-muted-foreground">Kelola data customer untuk Delivery Note dan Invoice</p>
                    </div>
                    <Link href={customersRoutes.create.url()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Customer
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Customer</CardTitle>
                        <CardDescription>Data customer PT Orica Mining Services dan lainnya</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari nama, PIC, email, atau telepon..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit">Cari</Button>
                                {search && (
                                    <Link href={customersRoutes.index.url()}>
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
                                        <TableHead>Nama Customer</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>Kota</TableHead>
                                        <TableHead>PIC</TableHead>
                                        <TableHead>Telepon</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="w-32 text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8">
                                                <p className="text-muted-foreground">Belum ada data customer. Klik "Tambah Customer" untuk memulai.</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        customers.data.map((customer, index) => (
                                            <TableRow key={customer.id}>
                                                <TableCell className="font-medium">
                                                    {(customers.from ?? 0) + index}
                                                </TableCell>
                                                <TableCell className="font-medium">{customer.nama}</TableCell>
                                                <TableCell className="max-w-xs truncate">{customer.alamat ?? '-'}</TableCell>
                                                <TableCell>{customer.kota ?? '-'}</TableCell>
                                                <TableCell>{customer.pic ?? '-'}</TableCell>
                                                <TableCell>{customer.telepon ?? '-'}</TableCell>
                                                <TableCell>{customer.email ?? '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={customersRoutes.edit(customer.id).url}>
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(customer.id)}
                                                                className="text-destructive focus:text-destructive"
                                                                inset
                                                            >
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

                        {customers.last_page > 1 && (
                            <Pagination
                                currentPage={customers.current_page}
                                totalPages={customers.last_page}
                                baseUrl={customersRoutes.index.url()}
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
                            <h3 className="text-lg font-semibold mb-2">Hapus Customer</h3>
                            <p className="text-muted-foreground mb-4">
                                Apakah Anda yakin ingin menghapus customer ini? Tindakan ini tidak dapat dibatalkan.
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

CustomersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Master',
            href: '#',
        },
        {
            title: 'Customer',
            href: customersRoutes.index.url(),
        },
    ],
};