import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeft, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    // Animasi disederhanakan: Cukup kontainer utama yang muncul cepat (Snappy)
    const containerVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 sm:p-6 selection:bg-blue-500 selection:text-white font-sans relative">
            <Head title="Masuk" />

            
            <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors z-20 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <ArrowLeft size={18} />
                <span className="font-semibold text-sm">Kembali</span>
            </Link>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row relative z-10 border border-slate-100"
            >
                
                
                <div className="hidden md:flex md:w-5/12 bg-slate-900 relative flex-col justify-between overflow-hidden">
                    
                    <img src="/assets/images/bg-login.jpg" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Background Login" loading="lazy" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none"></div>

                    <div className="relative h-full w-full p-10 flex flex-col justify-between z-10">
                        
                        <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
                                <BookOpen size={18} strokeWidth={2.5} />
                            </div>
                            MiqotHub.
                        </div>
                        
                        <div className="mt-auto mb-8">
                            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                                Selamat Datang <br/> Kembali!
                            </h2>
                            <p className="text-slate-300 text-base leading-relaxed">
                                Masuk untuk melanjutkan proses belajar, akses modul terbaru, dan tingkatkan kapasitas keilmuan Anda.
                            </p>
                        </div>

                        
                        <div className="p-5 bg-white/10 rounded-2xl border border-white/10 text-white">
                            <div className="flex items-center gap-2 mb-2 text-amber-400">
                                <Sparkles size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Inspirasi</span>
                            </div>
                            <p className="italic font-medium text-slate-200 text-sm leading-relaxed">
                                "Pendidikan adalah senjata paling ampuh yang bisa Anda gunakan untuk mengubah dunia."
                            </p>
                        </div>
                    </div>
                </div>

                
                
                <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
                    <div className="mb-8 text-center md:text-left">
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Masuk ke Akun</h3>
                        <p className="text-slate-500">Silakan masukkan email dan kata sandi Anda.</p>
                    </div>

                    {status && (
                        <div className="mb-6 font-semibold text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                            <CheckCircle2 size={18} className="shrink-0" /> {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`pl-11 w-full rounded-xl border ${errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'} bg-slate-50 focus:bg-white transition-colors py-3 px-4 text-sm font-medium outline-none`}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                />
                            </div>
                            {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
                        </div>

                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className={`pl-11 w-full rounded-xl border ${errors.password ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'} bg-slate-50 focus:bg-white transition-colors py-3 px-4 text-sm font-medium outline-none`}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.password}</p>}
                        </div>

                        
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500 w-4 h-4 cursor-pointer transition-colors"
                                />
                                <span className="ml-2 text-sm font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">Ingat Saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Lupa kata sandi?
                                </Link>
                            )}
                        </div>

                        
                        <div className="pt-4">
                            <button
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white py-3.5 px-4 rounded-xl font-bold transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Memverifikasi...' : 'Masuk Sekarang'}
                                {!processing && <LogIn size={18} />}
                            </button>
                        </div>

                        
                        <div className="text-center mt-6">
                            <p className="text-sm text-slate-500 font-medium">
                                Belum punya akun?{' '}
                                <Link href={route('register')} className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                    Daftar Gratis
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}