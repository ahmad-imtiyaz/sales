import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Printer, Search, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import invoicesRoutes from '@/routes/invoices';

interface Invoice {
    id: number;
    nomor_invoice: string;
    tanggal_invoice: string;
    no_po: string | null;
    grand_total: string;
    company: { nama: string };
    customer: { nama: string };
    bank_account: { nama_bank: string; nomor_rekening: string };
}
interface PaginatedInvoices {
    data: Invoice[];
    current_page: number;
    last_page: number;
    from: number | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}
interface Props {
    invoices: PaginatedInvoices;
    filters: { search?: string };
}

const money = (value: string | number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(value));
const date = (value: string) =>
    new Intl.DateTimeFormat('id-ID').format(new Date(value));

export default function InvoicesIndex({ invoices, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const deleteForm = useForm({ _method: 'delete' });

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        router.visit(
            invoicesRoutes.index.url({ query: { search: search.trim() } }),
            { preserveState: true, preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (deleteId === null) {
            return;
        }

        deleteForm.delete(invoicesRoutes.destroy.url(deleteId), {
            onSuccess: () => {
                toast.success('Invoice berhasil dihapus.');
                setDeleteId(null);
            },
            onError: () => toast.error('Invoice gagal dihapus.'),
        });
    };

    return (
        <>
            <Head title="Invoice" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Invoice
                        </h1>
                        <p className="text-muted-foreground">
                            Daftar invoice dari Delivery Note yang tersedia.
                        </p>
                    </div>
                    <Link href={invoicesRoutes.create.url()}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Invoice
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Invoice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submitSearch}
                            className="mb-4 flex max-w-xl gap-2"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    placeholder="Cari nomor invoice, PO, perusahaan, customer..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                />
                            </div>
                            <Button type="submit">Cari</Button>
                            {search && (
                                <Link href={invoicesRoutes.index.url()}>
                                    <Button type="button" variant="outline">
                                        Reset
                                    </Button>
                                </Link>
                            )}
                        </form>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Nomor Invoice</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Perusahaan</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Rekening</TableHead>
                                        <TableHead className="text-right">
                                            Grand Total
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                Belum ada Invoice.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        invoices.data.map((invoice, index) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell>
                                                    {(invoices.from ?? 0) +
                                                        index}
                                                </TableCell>
                                                <TableCell className="font-mono font-medium">
                                                    {invoice.nomor_invoice}
                                                </TableCell>
                                                <TableCell>
                                                    {date(
                                                        invoice.tanggal_invoice,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {invoice.company.nama}
                                                </TableCell>
                                                <TableCell>
                                                    {invoice.customer.nama}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {
                                                        invoice.bank_account
                                                            .nama_bank
                                                    }{' '}
                                                    -{' '}
                                                    {
                                                        invoice.bank_account
                                                            .nomor_rekening
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {money(invoice.grand_total)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={invoicesRoutes.show.url(
                                                                invoice.id,
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Detail"
                                                            >
                                                                <Search className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link
                                                            href={invoicesRoutes.edit.url(
                                                                invoice.id,
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <a
                                                            href={invoicesRoutes.print.url(
                                                                invoice.id,
                                                            )}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Cetak PDF"
                                                            >
                                                                <Printer className="h-4 w-4" />
                                                            </Button>
                                                        </a>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive"
                                                            title="Hapus"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    invoice.id,
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
                        {invoices.last_page > 1 && (
                            <Pagination
                                currentPage={invoices.current_page}
                                totalPages={invoices.last_page}
                                baseUrl={invoicesRoutes.index.url()}
                                searchParams={{ search }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
            {deleteId !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setDeleteId(null)}
                >
                    <div
                        className="w-full max-w-md rounded-lg border bg-background p-6"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="mb-2 text-lg font-semibold">
                            Hapus Invoice?
                        </h3>
                        <p className="mb-4 text-muted-foreground">
                            Invoice akan dihapus dan Delivery Note terkait
                            dikembalikan ke status available.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteId(null)}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={deleteForm.processing}
                            >
                                Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

InvoicesIndex.layout = {
    breadcrumbs: [
        { title: 'Transaksi', href: '#' },
        { title: 'Invoice', href: invoicesRoutes.index.url() },
    ],
};
