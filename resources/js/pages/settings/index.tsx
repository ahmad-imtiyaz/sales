import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Image, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, useForm } from '@inertiajs/react';
import settingsRoutes from '@/routes/settings';

interface SettingsIndexProps {
    siteName: string;
    logo: string | null;
}

export default function SettingsIndex({ siteName, logo }: SettingsIndexProps) {
    const [preview, setPreview] = useState<string | null>(logo ? `/storage/${logo}` : null);

    const form = useForm({
        siteName,
        logo: null,
    });

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            form.setData('logo', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post(settingsRoutes.update.url(), {
            onSuccess: () => toast.success('Pengaturan berhasil disimpan.'),
            onError: () => toast.error('Gagal menyimpan pengaturan.'),
        });
    };

    return (
        <>
            <Head title="Pengaturan Website" />
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={window.location.pathname.replace('/settings', '/dashboard')}>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Website</h1>
                        <p className="text-muted-foreground">
                            Kelola logo dan nama website
                        </p>
                    </div>
                </div>

                <Form onSubmit={submit}>
                    {({ errors, processing }) => (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Logo Website</CardTitle>
                                    <CardDescription>
                                        Format: PNG/JPG, maksimal 2MB. Kosongkan untuk hapus logo.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-24 rounded-lg border bg-muted">
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Logo Preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Image className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="logo">Logo</Label>
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className={errors.logo ? 'border-destructive' : ''}
                                            />
                                            {errors.logo && (
                                                <p className="text-sm text-destructive">{errors.logo}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Nama Website</CardTitle>
                                    <CardDescription>
                                        Akan tampil di halaman login dan sidebar.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="siteName">Nama Website</Label>
                                        <Input
                                            id="siteName"
                                            name="siteName"
                                            value={form.data.siteName}
                                            onChange={(e) => form.setData('siteName', e.target.value)}
                                            placeholder="Contoh: CV Agus Jaya"
                                            required
                                            className={errors.siteName ? 'border-destructive' : ''}
                                        />
                                        {errors.siteName && (
                                            <p className="text-sm text-destructive">{errors.siteName}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end gap-3">
                                <Link href={window.location.pathname.replace('/settings', '/dashboard')}>
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}

SettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Pengaturan', href: '#' },
        { title: 'Website', href: settingsRoutes.index.url() },
    ],
};