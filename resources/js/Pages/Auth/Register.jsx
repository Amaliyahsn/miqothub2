import { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    User, Mail, Lock, MapPin, Briefcase,
    ArrowLeft, CheckSquare, Sparkles, Phone,
    ArrowRight, LayoutGrid, CheckCircle2, ShieldCheck,
    CreditCard, Eye, EyeOff
} from 'lucide-react';

export default function Register({ courses }) {
    const { app_settings = {}, auth } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', 
        email: '', 
        alamat: '', 
        pekerjaan: '', 
        umur: '', 
        status: '',
        password: '', 
        password_confirmation: '',
        course_ids: [], 
        phone: '', 
        midtrans_order_id: '',
        midtrans_status: '',
    });

    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const midtransScriptUrl = "https://app.midtrans.com/snap/snap.js";
        const clientKey = "Mid-client-bV-Nc4CgcTvTgU24";

        const script = document.createElement('script');
        script.src = midtransScriptUrl;
        script.setAttribute('data-client-key', clientKey);
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
            reset('password', 'password_confirmation');
        };
    }, []);

    const toggleCourse = (id) => {
        let newCourseIds = [...data.course_ids];
        if (newCourseIds.includes(id)) {
            newCourseIds = newCourseIds.filter(courseId => courseId !== id);
        } else {
            newCourseIds.push(id);
        }
        setData('course_ids', newCourseIds);
    };

    const handleRegisterPayment = async (e) => {
        e.preventDefault();
        
        if (data.course_ids.length === 0) {
            alert("Silakan pilih minimal satu kelas terlebih dahulu.");
            return;
        }

        setIsPaymentLoading(true);

        try {
            // 1. Meminta token transaksi ke backend
            const response = await axios.post(route('payment.token'), {
                amount: totalPrice,
                name: data.name,
                email: data.email,
                phone: data.phone || '-'
            });

            const snapToken = response.data.snap_token;
            const orderId = response.data.order_id;

            // 2. Memunculkan Popup Snap Midtrans
            window.snap.pay(snapToken, {
                onSuccess: function(result) {
                    // Sinkronisasi data ke instansi useForm sebelum melakukan submit data flat
                    setData(data => ({
                        ...data,
                        midtrans_order_id: orderId,
                        midtrans_status: 'success'
                    }));

                    axios.post(route('register'), {
                        ...data,
                        midtrans_order_id: orderId,
                        midtrans_status: 'success'
                    })
                    .then(() => {
                        window.location.href = route('login');
                    })
                    .catch((err) => {
                        console.error(err);
                        alert("Gagal melakukan registrasi sistem database.");
                        setIsPaymentLoading(false);
                    });
                },
                onPending: function(result) {
                    alert("Pembayaran pending. Silakan selesaikan pembayaran Anda sesuai instruksi Midtrans.");
                    setIsPaymentLoading(false);
                },
                onError: function(result) {
                    alert("Pembayaran gagal. Silakan coba lagi.");
                    setIsPaymentLoading(false);
                },
                onClose: function() {
                    alert("Anda menutup halaman pembayaran sebelum menyelesaikannya.");
                    setIsPaymentLoading(false);
                }
            });

        } catch (error) {
            console.error("Midtrans Error:", error);
            alert("Gagal menyiapkan gerbang pembayaran. Pastikan data identitas diri telah terisi dengan benar.");
            setIsPaymentLoading(false);
        }
    };

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const activeCourses = courses.filter(course => !course.is_expired);
    const selectedCourses = courses.filter(c => data.course_ids.includes(c.id));
    const totalPrice = selectedCourses.reduce((sum, course) => sum + Number(course.harga_coret || 0), 0);

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white overflow-x-hidden font-sans">
            <Head title="Pendaftaran Kelas" />

            <div className="max-w-7xl mx-auto relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-10 font-semibold text-sm bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
                    <ArrowLeft size={18} /> Kembali ke Beranda
                </Link>

                <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.3 }} 
                    className="w-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row overflow-visible"
                >
                    {/* LEFT COLUMN: Course Selection & Payment Info */}
                    <div className="w-full md:w-[45%] bg-slate-900 p-6 sm:p-10 text-white flex flex-col relative shrink-0 md:rounded-l-[2rem] rounded-t-[2rem] md:rounded-tr-none">
                        <img 
                            src="/assets/images/bg-login.jpg" 
                            className="absolute inset-0 w-full h-full object-cover opacity-[0.08] blur-sm pointer-events-none"
                            alt="Background" 
                        />
                        
                        <div className="relative z-10 mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-6 text-white shadow-md">
                                <LayoutGrid size={24} strokeWidth={2.5}/>
                            </div>
                            <h2 className="text-3xl font-black mb-3 leading-tight">Pilih Program &<br/>Pembayaran</h2>
                            <p className="text-slate-400 text-sm font-medium">Klik pada kartu kelas untuk memilih.</p>
                        </div>

                        <div className="relative z-10 space-y-4 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Kelas Tersedia ({activeCourses.length})</h3>
                                <div className="md:hidden flex items-center gap-1 text-blue-400 text-[10px] font-bold animate-pulse">
                                    <span>Geser</span> <ArrowRight size={12} />
                                </div>
                            </div>

                            {activeCourses.length === 0 ? (
                                <div className="p-10 bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-700 text-center">
                                    <ShieldCheck size={40} className="mx-auto text-slate-600 mb-3" />
                                    <p className="text-sm font-medium text-slate-500">Belum ada kelas yang dibuka.</p>
                                </div>
                            ) : (
                                <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-4 pb-4 md:pb-0 snap-x scrollbar-hide">
                                    {activeCourses.map(course => (
                                        <motion.div 
                                            key={course.id} 
                                            onClick={() => toggleCourse(course.id)}
                                            className={`min-w-[80vw] md:min-w-full snap-center p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 group ${data.course_ids.includes(course.id) ? 'bg-slate-800 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-500'}`}
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <h3 className={`font-bold text-sm sm:text-base leading-tight flex-1 transition-colors ${data.course_ids.includes(course.id) ? 'text-blue-400' : 'text-white'}`}>
                                                    {course.nama}
                                                </h3>
                                                <div className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${data.course_ids.includes(course.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-600 text-transparent'}`}>
                                                    <CheckSquare size={16} strokeWidth={3} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/50">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Batch {course.batch}</span>
                                                <span className="font-black text-white">{formatRupiah(course.harga_coret)}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {data.course_ids.length > 0 && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative z-10 pt-6 mt-2 space-y-4">
                                <div className="p-5 rounded-2xl bg-white text-slate-900 flex justify-between items-center shadow-xl">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Total Bayar</p>
                                        <p className="text-2xl font-black text-blue-600">{formatRupiah(totalPrice)}</p>
                                    </div>
                                    <Sparkles className="text-amber-500" size={28} />
                                </div>
                                
                                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                                    <CreditCard className="text-blue-400 shrink-0 mt-0.5" size={18} />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-200">Metode Pembayaran Otomatis</p>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            Pembayaran aman instan via Midtrans (Transfer VA, QRIS, Gopay, dll).
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="mt-auto pt-10 text-center border-t border-slate-800/50">
                            <p className="text-xs font-medium text-slate-400 mb-3">Butuh bantuan pendaftaran?</p>
                            {(() => {
                                const message = `Halo Admin MiqotHub, saya ingin bertanya mengenai pendaftaran kelas: ${selectedCourses.map(c => c.nama).join(', ') || '...'}.`;
                                const whatsappUrl = `https://wa.me/${app_settings.wa_admin || ''}?text=${encodeURIComponent(message)}`;
                                
                                return (
                                    <a 
                                        href={whatsappUrl} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-emerald-600 rounded-full text-white font-semibold text-[11px] sm:text-xs transition-all duration-300 border border-slate-700 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                                    >
                                        <Phone size={14} className="animate-pulse" /> 
                                        <span>Chat Admin (WhatsApp)</span>
                                    </a>
                                );
                            })()}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: User Identity Form */}
                    <div className="w-full md:w-[55%] p-8 sm:p-12 bg-white">
                        <div className="mb-10">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Identitas Diri</h3>
                            <p className="text-slate-500 text-sm">Pastikan data sudah benar.</p>
                        </div>

                        <form onSubmit={handleRegisterPayment} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
                                <div className="relative">
                                    <User size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-3.5 text-sm font-bold outline-none transition-all" placeholder="Nama Lengkap Sesuai KTP" required />
                                </div>
                                {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.name}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Aktif</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-3.5 text-sm font-bold outline-none transition-all" placeholder="email@anda.com" required />
                                </div>
                                {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.email}</p>}
                            </div>

                            {/* 🔥 PENAMBAHAN INPUT FIELD PHONE AGAR SELARAS DENGAN KONTROLER */}
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nomor WhatsApp / HP</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                    <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-3.5 text-sm font-bold outline-none transition-all" placeholder="08xxxxxxxxxx" required />
                                </div>
                                {errors.phone && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.phone}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Alamat Domisili</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                    <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="3" className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-3.5 text-sm font-bold outline-none transition-all resize-none" placeholder="Alamat Lengkap..." required></textarea>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pekerjaan</label>
                                <div className="relative">
                                    <Briefcase size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                    <input type="text" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-3.5 text-sm font-bold outline-none transition-all" placeholder="Cth: Guru" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Umur</label>
                                    <input type="number" value={data.umur} onChange={e => setData('umur', e.target.value ? parseInt(e.target.value) : '')} className="w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3.5 text-sm font-bold text-center outline-none transition-all" placeholder="25" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3.5 text-sm font-bold outline-none transition-all cursor-pointer px-3" required>
                                        <option value="" disabled>Pilih...</option>
                                        <option value="menikah">Menikah</option>
                                        <option value="belum">Belum Menikah</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                        <input
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                className="pl-12 pr-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3.5 text-sm font-bold outline-none transition-all"
                                                placeholder="••••••••"
                                                required
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Konfirmasi</label>
                                    <div className="relative">
                                        <CheckCircle2 size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                        <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={data.password_confirmation}
                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                className="pl-12 pr-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3.5 text-sm font-bold outline-none transition-all"
                                                placeholder="••••••••"
                                                required
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing || isPaymentLoading || data.course_ids.length === 0}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {processing || isPaymentLoading ? 'Memproses Gateway...' : (
                                        <><span>Daftar Sekarang</span> <ArrowRight size={18} /></>
                                    )}
                                </button>

                                {data.course_ids.length === 0 && (
                                    <p className="text-center text-rose-500 text-[10px] font-bold mt-4">
                                        Silakan pilih minimal satu kelas di kolom kiri
                                    </p>
                                )}

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-slate-500">
                                        Sudah punya akun?{' '}
                                        <Link
                                            href={route('login')}
                                            className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}