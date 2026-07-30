import { Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import invoicesRoutes from '@/routes/invoices';
import deliveryNotesRoutes from '@/routes/delivery-notes';

export interface DeliveryNoteOptionItem {
    id: number;
    product_id: number;
    qty: number;
    harga: number;
    subtotal: number;
    product: { id: number; kode: string; nama_barang: string; satuan: string };
}
export interface DeliveryNoteOption {
    id: number;
    nomor_dn: string;
    no_po: string | null;
    company: { id: number; nama: string };
    customer: { id: number; nama: string; alamat?: string; kota?: string };
    items: DeliveryNoteOptionItem[];
}
export interface BankAccountOption {
    id: number;
    nama_bank: string;
    nomor_rekening: string;
    atas_nama: string;
    company: { id: number; nama: string };
}
export interface InvoiceData {
    id?: number;
    delivery_note_id: number | null;
    bank_account_id: number | null;
    nomor_invoice: string;
    tanggal_invoice: string;
    no_po: string | null;
    subtotal: number;
    ppn: number;
    grand_total: number;
}
interface Props {
    deliveryNotes: DeliveryNoteOption[];
    bankAccounts: BankAccountOption[];
    invoice?: InvoiceData;
    mode: 'create' | 'edit';
}

const money = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);

export default function InvoiceForm({
    deliveryNotes,
    bankAccounts,
    invoice,
    mode,
}: Props) {
    const [selectedDeliveryNoteId, setSelectedDeliveryNoteId] = useState<number | null>(
        invoice?.delivery_note_id ?? null,
    );
    const [deliveryNoteSnapshot, setDeliveryNoteSnapshot] = useState<DeliveryNoteOption | null>(
        () => deliveryNotes.find((dn) => dn.id === invoice?.delivery_note_id) ?? null,
    );
    const [loadingDeliveryNote, setLoadingDeliveryNote] = useState(false);

    const form = useForm({
        delivery_note_id: invoice?.delivery_note_id ?? ('' as number | ''),
        bank_account_id: invoice?.bank_account_id ?? ('' as number | ''),
        nomor_invoice: invoice?.nomor_invoice ?? '',
        tanggal_invoice: invoice?.tanggal_invoice ?? new Date().toISOString().slice(0, 10),
        no_po: invoice?.no_po ?? '',
    });

    const selectedDeliveryNote = deliveryNoteSnapshot;
    const selectedCompany = selectedDeliveryNote?.company;

    const subtotal = useMemo(
        () =>
            selectedDeliveryNote
                ? selectedDeliveryNote.items.reduce(
                      (sum, item) => sum + Number(item.subtotal),
                      0,
                  )
                : 0,
        [selectedDeliveryNote],
    );
    const ppn = useMemo(() => Math.round(subtotal * 0.11), [subtotal]);
    const grandTotal = useMemo(() => subtotal + ppn, [subtotal, ppn]);

    useEffect(() => {
        if (mode === 'edit') {
            return;
        }
        if (selectedDeliveryNoteId === null) {
            setDeliveryNoteSnapshot(null);
            return;
        }
        const cached = deliveryNotes.find((dn) => dn.id === selectedDeliveryNoteId);
        if (cached) {
            setDeliveryNoteSnapshot(cached);
            form.setData('no_po', cached.no_po ?? '');
        }
        let cancelled = false;
        setLoadingDeliveryNote(true);
        fetch(deliveryNotesRoutes.showJson(selectedDeliveryNoteId).url, {
            headers: { Accept: 'application/json' },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load delivery note');
                }
                return response.json();
            })
            .then((data: DeliveryNoteOption & { items: DeliveryNoteOptionItem[] }) => {
                if (cancelled) {
                    return;
                }
                setDeliveryNoteSnapshot(data);
                form.setData('no_po', data.no_po ?? '');
            })
            .catch(() => {
                if (cancelled) {
                    return;
                }
                toast.error('Gagal memuat detail Delivery Note.');
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadingDeliveryNote(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [selectedDeliveryNoteId]);

    const updateDeliveryNote = (value: string) => {
        const parsed = value === '' ? null : Number(value);
        setSelectedDeliveryNoteId(parsed);
        form.setData('delivery_note_id', parsed ?? ('' as const));
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const options = {
            onSuccess: () => {
                toast.success(
                    `Invoice berhasil ${mode === 'create' ? 'dibuat' : 'diperbarui'}.`,
                );
            },
            onError: () =>
                toast.error(
                    `Gagal ${mode === 'create' ? 'membuat' : 'memperbarui'} Invoice.`,
                ),
        };
        if (mode === 'create') {
            form.post(invoicesRoutes.store.url(), options);
            return;
        }
        router.put(invoicesRoutes.update.url(invoice!.id!), form.data, options);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Invoice</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label>Delivery Note *</Label>
                        <Select
                            name="delivery_note_id"
                            value={selectedDeliveryNoteId === null ? '' : String(selectedDeliveryNoteId)}
                            onValueChange={updateDeliveryNote}
                            disabled={mode === 'edit'}
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Delivery Note tersedia" />
                            </SelectTrigger>
                            <SelectContent>
                                {deliveryNotes.length === 0 ? (
                                    <SelectItem value="__empty" disabled>
                                        Belum ada Delivery Note berstatus available.
                                    </SelectItem>
                                ) : (
                                    deliveryNotes.map((dn) => (
                                        <SelectItem key={dn.id} value={String(dn.id)}>
                                            {dn.nomor_dn} - {dn.customer.nama}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <input
                            type="hidden"
                            name="delivery_note_id"
                            value={selectedDeliveryNoteId ?? ''}
                        />
                        {form.errors.delivery_note_id && (
                            <p className="text-sm text-destructive">
                                {form.errors.delivery_note_id}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nomor_invoice">Nomor Invoice *</Label>
                        <Input
                            id="nomor_invoice"
                            value={form.data.nomor_invoice}
                            onChange={(e) =>
                                form.setData('nomor_invoice', e.target.value)
                            }
                            required
                        />
                        {form.errors.nomor_invoice && (
                            <p className="text-sm text-destructive">
                                {form.errors.nomor_invoice}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tanggal_invoice">Tanggal Invoice *</Label>
                        <input
                            id="tanggal_invoice"
                            type="date"
                            value={form.data.tanggal_invoice}
                            onChange={(e) =>
                                form.setData('tanggal_invoice', e.target.value)
                            }
                            className="border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                            required
                        />
                        {form.errors.tanggal_invoice && (
                            <p className="text-sm text-destructive">
                                {form.errors.tanggal_invoice}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="no_po">Nomor PO</Label>
                        <Input
                            id="no_po"
                            value={form.data.no_po}
                            onChange={(e) => form.setData('no_po', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Rekening Pembayaran *</Label>
                        <Select
                            name="bank_account_id"
                            value={
                                form.data.bank_account_id === ''
                                    ? ''
                                    : String(form.data.bank_account_id)
                            }
                            onValueChange={(value) =>
                                form.setData('bank_account_id', Number(value))
                            }
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih rekening" />
                            </SelectTrigger>
                            <SelectContent>
                                {bankAccounts.map((bank) => (
                                    <SelectItem key={bank.id} value={String(bank.id)}>
                                        {bank.nama_bank} - {bank.nomor_rekening} ({bank.company.nama})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.bank_account_id && (
                            <p className="text-sm text-destructive">
                                {form.errors.bank_account_id}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Customer & Barang</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedDeliveryNote === null ? (
                        <p className="text-sm text-muted-foreground">
                            Pilih Delivery Note untuk menampilkan customer dan barang.
                        </p>
                    ) : (
                        <>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Perusahaan
                                    </p>
                                    <p className="font-medium">
                                        {selectedCompany?.nama ?? '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Customer
                                    </p>
                                    <p className="font-medium">
                                        {selectedDeliveryNote.customer.nama}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedDeliveryNote.customer.alamat ?? '-'}
                                        {selectedDeliveryNote.customer.kota
                                            ? `, ${selectedDeliveryNote.customer.kota}`
                                            : ''}
                                    </p>
                                </div>
                            </div>
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
                                        {selectedDeliveryNote.items.map((item, index) => (
                                            <tr key={item.id} className="border-t">
                                                <td className="px-3 py-2">{index + 1}</td>
                                                <td className="px-3 py-2">
                                                    {item.product.kode} -{' '}
                                                    {item.product.nama_barang}
                                                </td>
                                                <td className="px-3 py-2 text-right font-mono">
                                                    {item.qty}
                                                </td>
                                                <td className="px-3 py-2">{item.product.satuan}</td>
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
                            {loadingDeliveryNote && (
                                <p className="text-xs text-muted-foreground">
                                    Memuat detail Delivery Note...
                                </p>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ringkasan Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono">{money(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>PPN (11%)</span>
                        <span className="font-mono">{money(ppn)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-base font-semibold">
                        <span>Grand Total</span>
                        <span className="font-mono">{money(grandTotal)}</span>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Link href={invoicesRoutes.index.url()}>
                    <Button type="button" variant="outline">
                        Batal
                    </Button>
                </Link>
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Menyimpan...' : 'Simpan Invoice'}
                </Button>
            </div>
        </form>
    );
}
