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

export default function CustomersCreate() {
    return (
        <>
            <Head title="Tambah Customer" />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={customers.index()}>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tambah Customer</h1>
                        <p className="text-muted-foreground">Isi form di bawah untuk menambahkan customer baru</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Customer</CardTitle>
                        <CardDescription>Data customer akan digunakan untuk Delivery Note dan Invoice</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={customers.store()}
                            method="post"
                            onSuccess={() => {
                                toast.success('Customer berhasil ditambahkan.');
                                router.visit(customers.index());
                            }}
                            onError={() => toast.error('Gagal menambahkan customer.')}
                        >
                            {({ errors, processing }) => (
                                <form className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama">Nama Customer *</Label>
                                        <Input
                                            id="nama"
                                            name="nama"
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
                                            {processing ? 'Menyimpan...' : 'Simpan Customer'}
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

CustomersCreate.layout = {
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
            title: 'Tambah',
            href: customers.create(),
        },
    ],
};