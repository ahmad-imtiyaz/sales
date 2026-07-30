import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InvoiceForm, {
    type BankAccountOption,
    type InvoiceData,
} from './_form';
import invoicesRoutes from '@/routes/invoices';

interface Props {
    invoice: InvoiceData & { delivery_note?: { id: number; nomor_dn: string } };
    bankAccounts: BankAccountOption[];
    deliveryNotes: Array<{
        id: number;
        nomor_dn: string;
        no_po: string | null;
        customer: { id: number; nama: string };
        company: { id: number; nama: string };
        items: Array<{
            id: number;
            product_id: number;
            qty: number;
            harga: number;
            subtotal: number;
            product: { id: number; kode: string; nama_barang: string; satuan: string };
        }>;
    }>;
}

export default function InvoicesEdit({ invoice, bankAccounts, deliveryNotes }: Props) {
    return (
        <>
            <Head title="Edit Invoice" />
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={invoicesRoutes.show.url(invoice.id!)}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Invoice</h1>
                        <p className="text-muted-foreground">
                            Perbarui Invoice {invoice.nomor_invoice}.
                        </p>
                    </div>
                </div>
                <InvoiceForm
                    deliveryNotes={deliveryNotes}
                    bankAccounts={bankAccounts}
                    invoice={invoice}
                    mode="edit"
                />
            </div>
        </>
    );
}

InvoicesEdit.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Transaksi', href: '#' },
        { title: 'Invoice', href: invoicesRoutes.index.url() },
        { title: 'Edit', href: invoicesRoutes.edit.url(props.invoice.id!) },
    ],
});
