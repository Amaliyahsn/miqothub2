import AdminLayout from '@/Layouts/AdminLayout';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, ShieldCheck, Settings } from 'lucide-react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    
    // Menentukan layout secara dinamis berdasarkan role user yang login
    const Layout = auth.user.role === 'admin' ? AdminLayout : MemberLayout;

    return (
        <Layout user={auth.user}>
            <Head title="Pengaturan Profil" />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
                    <Settings size={24} className="text-blue-600" /> Pengaturan Akun
                </h1>
                <p className="text-slate-500 mt-1.5 text-sm font-semibold">
                    Lengkapi identitas pribadi dan amankan akun Anda untuk akses layanan yang lebih baik.
                </p>
            </div>

            <div className="space-y-8 pb-12">
                
                {/* Informasi Identitas */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-blue-950/5 transition-all duration-500">
                    <div className="p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                <User size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-blue-950">Informasi Identitas</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Detail profil dan biodata diri</p>
                            </div>
                        </div>

                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>

                {/* Keamanan Akun */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-blue-950/5 transition-all duration-500">
                    <div className="p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                                <ShieldCheck size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800">Keamanan Akun</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Perbarui kata sandi secara berkala</p>
                            </div>
                        </div>

                        <UpdatePasswordForm />
                    </div>
                </div>

            </div>
        </Layout>
    );
}