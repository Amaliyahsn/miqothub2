import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi" />

            {/* Header: Rata kiri dan lega agar konsisten */}
            <div className="mb-10 text-left px-1">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Konfirmasi Keamanan</h2>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed font-medium">
                    Ini adalah area terproteksi. Silakan masukkan kata sandi Anda untuk memverifikasi identitas sebelum melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-8">
                <div>
                    <InputLabel 
                        htmlFor="password" 
                        value="Kata Sandi" 
                        className="text-gray-700 font-semibold mb-2.5 ml-1 text-xs uppercase tracking-wider" 
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        /* Menggunakan rounded-xl dan py-3.5 agar kotak lebih premium */
                        className="block w-full border-gray-200 rounded-xl shadow-sm py-3.5 px-4 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200"
                        isFocused={true}
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-xs font-medium" />
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        /* Warna hitam (gray-900) agar terlihat kokoh dan profesional */
                        className="w-full flex justify-center py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold tracking-widest uppercase text-xs transition-all active:scale-[0.98] shadow-sm" 
                        disabled={processing}
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi Keamanan'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}