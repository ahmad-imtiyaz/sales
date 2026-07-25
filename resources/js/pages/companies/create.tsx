import { Head } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Building2 } from 'lucide-react';
import companiesRoutes from '@/routes/companies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@inertiajs/react';
import { toast } from 'sonner';

export default function CompaniesCreate() {
    return (
        <>
            <Head title="Tambah Perusahaan" />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={companiesRoutes.index.url()}>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tambah Perusahaan</h1>
                        <p className="text-muted-foreground">Isi form di bawah untuk menambahkan perusahaan baru</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Perusahaan</CardTitle>
                        <CardDescription>Data perusahaan akan digunakan untuk Delivery Note dan Invoice</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={companiesRoutes.store.url()}
                            method="post"
                            onSuccess={() => {
                                toast.success('Perusahaan berhasil ditambahkan.');
                                router.visit(companiesRoutes.index.url());
                            }}
                            onError={() => toast.error('Gagal menambahkan perusahaan.')}
                        >
                            {({ errors, processing }) => (
                                <form className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama">Nama Perusahaan *</Label>
                                        <Input
                                            id="nama"
                                            name="nama"
                                            placeholder="Contoh: CV Agus Jaya"
                                            autoComplete="off"
                                            required
                                            className={errors.nama ? 'border-destructive' : ''}
                                        />
                                        {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Logo (URL)</Label>
                                        <Input
                                            id="logo"
                                            name="logo"
                                            type="url"
                                            placeholder="https://example.com/logo.png"
                                            autoComplete="off"
                                            className={errors.logo ? 'border-destructive' : ''}
                                        />
                                        {errors.logo && <p className="text-sm text-destructive">{errors.logo}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="alamat">Alamat</Label>
                                        <Textarea
                                            id="alamat"
                                            name="alamat"
                                            placeholder="Alamat lengkap perusahaan"
                                            rows={3}
                                            className={errors.alamat ? 'border-destructive' : ''}
                                        />
                                        {errors.alamat && <p className="text-sm text-destructive">{errors.alamat}</p>}
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
                                                placeholder="contoh@perusahaan.com"
                                                autoComplete="off"
                                                className={errors.email ? 'border-destructive' : ''}
                                            />
                                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Link href={companiesRoutes.index.url()}>
                                            <Button type="button" variant="outline">
                                                Batal
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Menyimpan...' : 'Simpan Perusahaan'}
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

CompaniesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Master',
            href: '#',
        },
        {
            title: 'Perusahaan',
            href: companiesRoutes.index.url(),
        },
        {
            title: 'Tambah',
            href: companiesRoutes.create.url(),
        },
    ],
};