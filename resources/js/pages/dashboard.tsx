import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Package, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import deliveryNotesRoutes from '@/routes/delivery-notes';
import invoicesRoutes from '@/routes/invoices';

interface DashboardStats {
    delivery_notes: {
        total: number;
        available: number;
        used: number;
    };
    invoices_this_month: {
        count: number;
        grand_total: string | number;
    };
    customers: number;
    companies: number;
}

interface LatestInvoice {
    id: number;
    nomor_invoice: string;
    tanggal_invoice: string;
    grand_total: string | number;
    company: string;
    customer: string;
}

interface LatestDeliveryNote {
    id: number;
    nomor_dn: string;
    tanggal: string;
    status: 'available' | 'used';
    company: string;
    customer: string;
}

interface Props {
    stats: DashboardStats;
    latest_invoices: LatestInvoice[];
    latest_delivery_notes: LatestDeliveryNote[];
}

const money = (value: string | number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(value));

const date = (value: string) =>
    new Intl.DateTimeFormat('id-ID').format(new Date(value));

export default function Dashboard({
    stats,
    latest_invoices,
    latest_delivery_notes,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Ringkasan aktivitas Delivery Note & Invoice
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Delivery Note
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.delivery_notes.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats.delivery_notes.available} Available ·{' '}
                                {stats.delivery_notes.used} Used
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Invoice Bulan Ini
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.invoices_this_month.count}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total:{' '}
                                {money(stats.invoices_this_month.grand_total)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Customer
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.customers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total customer terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Perusahaan
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.companies}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total perusahaan aktif
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>5 Delivery Note Terbaru</CardTitle>
                            <Link
                                href={deliveryNotesRoutes.index.url()}
                                className="text-sm text-primary hover:underline"
                            >
                                Lihat semua{' '}
                                <ArrowRight className="ml-1 inline h-3 w-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {latest_delivery_notes.length === 0 ? (
                            <p className="py-8 text-center text-muted-foreground">
                                Belum ada Delivery Note.
                            </p>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nomor DN</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Perusahaan</TableHead>
                                            <TableHead>Customer</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {latest_delivery_notes.map((dn) => (
                                            <TableRow key={dn.id}>
                                                <TableCell className="font-mono font-medium">
                                                    {dn.nomor_dn}
                                                </TableCell>
                                                <TableCell>
                                                    {date(dn.tanggal)}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={
                                                            dn.status ===
                                                            'available'
                                                                ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                : 'inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                        }
                                                    >
                                                        {dn.status ===
                                                        'available'
                                                            ? 'AVAILABLE'
                                                            : 'USED'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {dn.company}
                                                </TableCell>
                                                <TableCell>
                                                    {dn.customer}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>5 Invoice Terbaru</CardTitle>
                            <Link
                                href={invoicesRoutes.index.url()}
                                className="text-sm text-primary hover:underline"
                            >
                                Lihat semua{' '}
                                <ArrowRight className="ml-1 inline h-3 w-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {latest_invoices.length === 0 ? (
                            <p className="py-8 text-center text-muted-foreground">
                                Belum ada Invoice.
                            </p>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nomor Invoice</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Perusahaan</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead className="text-right">
                                                Grand Total
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {latest_invoices.map((inv) => (
                                            <TableRow key={inv.id}>
                                                <TableCell className="font-mono font-medium">
                                                    {inv.nomor_invoice}
                                                </TableCell>
                                                <TableCell>
                                                    {date(inv.tanggal_invoice)}
                                                </TableCell>
                                                <TableCell>
                                                    {inv.company}
                                                </TableCell>
                                                <TableCell>
                                                    {inv.customer}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {money(inv.grand_total)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
