import { Head } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Banknote } from 'lucide-react';
import bankAccountsRoutes from '@/routes/bank-accounts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@inertiajs/react';
import { toast } from 'sonner';

interface Company {
    id: number;
    nama: string;
}

interface BankAccount {
    id: number;
    company_id: number;
    company: { id: number; nama: string };
    nama_bank: string;
    nomor_rekening: string;
    atas_nama: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

interface BankAccountsEditProps {
    bankAccount: BankAccount;
    companies: Company[];
}

export default function BankAccountsEdit({ bankAccount, companies }: BankAccountsEditProps) {
    return (
        <>
            <Head title="Edit Rekening" />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={bankAccountsRoutes.index.url()}>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Rekening</h1>
                        <p className="text-muted-foreground">Perbarui informasi rekening di bawah ini</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Rekening</CardTitle>
                        <CardDescription>Data rekening akan digunakan pada footer PDF Invoice</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={bankAccountsRoutes.update(bankAccount.id)}
                            method="put"
                            onSuccess={() => {
                                toast.success('Rekening berhasil diperbarui.');
                                router.visit(bankAccountsRoutes.index.url());
                            }}
                            onError={() => toast.error('Gagal memperbarui rekening.')}
                        >
                            {({ errors, processing }) => (
                                <form className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_id">Perusahaan *</Label>
                                        <Select
                                            name="company_id"
                                            defaultValue={bankAccount.company_id.toString()}
                                            required
                                            className={errors.company_id ? 'border-destructive' : ''}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih perusahaan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((company) => (
                                                    <SelectItem key={company.id} value={company.id.toString()}>
                                                        {company.nama}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.company_id && <p className="text-sm text-destructive">{errors.company_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nama_bank">Nama Bank *</Label>
                                        <Input
                                            id="nama_bank"
                                            name="nama_bank"
                                            defaultValue={bankAccount.nama_bank}
                                            placeholder="Contoh: BRI, BCA, Mandiri, BNI"
                                            autoComplete="off"
                                            required
                                            className={errors.nama_bank ? 'border-destructive' : ''}
                                        />
                                        {errors.nama_bank && <p className="text-sm text-destructive">{errors.nama_bank}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nomor_rekening">Nomor Rekening *</Label>
                                        <Input
                                            id="nomor_rekening"
                                            name="nomor_rekening"
                                            defaultValue={bankAccount.nomor_rekening}
                                            placeholder="Contoh: 0563-01-000400-30-3"
                                            autoComplete="off"
                                            required
                                            className={errors.nomor_rekening ? 'border-destructive' : ''}
                                        />
                                        {errors.nomor_rekening && <p className="text-sm text-destructive">{errors.nomor_rekening}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="atas_nama">Atas Nama *</Label>
                                        <Input
                                            id="atas_nama"
                                            name="atas_nama"
                                            defaultValue={bankAccount.atas_nama}
                                            placeholder="Contoh: CV Agus Jaya"
                                            autoComplete="off"
                                            required
                                            className={errors.atas_nama ? 'border-destructive' : ''}
                                        />
                                        {errors.atas_nama && <p className="text-sm text-destructive">{errors.atas_nama}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select name="status" defaultValue={bankAccount.status ? 'true' : 'false'}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">Aktif</SelectItem>
                                                <SelectItem value="false">Tidak Aktif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Link href={bankAccountsRoutes.index.url()}>
                                            <Button type="button" variant="outline">
                                                Batal
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

BankAccountsEdit.layout = {
    breadcrumbs: [
        {
            title: 'Master',
            href: '#',
        },
        {
            title: 'Rekening',
            href: bankAccountsRoutes.index.url(),
        },
        {
            title: 'Edit',
            href: bankAccountsRoutes.edit(bankAccount.id).url,
        },
    ],
};