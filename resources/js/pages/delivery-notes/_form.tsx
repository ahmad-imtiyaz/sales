import { Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import deliveryNotesRoutes from '@/routes/delivery-notes';

export interface ProductOption { id: number; kode: string; nama_barang: string; satuan: string; harga: string | number }
export interface DeliveryNoteItem { id?: number; product_id: number; qty: string | number; harga: string | number; subtotal?: string | number; product?: ProductOption }
export interface DeliveryNoteData { id?: number; company_id: number; customer_id: number; nomor_dn: string; tanggal: string; no_po: string | null; status?: 'available' | 'used'; items: DeliveryNoteItem[] }
interface Props { companies: { id: number; nama: string }[]; customers: { id: number; nama: string }[]; products: ProductOption[]; deliveryNote?: DeliveryNoteData; mode: 'create' | 'edit' }

const money = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
const blankItem = (): DeliveryNoteItem => ({ product_id: 0, qty: 1, harga: 0 });

export default function DeliveryNoteForm({ companies, customers, products, deliveryNote, mode }: Props) {
    const [items, setItems] = useState<DeliveryNoteItem[]>(deliveryNote?.items?.length ? deliveryNote.items : [blankItem()]);
    const form = useForm({ company_id: deliveryNote?.company_id ?? '', customer_id: deliveryNote?.customer_id ?? '', nomor_dn: deliveryNote?.nomor_dn ?? '', tanggal: deliveryNote?.tanggal ?? new Date().toISOString().slice(0, 10), no_po: deliveryNote?.no_po ?? '', items });
    const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.harga || 0), 0), [items]);

    const updateItems = (nextItems: DeliveryNoteItem[]) => { setItems(nextItems); form.setData('items', nextItems); };
    const updateItem = (index: number, key: 'product_id' | 'qty' | 'harga', value: string) => {
        const nextItems = [...items];
        if (key === 'product_id') {
            const product = products.find((option) => option.id === Number(value));
            nextItems[index] = { ...nextItems[index], product_id: Number(value), harga: product?.harga ?? 0 };
        } else { nextItems[index] = { ...nextItems[index], [key]: value }; }
        updateItems(nextItems);
    };
    const submit = (event: FormEvent) => {
        event.preventDefault();
        const options = { onSuccess: () => { toast.success(`Delivery Note berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}.`); }, onError: () => toast.error('Gagal menyimpan Delivery Note.') };
        mode === 'create' ? form.post(deliveryNotesRoutes.store.url(), options) : form.put(deliveryNotesRoutes.update(deliveryNote!.id!).url(), options);
    };

    return <form onSubmit={submit} className="space-y-6">
        <Card><CardHeader><CardTitle>Informasi Delivery Note</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Perusahaan *</Label><select className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm" value={form.data.company_id} onChange={(e) => form.setData('company_id', Number(e.target.value))} required><option value="">Pilih perusahaan</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.nama}</option>)}</select>{form.errors.company_id && <p className="text-sm text-destructive">{form.errors.company_id}</p>}</div>
            <div className="space-y-2"><Label>Customer *</Label><select className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm" value={form.data.customer_id} onChange={(e) => form.setData('customer_id', Number(e.target.value))} required><option value="">Pilih customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.nama}</option>)}</select>{form.errors.customer_id && <p className="text-sm text-destructive">{form.errors.customer_id}</p>}</div>
            <div className="space-y-2"><Label htmlFor="nomor_dn">Nomor DN *</Label><Input id="nomor_dn" value={form.data.nomor_dn} onChange={(e) => form.setData('nomor_dn', e.target.value)} required />{form.errors.nomor_dn && <p className="text-sm text-destructive">{form.errors.nomor_dn}</p>}</div>
            <div className="space-y-2"><Label htmlFor="tanggal">Tanggal *</Label><Input id="tanggal" type="date" value={form.data.tanggal} onChange={(e) => form.setData('tanggal', e.target.value)} required /></div>
            <div className="space-y-2 md:col-span-2"><Label htmlFor="no_po">Nomor PO</Label><Input id="no_po" value={form.data.no_po} onChange={(e) => form.setData('no_po', e.target.value)} /></div>
        </CardContent></Card>
        <Card><CardHeader><div className="flex items-center justify-between"><CardTitle>Daftar Barang</CardTitle><Button type="button" variant="outline" onClick={() => updateItems([...items, blankItem()])}><Plus className="mr-2 h-4 w-4" />Tambah Barang</Button></div></CardHeader><CardContent className="space-y-4">
            {items.map((item, index) => <div className="grid gap-3 rounded-md border p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]" key={index}><div className="space-y-2"><Label>Barang *</Label><select className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm" value={item.product_id} onChange={(e) => updateItem(index, 'product_id', e.target.value)} required><option value="">Pilih barang</option>{products.map((product) => <option key={product.id} value={product.id}>{product.kode} - {product.nama_barang}</option>)}</select></div><div className="space-y-2"><Label>Qty *</Label><Input type="number" min="0.01" step="0.01" value={item.qty} onChange={(e) => updateItem(index, 'qty', e.target.value)} required /></div><div className="space-y-2"><Label>Harga *</Label><Input type="number" min="0" step="0.01" value={item.harga} onChange={(e) => updateItem(index, 'harga', e.target.value)} required /></div><div className="space-y-2"><Label>Subtotal</Label><div className="flex h-9 items-center font-mono text-sm">{money(Number(item.qty || 0) * Number(item.harga || 0))}</div></div><Button type="button" variant="ghost" size="icon" className="mt-6 text-destructive" disabled={items.length === 1} onClick={() => updateItems(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4" /></Button></div>)}
            <div className="flex justify-end border-t pt-4 text-lg font-semibold">Subtotal: <span className="ml-3 font-mono">{money(subtotal)}</span></div>
        </CardContent></Card>
        <div className="flex justify-end gap-3"><Link href={deliveryNotesRoutes.index.url()}><Button type="button" variant="outline">Batal</Button></Link><Button type="submit" disabled={form.processing}>{form.processing ? 'Menyimpan...' : 'Simpan Delivery Note'}</Button></div>
    </form>;
}
