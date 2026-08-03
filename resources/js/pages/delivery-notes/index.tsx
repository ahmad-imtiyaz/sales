import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Printer, Search, Trash2 } from 'lucide-react';
import type { FormEvent} from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import deliveryNotesRoutes from '@/routes/delivery-notes';

interface DeliveryNote { id: number; nomor_dn: string; tanggal: string; no_po: string | null; status: 'available' | 'used'; items_count: number; company: { nama: string }; customer: { nama: string } }
interface Props { deliveryNotes: { data: DeliveryNote[]; current_page: number; last_page: number; from: number; links: Array<{ url: string | null; label: string; active: boolean }> }; filters: { search?: string } }
const date = (value: string) => new Intl.DateTimeFormat('id-ID').format(new Date(value));

export default function DeliveryNotesIndex({ deliveryNotes, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const deleteForm = useForm({ _method: 'delete' });
    const submitSearch = (event: FormEvent) => {
 event.preventDefault(); router.visit(deliveryNotesRoutes.index.url({ query: { search: search.trim() } }), { preserveState: true, preserveScroll: true }); 
};
    const confirmDelete = () => {
 if (deleteId === null) {
return;
}

 deleteForm.delete(deliveryNotesRoutes.destroy.url(deleteId), { onSuccess: () => {
 toast.success('Delivery Note berhasil dihapus.'); setDeleteId(null); 
}, onError: () => toast.error('Delivery Note gagal dihapus.') }); 
};

    return <><Head title="Delivery Note" /><div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold tracking-tight">Delivery Note</h1><p className="text-muted-foreground">Kelola Delivery Note sebelum dipakai Invoice.</p></div><Link href={deliveryNotesRoutes.create.url()}><Button><Plus className="mr-2 h-4 w-4" />Tambah Delivery Note</Button></Link></div><Card><CardHeader><CardTitle>Daftar Delivery Note</CardTitle></CardHeader><CardContent><form onSubmit={submitSearch} className="mb-4 flex max-w-xl gap-2"><div className="relative flex-1"><Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" placeholder="Cari nomor DN, PO, perusahaan, customer..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><Button type="submit">Cari</Button>{search && <Link href={deliveryNotesRoutes.index.url()}><Button type="button" variant="outline">Reset</Button></Link>}</form><div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>#</TableHead><TableHead>Nomor DN</TableHead><TableHead>Tanggal</TableHead><TableHead>Perusahaan</TableHead><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead className="text-center">Aksi</TableHead></TableRow></TableHeader><TableBody>{deliveryNotes.data.length === 0 ? <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Belum ada Delivery Note.</TableCell></TableRow> : deliveryNotes.data.map((note, index) => <TableRow key={note.id}><TableCell>{(deliveryNotes.from ?? 0) + index}</TableCell><TableCell className="font-mono font-medium">{note.nomor_dn}</TableCell><TableCell>{date(note.tanggal)}</TableCell><TableCell>{note.company.nama}</TableCell><TableCell>{note.customer.nama}</TableCell><TableCell><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${note.status === 'available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>{note.status === 'available' ? 'AVAILABLE' : 'USED'}</span></TableCell><TableCell className="text-center"><div className="flex justify-center gap-2"><a href={deliveryNotesRoutes.print.url(note.id)} target="_blank" rel="noreferrer"><Button variant="ghost" size="icon" title="Cetak PDF"><Printer className="h-4 w-4" /></Button></a>{note.status === 'available' ? <><Link href={deliveryNotesRoutes.edit.url(note.id)}><Button variant="ghost" size="icon" title="Edit"><Edit className="h-4 w-4" /></Button></Link><Button variant="ghost" size="icon" className="text-destructive" title="Hapus" onClick={() => setDeleteId(note.id)}><Trash2 className="h-4 w-4" /></Button></> : null}</div></TableCell></TableRow>)}</TableBody></Table></div>{deliveryNotes.last_page > 1 && <Pagination currentPage={deliveryNotes.current_page} totalPages={deliveryNotes.last_page} baseUrl={deliveryNotesRoutes.index.url()} searchParams={{ search }} />}</CardContent></Card></div>{deleteId !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteId(null)}><div className="w-full max-w-md rounded-lg border bg-background p-6" onClick={(event) => event.stopPropagation()}><h3 className="mb-2 text-lg font-semibold">Hapus Delivery Note?</h3><p className="mb-4 text-muted-foreground">Data dan item DN akan dihapus.</p><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button><Button variant="destructive" onClick={confirmDelete} disabled={deleteForm.processing}>Hapus</Button></div></div></div>}</>;
}

DeliveryNotesIndex.layout = { breadcrumbs: [{ title: 'Transaksi', href: '#' }, { title: 'Delivery Note', href: deliveryNotesRoutes.index.url() }] };
