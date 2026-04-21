import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            {/* Container Utama dengan Padding Responsif agar tidak mepet di HP */}
            <div className="px-4 py-6 sm:px-8 sm:py-10">
                
                {/* Header dengan spacing yang lebih lega */}
                <div className="mb-10 text-left">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Atur ulang kata sandi
                    </h2>
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                        Silakan buat kata sandi baru. Gunakan minimal 8 karakter dengan kombinasi angka dan huruf untuk keamanan akun MiqotHub Anda.
                    </p>
                </div>

                {/* Form dengan vertical gap yang konsisten (space-y-6) */}
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel 
                            htmlFor="email" 
                            value="Email" 
                            className="text-gray-700 font-semibold mb-2 ml-1 text-xs uppercase tracking-wider" 
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            /* py-3 untuk input yang lebih tinggi dan mewah */
                            className="block w-full border-gray-200 rounded-xl shadow-sm py-3 px-4 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50/30 transition-all duration-200"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2 text-xs font-medium" />
                    </div>

                    <div>
                        <InputLabel 
                            htmlFor="password" 
                            value="Kata sandi baru" 
                            className="text-gray-700 font-semibold mb-2 ml-1 text-xs uppercase tracking-wider" 
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full border-gray-200 rounded-xl shadow-sm py-3 px-4 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2 text-xs font-medium" />
                    </div>

                    <div>
                        <InputLabel 
                            htmlFor="password_confirmation" 
                            value="Konfirmasi kata sandi" 
                            className="text-gray-700 font-semibold mb-2 ml-1 text-xs uppercase tracking-wider" 
                        />
                        <TextInput
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full border-gray-200 rounded-xl shadow-sm py-3 px-4 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2 text-xs font-medium" />
                    </div>

                    {/* Tombol dengan margin top tambahan agar tidak menempel ke input terakhir */}
                    <div className="pt-6">
                        <PrimaryButton 
                            className="w-full flex justify-center py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold tracking-widest uppercase text-xs transition-all active:scale-[0.98] shadow-lg shadow-gray-200" 
                            disabled={processing}
                        >
                            {processing ? 'Memproses...' : 'Simpan Perubahan'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}