import { Head } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Users } from 'lucide-react';
import customers from '@/routes/customers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@inertiajs/react';
import { toast } from 'sonner';

interface Customer {
    id: number;
    nama: string;
    alamat: string | null;
    kota: string | null;
    pic: string | null;
    telepon: string | null;
    email: string | null;
    created_at: string;
    updated_at: string;
}

interface CustomersEditProps {
    customer: Customer;
}

export default function CustomersEdit({ customer }: CustomersEditProps) {
    return (
        <>
            <Head title="Edit Customer" />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={customers.index()}>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
                        <p className="text-muted-foreground">Perbarui informasi customer di bawah ini</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Customer</CardTitle>
                        <CardDescription>Data customer akan digunakan untuk Delivery Note dan Invoice</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={customers.update(customer.id)}
                            method="put"
                            onSuccess={() => {
                                toast.success('Customer berhasil diperbarui.');
                                router.visit(customers.index());
                            }}
                            onError={() => toast.error('Gagal memperbarui customer.')}
                        >
                            {({ errors, processing }) => (
                                <form className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama">Nama Customer *</Label>
                                        <Input
                                            id="nama"
                                            name="nama"
                                            defaultValue={customer.nama}
                                            placeholder="Contoh: PT Orica Mining Services"
                                            autoComplete="off"
                                            required
                                            className={errors.nama ? 'border-destructive' : ''}
                                        />
                                        {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="alamat">Alamat</Label>
                                        <Textarea
                                            id="alamat"
                                            name="alamat"
                                            defaultValue={customer.alamat ?? ''}
                                            placeholder="Alamat lengkap customer"
                                            rows={3}
                                            className={errors.alamat ? 'border-destructive' : ''}
                                        />
                                        {errors.alamat && <p className="text-sm text-destructive">{errors.alamat}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="kota">Kota</Label>
                                            <Input
                                                id="kota"
                                                name="kota"
                                                defaultValue={customer.kota ?? ''}
                                                placeholder="Contoh: Jakarta Selatan"
                                                autoComplete="off"
                                                className={errors.kota ? 'border-destructive' : ''}
                                            />
                                            {errors.kota && <p className="text-sm text-destructive">{errors.kota}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pic">PIC (Person in Charge)</Label>
                                            <Input
                                                id="pic"
                                                name="pic"
                                                defaultValue={customer.pic ?? ''}
                                                placeholder="Nama kontak person"
                                                autoComplete="off"
                                                className={errors.pic ? 'border-destructive' : ''}
                                            />
                                            {errors.pic && <p className="text-sm text-destructive">{errors.pic}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="telepon">Telepon</Label>
                                            <Input
                                                id="telepon"
                                                name="telepon"
                                                defaultValue={customer.telepon ?? ''}
                                                placeholder="Contoh: 021-1234567"
                                                autoComplete="off"
                                                className={errors.telepon ? 'border-destructive' : ''}
                                            />
                                            {errors.telepon && <p className="text-sm text-destructive">{errors.telepon}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={customer.email ?? ''}
                                                placeholder="contoh@customer.com"
                                                autoComplete="off"
                                                className={errors.email ? 'border-destructive' : ''}
                                            />
                                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Link href={customers.index()}>
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

CustomersEdit.layout = {
    breadcrumbs: [
        {
            title: 'Master',
            href: '#',
        },
        {
            title: 'Customer',
            href: customers.index(),
        },
        {
            title: 'Edit',
            href: customers.edit(customer.id),
        },
    ],
};