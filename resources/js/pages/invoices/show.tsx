import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import invoicesRoutes from '@/routes/invoices';

interface InvoiceShowProps {
    invoice: {
        id: number;
        nomor_invoice: string;
        tanggal_invoice: string;
        no_po: string | null;
        subtotal: string;
        ppn: string;
        grand_total: string;
        company: { id: number; nama: string };
        customer: { id: number; nama: string; alamat?: string; kota?: string };
        bank_account: {
            id: number;
            nama_bank: string;
            nomor_rekening: string;
            atas_nama: string;
            company: { nama: string };
        };
        delivery_note: {
            id: number;
            nomor_dn: string;
            tanggal: string;
            no_po: string | null;
            items: Array<{
                id: number;
                qty: number;
                harga: number;
                subtotal: number;
                product: { kode: string; nama_barang: string; satuan: string };
            }>;
        };
    };
}

const money = (value: string | number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(value));
const date = (value: string) =>
    new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));

export default function InvoicesShow({ invoice }: InvoiceShowProps) {
    return (
        <>
            <Head title={`Invoice ${invoice.nomor_invoice}`} />
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={invoicesRoutes.index.url()}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Invoice {invoice.nomor_invoice}
                            </h1>
                            <p className="text-muted-foreground">
                                {date(invoice.tanggal_invoice)} - {invoice.company.nama}
                            </p>
                        </div>
                    </div>
                    <Link href={invoicesRoutes.edit.url(invoice.id)}>
                        <Button variant="outline">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p className="font-medium">{invoice.customer.nama}</p>
                            <p className="text-muted-foreground">
                                {invoice.customer.alamat ?? '-'}
                                {invoice.customer.kota ? `, ${invoice.customer.kota}` : ''}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Rekening Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p className="font-medium">
                                {invoice.bank_account.nama_bank} -{' '}
                                {invoice.bank_account.nomor_rekening}
                            </p>
                            <p className="text-muted-foreground">
                                a.n. {invoice.bank_account.atas_nama} (
                                {invoice.bank_account.company.nama})
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Barang (dari DN {invoice.delivery_note.nomor_dn})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted text-left">
                                    <tr>
                                        <th className="px-3 py-2">No.</th>
                                        <th className="px-3 py-2">Barang</th>
                                        <th className="px-3 py-2 text-right">Qty</th>
                                        <th className="px-3 py-2">Satuan</th>
                                        <th className="px-3 py-2 text-right">Harga</th>
                                        <th className="px-3 py-2 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.delivery_note.items.map((item, index) => (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-3 py-2">{index + 1}</td>
                                            <td className="px-3 py-2">
                                                {item.product.kode} -{' '}
                                                {item.product.nama_barang}
                                            </td>
                                            <td className="px-3 py-2 text-right font-mono">
                                                {item.qty}
                                            </td>
                                            <td className="px-3 py-2">
                                                {item.product.satuan}
                                            </td>
                                            <td className="px-3 py-2 text-right font-mono">
                                                {money(item.harga)}
                                            </td>
                                            <td className="px-3 py-2 text-right font-mono">
                                                {money(item.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 ml-auto w-full max-w-sm space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-mono">{money(invoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>PPN (11%)</span>
                                <span className="font-mono">{money(invoice.ppn)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 text-base font-semibold">
                                <span>Grand Total</span>
                                <span className="font-mono">{money(invoice.grand_total)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

InvoicesShow.layout = (props: InvoiceShowProps) => ({
    breadcrumbs: [
        { title: 'Transaksi', href: '#' },
        { title: 'Invoice', href: invoicesRoutes.index.url() },
        { title: 'Detail', href: invoicesRoutes.show.url(props.invoice.id) },
    ],
});
