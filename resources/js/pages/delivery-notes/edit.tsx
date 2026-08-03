import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import deliveryNotesRoutes from '@/routes/delivery-notes';
import type { DeliveryNoteData, ProductOption } from './_form';
import DeliveryNoteForm from './_form';

interface Props { companies: { id: number; nama: string }[]; customers: { id: number; nama: string }[]; products: ProductOption[]; deliveryNote: DeliveryNoteData }

export default function DeliveryNotesEdit(props: Props) {
    return <><Head title="Edit Delivery Note" /><div className="mx-auto max-w-6xl space-y-6"><div className="flex items-center gap-4"><Link href={deliveryNotesRoutes.index.url()}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link><div><h1 className="text-3xl font-bold tracking-tight">Edit Delivery Note</h1><p className="text-muted-foreground">Perbarui DN {props.deliveryNote.nomor_dn}.</p></div></div><DeliveryNoteForm {...props} mode="edit" /></div></>;
}

DeliveryNotesEdit.layout = (props: Props) => ({ breadcrumbs: [{ title: 'Transaksi', href: '#' }, { title: 'Delivery Note', href: deliveryNotesRoutes.index.url() }, { title: 'Edit', href: deliveryNotesRoutes.edit.url(props.deliveryNote.id!) }] });
