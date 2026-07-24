import { Head } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Package } from 'lucide-react';
import productsRoutes from '@/routes/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { toast } from 'sonner';

interface Product {
    id: number;
    kode: string;
    nama_barang: string;
    satuan: string;
    harga: string | number;
    created_at: string;
    updated_at: string;
}

interface ProductsEditProps {
    product: Product;
}

export default function ProductsEdit({ product }: ProductsEditProps) {
    return (
        <>
            <Head title="Edit Barang" />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={productsRoutes.index.url()}>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Barang</h1>
                        <p className="text-muted-foreground">Perbarui informasi barang di bawah ini</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Barang</CardTitle>
                        <CardDescription>Data barang akan digunakan untuk Delivery Note dan Invoice</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={productsRoutes.update(product.id)}
                            method="put"
                            onSuccess={() => {
                                toast.success('Barang berhasil diperbarui.');
                                router.visit(productsRoutes.index.url());
                            }}
                            onError={() => toast.error('Gagal memperbarui barang.')}
                        >
                            {({ errors, processing }) => (
                                <form className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="kode">Kode Barang *</Label>
                                        <Input
                                            id="kode"
                                            name="kode"
                                            defaultValue={product.kode}
                                            placeholder="Contoh: BRG-001"
                                            autoComplete="off"
                                            required
                                            className={errors.kode ? 'border-destructive' : ''}
                                        />
                                        {errors.kode && <p className="text-sm text-destructive">{errors.kode}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nama_barang">Nama Barang *</Label>
                                        <Input
                                            id="nama_barang"
                                            name="nama_barang"
                                            defaultValue={product.nama_barang}
                                            placeholder="Contoh: Material Renovasi Ruang TBT"
                                            autoComplete="off"
                                            required
                                            className={errors.nama_barang ? 'border-destructive' : ''}
                                        />
                                        {errors.nama_barang && <p className="text-sm text-destructive">{errors.nama_barang}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="satuan">Satuan *</Label>
                                            <Input
                                                id="satuan"
                                                name="satuan"
                                                defaultValue={product.satuan}
                                                placeholder="Contoh: Unit, Meter, Kg, Pcs"
                                                autoComplete="off"
                                                required
                                                className={errors.satuan ? 'border-destructive' : ''}
                                            />
                                            {errors.satuan && <p className="text-sm text-destructive">{errors.satuan}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="harga">Harga *</Label>
                                            <Input
                                                id="harga"
                                                name="harga"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                defaultValue={product.harga}
                                                placeholder="Contoh: 413500"
                                                autoComplete="off"
                                                required
                                                className={errors.harga ? 'border-destructive' : ''}
                                            />
                                            {errors.harga && <p className="text-sm text-destructive">{errors.harga}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Link href={productsRoutes.index.url()}>
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

ProductsEdit.layout = {
    breadcrumbs: [
        {
            title: 'Master',
            href: '#',
        },
        {
            title: 'Barang',
            href: productsRoutes.index.url(),
        },
        {
            title: 'Edit',
            href: productsRoutes.edit(product.id).url,
        },
    ],
};