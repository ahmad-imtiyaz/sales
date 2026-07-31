import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
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
        form.post('login.store', {
            onError: () => {},
        });
    };

    return (
        <div>
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
                                    <div className="w-8 h-8 bg-white rounded-lg" />
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
                    </div>

                    <div className="space-y-4">
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
                                <Label htmlFor="password">Password</Label>
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
                    </div>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        &copy; {new Date().getFullYear()} {name}. Hak cipta dilindungi.
                    </p>
                </div>
            </div>
        </div>
    );
}

Login.layout = (page: any) => ({
    bodyClassName: 'min-h-screen',
});