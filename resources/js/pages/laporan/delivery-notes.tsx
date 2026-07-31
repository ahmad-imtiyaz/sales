import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Filter, Printer, Search, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import laporanRoutes from '@/routes/laporan';

interface DeliveryNote {
    id: number;
    nomor_dn: string;
    tanggal: string;
    no_po: string | null;
    status: 'available' | 'used';
    items_count: number;
    company: { nama: string };
    customer: { nama: string };
}
interface PaginatedDeliveryNotes {
    data: DeliveryNote[];
    current_page: number;
    last_page: number;
    from: number | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}
interface Props {
    deliveryNotes: PaginatedDeliveryNotes;
    filters: { tanggal_dari?: string; tanggal_sampai?: string; status?: string };
}

const date = (value: string) => new Intl.DateTimeFormat('id-ID').format(new Date(value));
const statusBadge = (status: string) =>
    status === 'available'
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
const statusLabel = (status: string) => (status === 'available' ? 'AVAILABLE' : 'USED');

export default function LaporanDeliveryNotes({ deliveryNotes, filters }: Props) {
    const [tanggalDari, setTanggalDari] = useState(filters.tanggal_dari ?? '');
    const [tanggalSampai, setTanggalSampai] = useState(filters.tanggal_sampai ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [printMode, setPrintMode] = useState(false);

    const submitFilter = (event: FormEvent) => {
        event.preventDefault();
        router.visit(
            laporanRoutes.deliveryNotes.url({
                query: {
                    tanggal_dari: tanggalDari,
                    tanggal_sampai: tanggalSampai,
                    status,
                },
            }),
            { preserveState: true, preserveScroll: true },
        );
    };

    const resetFilter = () => {
        setTanggalDari('');
        setTanggalSampai('');
        setStatus('');
        router.visit(laporanRoutes.deliveryNotes.url(), { preserveState: true, preserveScroll: true });
    };

    const handlePrint = () => {
        setPrintMode(true);
        setTimeout(() => {
            window.print();
            setPrintMode(false);
        }, 100);
    };

    return (
        <>
            <Head title="Laporan Delivery Note" />
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { margin: 0; padding: 0; }
                    .print-header { text-align: center; margin-bottom: 20px; }
                    .print-header h2 { margin: 0; font-size: 18px; }
                    .print-header p { margin: 4px 0; font-size: 12px; }
                    table { width: 100%; border-collapse: collapse; font-size: 10px; }
                    th, td { border: 1px solid #000; padding: 4px; }
                    th { background: #f3f4f6; }
                    .no-print { display: none; }
                }
            `}</style>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Laporan Delivery Note</h1>
                        <p className="text-muted-foreground">
                            Filter dan cetak laporan Delivery Note
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} variant="outline">
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                    </div>
                </div>

                <Card className="no-print">
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitFilter} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="space-y-2 w-full sm:w-64">
                                <Label>Tanggal Dari</Label>
                                <Input
                                    type="date"
                                    value={tanggalDari}
                                    onChange={(e) => setTanggalDari(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 w-full sm:w-64">
                                <Label>Tanggal Sampai</Label>
                                <Input
                                    type="date"
                                    value={tanggalSampai}
                                    onChange={(e) => setTanggalSampai(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 w-full sm:w-48">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Semua</SelectItem>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="used">Used</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                                {(tanggalDari || tanggalSampai || status) && (
                                    <Button type="button" variant="outline" onClick={resetFilter}>
                                        <X className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Delivery Note</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Nomor DN</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>No. PO</TableHead>
                                        <TableHead>Perusahaan</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Jumlah Item</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deliveryNotes.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                                                Belum ada data Delivery Note.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        deliveryNotes.data.map((dn, index) => (
                                            <TableRow key={dn.id}>
                                                <TableCell>{(deliveryNotes.from ?? 0) + index}</TableCell>
                                                <TableCell className="font-mono font-medium">{dn.nomor_dn}</TableCell>
                                                <TableCell>{date(dn.tanggal)}</TableCell>
                                                <TableCell>{dn.no_po ?? '-'}</TableCell>
                                                <TableCell>{dn.company.nama}</TableCell>
                                                <TableCell>{dn.customer.nama}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(dn.status)}`}>
                                                        {statusLabel(dn.status)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">{dn.items_count}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {deliveryNotes.last_page > 1 && (
                            <Pagination
                                currentPage={deliveryNotes.current_page}
                                totalPages={deliveryNotes.last_page}
                                baseUrl={laporanRoutes.deliveryNotes.url()}
                                searchParams={{ tanggal_dari: tanggalDari, tanggal_sampai: tanggalSampai, status }}
                            />
                        )}
                    </CardContent>
                </Card>

                {printMode && (
                    <div className="print-only">
                        <div className="print-header">
                            <h2>Laporan Delivery Note</h2>
                            <p>
                                Periode: {tanggalDari ? date(tanggalDari) : 'Awal'} s/d {tanggalSampai ? date(tanggalSampai) : 'Akhir'}
                                {status ? ` | Status: ${statusLabel(status)}` : ''}
                            </p>
                            <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nomor DN</th>
                                    <th>Tanggal</th>
                                    <th>No. PO</th>
                                    <th>Perusahaan</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Jml Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveryNotes.data.map((dn, index) => (
                                    <tr key={dn.id}>
                                        <td style={{ textAlign: 'center' }}>{(deliveryNotes.from ?? 0) + index}</td>
                                        <td>{dn.nomor_dn}</td>
                                        <td>{date(dn.tanggal)}</td>
                                        <td>{dn.no_po ?? '-'}</td>
                                        <td>{dn.company.nama}</td>
                                        <td>{dn.customer.nama}</td>
                                        <td style={{ textAlign: 'center' }}>{statusLabel(dn.status)}</td>
                                        <td style={{ textAlign: 'center' }}>{dn.items_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

LaporanDeliveryNotes.layout = {
    breadcrumbs: [
        { title: 'Laporan', href: '#' },
        { title: 'Delivery Note', href: laporanRoutes.deliveryNotes.url() },
    ],
};