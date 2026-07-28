import { Head } from '@inertiajs/react';
import { Link, router, useForm } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
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
import bankAccountsRoutes from '@/routes/bank-accounts';

interface BankAccount {
    id: number;
    company_id: number;
    company: { id: number; nama: string };
    nama_bank: string;
    nomor_rekening: string;
    atas_nama: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginatedBankAccounts {
    data: BankAccount[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface BankAccountsIndexProps {
    bankAccounts: PaginatedBankAccounts;
    filters: { search?: string };
}

export default function BankAccountsIndex({
    bankAccounts,
    filters,
}: BankAccountsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const deleteForm = useForm({ _method: 'delete' });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit(bankAccountsRoutes.index.url({ search }));
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (!deleteId) {
            return;
        }

        deleteForm.delete(bankAccountsRoutes.destroy(deleteId), {
            onSuccess: () => {
                toast.success('Rekening berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus rekening.');
                setDeleteId(null);
            },
        });
    };

    return (
        <>
            <Head title="Master Rekening" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Master Rekening
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data rekening bank untuk Invoice
                        </p>
                    </div>
                    <Link href={bankAccountsRoutes.create.url()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Rekening
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Rekening Bank</CardTitle>
                        <CardDescription>
                            Data rekening BRI, BCA, Mandiri untuk CV Agus Jaya
                            dan CV Sumber Sukses Utama
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex gap-2">
                                <div className="relative max-w-md flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari bank, no. rekening, atas nama, atau perusahaan..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit">Cari</Button>
                                {search && (
                                    <Link href={bankAccountsRoutes.index.url()}>
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
                                        <TableHead>Perusahaan</TableHead>
                                        <TableHead>Bank</TableHead>
                                        <TableHead>No. Rekening</TableHead>
                                        <TableHead>Atas Nama</TableHead>
                                        <TableHead className="w-24">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-32 text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bankAccounts.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center"
                                            >
                                                <p className="text-muted-foreground">
                                                    Belum ada data rekening.
                                                    Klik "Tambah Rekening" untuk
                                                    memulai.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        bankAccounts.data.map(
                                            (bankAccount, index) => (
                                                <TableRow key={bankAccount.id}>
                                                    <TableCell className="font-medium">
                                                        {(bankAccounts.from ??
                                                            0) + index}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {bankAccount.company
                                                            ?.nama ?? '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {bankAccount.nama_bank}
                                                    </TableCell>
                                                    <TableCell className="font-mono">
                                                        {
                                                            bankAccount.nomor_rekening
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {bankAccount.atas_nama}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                bankAccount.status
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {bankAccount.status
                                                                ? 'Aktif'
                                                                : 'Tidak Aktif'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link
                                                                href={
                                                                    bankAccountsRoutes.edit(
                                                                        bankAccount.id,
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
                                                                        bankAccount.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {bankAccounts.last_page > 1 && (
                            <Pagination
                                currentPage={bankAccounts.current_page}
                                totalPages={bankAccounts.last_page}
                                baseUrl={bankAccountsRoutes.index.url()}
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
                                Hapus Rekening
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                Apakah Anda yakin ingin menghapus rekening ini?
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

BankAccountsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Master',
            href: '#',
        },
        {
            title: 'Rekening',
            href: bankAccountsRoutes.index.url(),
        },
    ],
};
