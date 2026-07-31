import { Head, useForm, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { route as ziggyRoute } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    const { name, logo } = usePage().props;

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(ziggyRoute('login.store'), {
            onError: () => {},
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            {logo ? (
                                <img
                                    src={`/storage/${logo}`}
                                    alt="Logo"
                                    className="w-16 h-16 object-cover rounded-xl"
                                />
                            ) : (
                                <div className="w-16 h-16 mx-auto rounded-xl bg-primary flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 40 42">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
                    </div>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-center">Masuk ke Akun</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={submit}>
                                {status && (
                                    <div className="text-sm text-center text-green-600 dark:text-green-400 mb-2">
                                        {status}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        className="w-full"
                                    />
                                    {form.errors.email && (
                                        <p className="text-sm text-destructive">{form.errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="w-full"
                                    />
                                    {form.errors.password && (
                                        <p className="text-sm text-destructive">{form.errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={form.data.remember}
                                            onChange={(e) => form.setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Ingat saya</span>
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full mt-2"
                                    disabled={form.processing}
                                >
                                    {form.processing ? 'Memproses...' : 'Masuk'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        &copy; {new Date().getFullYear()} {name}. Hak cipta dilindungi.
                    </p>
                </div>
            </div>
        </>
    );
}

Login.layout = (page: any) => ({
    bodyClassName: 'min-h-screen',
});