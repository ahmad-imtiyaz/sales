import { Link, useForm } from '@inertiajs/react';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { FormEvent, useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import deliveryNotesRoutes from '@/routes/delivery-notes';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface ProductOption {
    id: number;
    kode: string;
    nama_barang: string;
    satuan: string;
    harga: string | number;
}
export interface DeliveryNoteItem {
    id?: number;
    product_id: number;
    qty: string | number;
    harga: string | number;
    subtotal?: string | number;
    product?: ProductOption;
}
export interface DeliveryNoteData {
    id?: number;
    company_id: number;
    customer_id: number;
    nomor_dn: string;
    tanggal: string;
    no_po: string | null;
    status?: 'available' | 'used';
    items: DeliveryNoteItem[];
}
interface Props {
    companies: { id: number; nama: string }[];
    customers: { id: number; nama: string }[];
    products: ProductOption[];
    deliveryNote?: DeliveryNoteData;
    mode: 'create' | 'edit';
}

const money = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
const blankItem = (): DeliveryNoteItem => ({ product_id: 0, qty: 1, harga: 0 });

export default function DeliveryNoteForm({
    companies,
    customers,
    products,
    deliveryNote,
    mode,
}: Props) {
    const [items, setItems] = useState<DeliveryNoteItem[]>(
        deliveryNote?.items?.length ? deliveryNote.items : [blankItem()],
    );
    const [calendarOpen, setCalendarOpen] = useState(false);
    const form = useForm({
        company_id: deliveryNote?.company_id ?? '',
        customer_id: deliveryNote?.customer_id ?? '',
        nomor_dn: deliveryNote?.nomor_dn ?? '',
        tanggal: deliveryNote?.tanggal ?? new Date().toISOString().slice(0, 10),
        no_po: deliveryNote?.no_po ?? '',
        items,
    });
    const selectedDate = form.data.tanggal
        ? parseISO(String(form.data.tanggal).slice(0, 10))
        : undefined;
    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) =>
                    sum + Number(item.qty || 0) * Number(item.harga || 0),
                0,
            ),
        [items],
    );

    const updateItems = (nextItems: DeliveryNoteItem[]) => {
        setItems(nextItems);
        form.setData('items', nextItems);
    };
    const updateItem = (
        index: number,
        key: 'product_id' | 'qty' | 'harga',
        value: string,
    ) => {
        const nextItems = [...items];
        if (key === 'product_id') {
            const product = products.find(
                (option) => option.id === Number(value),
            );
            nextItems[index] = {
                ...nextItems[index],
                product_id: Number(value),
                harga: product?.harga ?? 0,
            };
        } else {
            nextItems[index] = { ...nextItems[index], [key]: value };
        }
        updateItems(nextItems);
    };
    const submit = (event: FormEvent) => {
        event.preventDefault();
        const options = {
            onSuccess: () => {
                toast.success(
                    `Delivery Note berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}.`,
                );
            },
            onError: () => toast.error('Gagal menyimpan Delivery Note.'),
        };
        mode === 'create'
            ? form.post(deliveryNotesRoutes.store.url(), options)
            : form.put(
                  deliveryNotesRoutes.update.url(deliveryNote!.id!),
                  options,
              );
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Delivery Note</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Perusahaan *</Label>
                        <Select
                            name="company_id"
                            value={String(form.data.company_id || '')}
                            onValueChange={(value) =>
                                form.setData('company_id', Number(value))
                            }
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih perusahaan" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((company) => (
                                    <SelectItem
                                        key={company.id}
                                        value={String(company.id)}
                                    >
                                        {company.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.company_id && (
                            <p className="text-sm text-destructive">
                                {form.errors.company_id}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Customer *</Label>
                        <Select
                            name="customer_id"
                            value={String(form.data.customer_id || '')}
                            onValueChange={(value) =>
                                form.setData('customer_id', Number(value))
                            }
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((customer) => (
                                    <SelectItem
                                        key={customer.id}
                                        value={String(customer.id)}
                                    >
                                        {customer.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.customer_id && (
                            <p className="text-sm text-destructive">
                                {form.errors.customer_id}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nomor_dn">Nomor DN *</Label>
                        <Input
                            id="nomor_dn"
                            value={form.data.nomor_dn}
                            onChange={(e) =>
                                form.setData('nomor_dn', e.target.value)
                            }
                            required
                        />
                        {form.errors.nomor_dn && (
                            <p className="text-sm text-destructive">
                                {form.errors.nomor_dn}
                            </p>
                        )}
                    </div>
                    <Field>
                        <FieldLabel htmlFor="tanggal">Tanggal *</FieldLabel>
                        <Popover
                            open={calendarOpen}
                            onOpenChange={setCalendarOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    id="tanggal"
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? (
                                        format(selectedDate, 'PPP')
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Pilih tanggal
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    defaultMonth={selectedDate}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        if (date) {
                                            form.setData(
                                                'tanggal',
                                                format(date, 'yyyy-MM-dd'),
                                            );
                                            setCalendarOpen(false);
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </Field>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="no_po">Nomor PO</Label>
                        <Input
                            id="no_po"
                            value={form.data.no_po}
                            onChange={(e) =>
                                form.setData('no_po', e.target.value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Daftar Barang</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => updateItems([...items, blankItem()])}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Barang
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map((item, index) => (
                        <div
                            className="grid gap-3 rounded-md border p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                            key={index}
                        >
                            <div className="space-y-2">
                                <Label>Barang *</Label>
                                <Select
                                    value={String(item.product_id || '')}
                                    onValueChange={(value) =>
                                        updateItem(index, 'product_id', value)
                                    }
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih barang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem
                                                key={product.id}
                                                value={String(product.id)}
                                            >
                                                {product.kode} -{' '}
                                                {product.nama_barang}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Qty *</Label>
                                <Input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={item.qty}
                                    onChange={(e) =>
                                        updateItem(index, 'qty', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Harga *</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.harga}
                                    onChange={(e) =>
                                        updateItem(
                                            index,
                                            'harga',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtotal</Label>
                                <div className="flex h-9 items-center font-mono text-sm">
                                    {money(
                                        Number(item.qty || 0) *
                                            Number(item.harga || 0),
                                    )}
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="mt-6 text-destructive"
                                disabled={items.length === 1}
                                onClick={() =>
                                    updateItems(
                                        items.filter(
                                            (_, itemIndex) =>
                                                itemIndex !== index,
                                        ),
                                    )
                                }
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <div className="flex justify-end border-t pt-4 text-lg font-semibold">
                        Subtotal:{' '}
                        <span className="ml-3 font-mono">
                            {money(subtotal)}
                        </span>
                    </div>
                </CardContent>
            </Card>
            <div className="flex justify-end gap-3">
                <Link href={deliveryNotesRoutes.index.url()}>
                    <Button type="button" variant="outline">
                        Batal
                    </Button>
                </Link>
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Menyimpan...' : 'Simpan Delivery Note'}
                </Button>
            </div>
        </form>
    );
}
