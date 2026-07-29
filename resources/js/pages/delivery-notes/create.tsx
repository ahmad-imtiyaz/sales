import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeliveryNoteForm, { ProductOption } from './_form';
import deliveryNotesRoutes from '@/routes/delivery-notes';

interface Props { companies: { id: number; nama: string }[]; customers: { id: number; nama: string }[]; products: ProductOption[] }

export default function DeliveryNotesCreate(props: Props) {
    return <><Head title="Tambah Delivery Note" /><div className="mx-auto max-w-6xl space-y-6"><div className="flex items-center gap-4"><Link href={deliveryNotesRoutes.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link><div><h1 className="text-3xl font-bold tracking-tight">Tambah Delivery Note</h1><p className="text-muted-foreground">Isi informasi DN dan daftar barang.</p></div></div><DeliveryNoteForm {...props} mode="create" /></div></>;
}

DeliveryNotesCreate.layout = { breadcrumbs: [{ title: 'Transaksi', href: '#' }, { title: 'Delivery Note', href: deliveryNotesRoutes.index.url() }, { title: 'Tambah', href: deliveryNotesRoutes.create.url() }] };
