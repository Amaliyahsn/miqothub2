import { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Lock, MapPin, Briefcase, Heart, 
    ArrowLeft, Upload, CheckSquare, Receipt, CalendarDays, 
    Sparkles, Phone, ChevronDown, Copy, Check, ArrowRight, 
    LayoutGrid, CheckCircle2, ShieldCheck
} from 'lucide-react';

export default function Register({ courses }) {
    const { app_settings = {}, auth } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', alamat: '', pekerjaan: '', umur: null, status: '',
        password: '', password_confirmation: '',
        course_ids: [], 
        bukti_pembayaran: null,
    });

    const [preview, setPreview] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [copied, setCopied] = useState(false);

    // Animasi Variants
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('bukti_pembayaran', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const toggleCourse = (id) => {
        let newCourseIds = [...data.course_ids];
        if (newCourseIds.includes(id)) {
            newCourseIds = newCourseIds.filter(courseId => courseId !== id);
        } else {
            newCourseIds.push(id);
        }
        setData('course_ids', newCourseIds);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { forceFormData: true, preserveScroll: true }); 
    };

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const activeCourses = courses.filter(course => !course.is_expired);
    const selectedCourses = courses.filter(c => data.course_ids.includes(c.id));
    const totalPrice = selectedCourses.reduce((sum, course) => sum + course.harga, 0);

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
                    {/* LEFT COLUMN: Course Selection & Payment */}
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

                        {/* LOGIKA FILTER & RESPONSIVE GRID/SCROLL */}
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
                                                <span className="font-black text-white">{formatRupiah(course.harga)}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Section - Only shows if course selected */}
                        {data.course_ids.length > 0 && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative z-10 pt-6 mt-6 border-t border-slate-800 space-y-6">
                                <div className="p-5 rounded-2xl bg-white text-slate-900 flex justify-between items-center shadow-xl">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Total Bayar</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl font-black text-blue-600">{formatRupiah(totalPrice)}</p>
                                            <button type="button" onClick={() => handleCopy(totalPrice)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-blue-600 transition-colors">
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <Sparkles className="text-amber-500" size={28} />
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Metode Pembayaran</label>
                                        <div className="relative">
                                            <select 
                                                value={selectedMethod}
                                                onChange={(e) => setSelectedMethod(e.target.value)}
                                                className="w-full bg-slate-800/50 border-2 border-slate-700 text-white rounded-2xl py-3.5 pl-5 pr-12 text-sm font-bold appearance-none cursor-pointer focus:border-blue-500 outline-none transition-all"
                                            >
                                                <option value="">-- Pilih Rekening --</option>
                                                {app_settings.bank1_active === '1' && <option value="bank1">{app_settings.bank1_name}</option>}
                                                {app_settings.bank2_active === '1' && <option value="bank2">{app_settings.bank2_name}</option>}
                                                {app_settings.qris_active === '1' && <option value="qris">QRIS (Otomatis)</option>}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
                                                <ChevronDown size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {(selectedMethod === 'bank1' || selectedMethod === 'bank2') && (
                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-slate-800 border border-blue-500/30">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedMethod === 'bank1' ? app_settings.bank1_name : app_settings.bank2_name}</span>
                                                <button onClick={() => handleCopy(selectedMethod === 'bank1' ? app_settings.bank1_number : app_settings.bank2_number)} className="text-[10px] font-bold text-blue-400 hover:text-blue-300">Salin</button>
                                            </div>
                                            <p className="text-lg font-black text-white tracking-widest mb-1">{selectedMethod === 'bank1' ? app_settings.bank1_number : app_settings.bank2_number}</p>
                                            <p className="text-[11px] text-slate-400">A.N: <span className="text-white uppercase">{selectedMethod === 'bank1' ? app_settings.bank1_owner : app_settings.bank2_owner}</span></p>
                                        </motion.div>
                                    )}

                                    {selectedMethod === 'qris' && app_settings.qris_path && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-white flex flex-col items-center">
                                            <img src={`/storage/${app_settings.qris_path}`} alt="QRIS" className="w-32 h-auto mb-2" />
                                            <p className="text-[10px] font-bold text-slate-400">SCAN UNTUK BAYAR</p>
                                        </motion.div>
                                    )}

                                    {selectedMethod && (
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-white flex items-center gap-2">
                                                <Upload size={14} className="text-blue-400"/> Unggah Bukti Transfer
                                            </label>
                                            <div className="relative w-full h-28 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-500 transition-all cursor-pointer">
                                                {preview ? (
                                                    <img src={preview} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-center">
                                                        <Upload className="mx-auto text-slate-600 mb-1" size={20} />
                                                        <p className="text-[10px] text-slate-500">Klik untuk upload struk</p>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
<div className="mt-auto pt-10 text-center border-t border-slate-800/50 mt-8">
    <p className="text-xs font-medium text-slate-400 mb-3">Butuh bantuan pendaftaran?</p>
    
    {/* Membuat pesan otomatis yang dinamis */}
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
                            <h3 className="text-3xl font-black text-slate-900 mb-2">Identitas Diri</h3>
                            <p className="text-slate-500 text-sm">Pastikan data sesuai untuk keperluan e-sertifikat.</p>
                        </div>

                        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                        <option value="belum">Belum</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                        <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3.5 text-sm font-bold outline-none transition-all" placeholder="••••••••" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Konfirmasi</label>
                                    <div className="relative">
                                        <CheckCircle2 size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                        <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="pl-12 w-full rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3.5 text-sm font-bold outline-none transition-all" placeholder="••••••••" required />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing || data.course_ids.length === 0 || !selectedMethod || !data.bukti_pembayaran}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {processing ? 'Memproses...' : (
                                        <><span>Daftar Sekarang</span> <ArrowRight size={18} /></>
                                    )}
                                </button>
                                {data.course_ids.length === 0 && <p className="text-center text-[10px] font-bold text-rose-500 mt-4">Silakan pilih minimal satu kelas di kolom kiri</p>}
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}