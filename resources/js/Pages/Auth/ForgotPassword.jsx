import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel'; // Pastikan komponen ini ada atau sesuaikan
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { KeyRound, ArrowLeft, MailCheck } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            {/* Header / Ilustrasi Bagian Atas */}
            <div className="mb-8 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border border-blue-100 shadow-sm">
                    <KeyRound className="text-blue-600" size={28} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Lupa Password?</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium px-4">
                    Tidak masalah. Masukkan alamat email Anda yang terdaftar, dan kami akan mengirimkan tautan untuk mengatur ulang password Anda.
                </p>
            </div>

            {/* Alert Status Sukses */}
            {status && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold text-emerald-700 flex items-start gap-3 shadow-sm">
                    <MailCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Input Email */}
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="mb-2 block text-sm font-bold text-slate-700" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500/20 shadow-sm transition-all outline-none"
                        isFocused={true}
                        placeholder="contoh: email@gmail.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2 text-sm font-medium text-rose-500" />
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col gap-4 mt-2">
                    <PrimaryButton 
                        className="w-full flex justify-center py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]" 
                        disabled={processing}
                    >
                        {processing ? 'Mengirim...' : 'Kirim Tautan Reset Password'}
                    </PrimaryButton>

                    <Link
                        href={route('login')}
                        className="text-center text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        <ArrowLeft size={16} strokeWidth={2.5} /> Kembali ke halaman Login
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}