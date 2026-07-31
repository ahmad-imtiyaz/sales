import { Head, Link, router } from '@inertiajs/react';
import { Filter, Printer, X } from 'lucide-react';
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
interface CompanyOption {
    id: number;
    nama: string;
}
interface Props {
    invoices: PaginatedInvoices;
    filters: { tanggal_dari?: string; tanggal_sampai?: string; company_id?: string };
    totalGrandTotal: string;
    companies: CompanyOption[];
}

const money = (value: string | number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(value));
const date = (value: string) => new Intl.DateTimeFormat('id-ID').format(new Date(value));

export default function LaporanInvoices({ invoices, filters, totalGrandTotal, companies }: Props) {
    const [tanggalDari, setTanggalDari] = useState(filters.tanggal_dari ?? '');
    const [tanggalSampai, setTanggalSampai] = useState(filters.tanggal_sampai ?? '');
    const [companyId, setCompanyId] = useState(filters.company_id ?? '');
    const [printMode, setPrintMode] = useState(false);

    const submitFilter = (event: FormEvent) => {
        event.preventDefault();
        router.visit(
            laporanRoutes.invoices.url({
                query: {
                    tanggal_dari: tanggalDari,
                    tanggal_sampai: tanggalSampai,
                    company_id: companyId,
                },
            }),
            { preserveState: true, preserveScroll: true },
        );
    };

    const resetFilter = () => {
        setTanggalDari('');
        setTanggalSampai('');
        setCompanyId('');
        router.visit(laporanRoutes.invoices.url(), { preserveState: true, preserveScroll: true });
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
            <Head title="Laporan Invoice" />
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
                }
            `}</style>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Laporan Invoice</h1>
                        <p className="text-muted-foreground">
                            Filter dan cetak laporan Invoice
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
                            <div className="space-y-2 w-full sm:w-64">
                                <Label>Perusahaan</Label>
                                <Select value={companyId} onValueChange={setCompanyId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Perusahaan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Semua</SelectItem>
                                        {companies.map((company) => (
                                            <SelectItem key={company.id} value={company.id.toString()}>
                                                {company.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                                {(tanggalDari || tanggalSampai || companyId) && (
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
                        <CardTitle>Daftar Invoice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Nomor Invoice</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>No. PO</TableHead>
                                        <TableHead>Perusahaan</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Rekening</TableHead>
                                        <TableHead className="text-right">Grand Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                                                Belum ada data Invoice.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        invoices.data.map((inv, index) => (
                                            <TableRow key={inv.id}>
                                                <TableCell>{(invoices.from ?? 0) + index}</TableCell>
                                                <TableCell className="font-mono font-medium">{inv.nomor_invoice}</TableCell>
                                                <TableCell>{date(inv.tanggal_invoice)}</TableCell>
                                                <TableCell>{inv.no_po ?? '-'}</TableCell>
                                                <TableCell>{inv.company.nama}</TableCell>
                                                <TableCell>{inv.customer.nama}</TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {inv.bank_account.nama_bank} -{' '}
                                                    {inv.bank_account.nomor_rekening}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">{money(inv.grand_total)}</TableCell>
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
                                baseUrl={laporanRoutes.invoices.url()}
                                searchParams={{ tanggal_dari: tanggalDari, tanggal_sampai: tanggalSampai, company_id: companyId }}
                            />
                        )}

                        <div className="mt-4 flex justify-end">
                            <div className="text-right text-lg font-bold text-primary">
                                Total Grand Total: {money(totalGrandTotal)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {printMode && (
                    <div className="print-only">
                        <div className="print-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '18px' }}>Laporan Invoice</h2>
                            <p style={{ margin: '4px 0', fontSize: '12px' }}>
                                Periode: {tanggalDari ? date(tanggalDari) : 'Awal'} s/d {tanggalSampai ? date(tanggalSampai) : 'Akhir'}
                                {companyId ? ` | Perusahaan: ${companies.find(c => c.id.toString() === companyId)?.nama}` : ''}
                            </p>
                            <p style={{ margin: '4px 0', fontSize: '12px' }}>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                            <thead>
                                <tr style={{ background: '#f3f4f6' }}>
                                    <th style={{ border: '1px solid #000', padding: '4px' }}>No</th>
                                    <th style={{ border: '1px solid #000', padding: '4px' }}>Nomor Invoice</th>
                                    <th style={{ border: '1px solid #000', padding: '4px' }}>Tanggal</th>
                                    <th style={{ border: '1px solid #000', padding: '4px' }}>No. PO</th>
                                    <th style={{ border: '1px solid #000', padding: '4px' }}>Perusahaan</th>
                                    <th style={{ border: '1px solid #000', padding: '4px' }}>Customer</th>
                                    <th style={{ border: '1px solid #000', padding: '4px' }}>Rekening</th>
                                    <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>Grand Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.data.map((inv, index) => (
                                    <tr key={inv.id}>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{(invoices.from ?? 0) + index}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px' }}>{inv.nomor_invoice}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px' }}>{date(inv.tanggal_invoice)}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px' }}>{inv.no_po ?? '-'}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px' }}>{inv.company.nama}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px' }}>{inv.customer.nama}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px' }}>{inv.bank_account.nama_bank} - {inv.bank_account.nomor_rekening}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{money(inv.grand_total)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={7} style={{ border: '1px solid #000', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>Total Grand Total</td>
                                    <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right', fontWeight: 'bold' }}>{money(totalGrandTotal)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

LaporanInvoices.layout = {
    breadcrumbs: [
        { title: 'Laporan', href: '#' },
        { title: 'Invoice', href: laporanRoutes.invoices.url() },
    ],
};