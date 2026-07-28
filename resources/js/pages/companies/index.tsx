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
import companiesRoutes from '@/routes/companies';

interface Company {
    id: number;
    nama: string;
    logo: string | null;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedCompanies {
    data: Company[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface CompaniesIndexProps {
    companies: PaginatedCompanies;
    filters: { search?: string };
}

export default function CompaniesIndex({
    companies,
    filters,
}: CompaniesIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteForm = useForm({ _method: 'delete' });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit(companiesRoutes.index.url({ search }));
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (!deleteId) {
            return;
        }

        deleteForm.delete(companiesRoutes.destroy(deleteId), {
            onSuccess: () => {
                toast.success('Perusahaan berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus perusahaan.');
                setDeleteId(null);
            },
        });
    };

    return (
        <>
            <Head title="Master Perusahaan" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Master Perusahaan
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data perusahaan untuk Delivery Note dan
                            Invoice
                        </p>
                    </div>
                    <Link href={companiesRoutes.create.url()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Perusahaan
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Perusahaan</CardTitle>
                        <CardDescription>
                            Kelola data perusahaan CV Agus Jaya dan CV Sumber
                            Sukses Utama
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex gap-2">
                                <div className="relative max-w-md flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari nama, email, atau telepon..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit">Cari</Button>
                                {search && (
                                    <Link href={companiesRoutes.index.url()}>
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
                                        <TableHead>Nama Perusahaan</TableHead>
                                        <TableHead>Logo</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>Telepon</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="w-32 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {companies.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center"
                                            >
                                                <p className="text-muted-foreground">
                                                    Belum ada data perusahaan.
                                                    Klik "Tambah Perusahaan"
                                                    untuk memulai.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        companies.data.map((company, index) => (
                                            <TableRow key={company.id}>
                                                <TableCell className="font-medium">
                                                    {(companies.from ?? 0) +
                                                        index}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {company.nama}
                                                </TableCell>
                                                <TableCell>
                                                    {company.logo ? (
                                                        <img
                                                            src={company.logo}
                                                            alt={company.nama}
                                                            className="h-10 w-auto rounded object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {company.alamat ?? '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {company.telepon ?? '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {company.email ?? '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={
                                                                companiesRoutes.edit(
                                                                    company.id,
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
                                                                    company.id,
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

                        {companies.last_page > 1 && (
                            <Pagination
                                currentPage={companies.current_page}
                                totalPages={companies.last_page}
                                baseUrl={companiesRoutes.index.url()}
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
                                Hapus Perusahaan
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                Apakah Anda yakin ingin menghapus perusahaan
                                ini? Tindakan ini tidak dapat dibatalkan.
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

CompaniesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Master',
            href: '#',
        },
        {
            title: 'Perusahaan',
            href: companiesRoutes.index.url(),
        },
    ],
};
