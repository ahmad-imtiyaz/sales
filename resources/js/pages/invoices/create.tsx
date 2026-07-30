import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InvoiceForm, {
    type BankAccountOption,
    type DeliveryNoteOption,
} from './_form';
import invoicesRoutes from '@/routes/invoices';

interface Props {
    deliveryNotes: DeliveryNoteOption[];
    bankAccounts: BankAccountOption[];
}

export default function InvoicesCreate({ deliveryNotes, bankAccounts }: Props) {
    return (
        <>
            <Head title="Tambah Invoice" />
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={invoicesRoutes.index.url()}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tambah Invoice</h1>
                        <p className="text-muted-foreground">
                            Pilih Delivery Note berstatus available. Data barang otomatis dari DN.
                        </p>
                    </div>
                </div>
                <InvoiceForm
                    deliveryNotes={deliveryNotes}
                    bankAccounts={bankAccounts}
                    mode="create"
                />
            </div>
        </>
    );
}

InvoicesCreate.layout = {
    breadcrumbs: [
        { title: 'Transaksi', href: '#' },
        { title: 'Invoice', href: invoicesRoutes.index.url() },
        { title: 'Tambah', href: invoicesRoutes.create.url() },
    ],
};
