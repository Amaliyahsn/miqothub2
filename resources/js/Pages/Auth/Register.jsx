import { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Lock, MapPin, Briefcase, Heart, UserPlus, 
    ArrowLeft, Upload, CheckSquare, Receipt, CalendarDays, BookOpen, Sparkles, Phone, ChevronDown, Copy, Check
} from 'lucide-react';

export default function Register({ courses }) {
    const { app_settings = {} } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', alamat: '', pekerjaan: '', umur: '', status: '',
        password: '', password_confirmation: '',
        course_ids: [], 
        bukti_pembayaran: null,
    });

    const [preview, setPreview] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [copied, setCopied] = useState(false);

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
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} 
                    className="w-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row overflow-visible"
                >
                    <div className="w-full md:w-[42%] bg-slate-900 p-8 sm:p-10 lg:p-12 text-white flex flex-col relative shrink-0 md:rounded-l-[2rem] rounded-t-[2rem] md:rounded-tr-none">
                        <img 
                            src="/assets/images/bg-login.jpg" 
                            className="absolute inset-0 w-full h-full object-cover opacity-[0.12] blur-md scale-105 pointer-events-none"
                            alt="Background" 
                        />
                        
                        <div className="mb-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-6 text-white shadow-md">
                                <BookOpen size={24} strokeWidth={2.5}/>
                            </div>
                            <h2 className="text-3xl font-black mb-3 text-white leading-tight">Pilih Program &<br/>Metode Bayar</h2>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">Tentukan kelas yang ingin diikuti, lalu lakukan pembayaran sesuai instruksi di bawah.</p>
                        </div>

                        <div className="space-y-4 mb-12">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Kelas Tersedia ({courses.length})</h3>
                            {courses.length === 0 ? (
                                <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 text-center">
                                    <p className="text-sm font-medium text-slate-400">Mohon maaf, saat ini belum ada kelas yang dibuka.</p>
                                </div>
                            ) : (
                                courses.map(course => (
                                    <div 
                                        key={course.id} 
                                        onClick={() => toggleCourse(course.id)}
                                        className={`p-5 rounded-2xl cursor-pointer border-2 transition-all duration-200 group ${data.course_ids.includes(course.id) ? 'bg-slate-800 border-blue-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}`}
                                    >
                                        <div className="flex justify-between items-start mb-3 gap-3">
                                            <h3 className="font-bold text-base leading-tight flex-1 text-white group-hover:text-blue-400 transition-colors">{course.nama}</h3>
                                            <div className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors mt-0.5 ${data.course_ids.includes(course.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-500 text-transparent'}`}>
                                                <CheckSquare size={16} strokeWidth={3} />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-700">
                                            <span className="px-2 py-1 rounded-md bg-slate-900 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Batch {course.batch}</span>
                                            <div className="font-black text-lg text-white">{formatRupiah(course.harga)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {data.course_ids.length > 0 && (
                            <div className="shrink-0 space-y-6 pt-10 mt-10 border-t border-slate-800">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Instruksi Pembayaran</h3>
                                
                                <div className="p-6 rounded-2xl bg-white text-slate-900 flex justify-between items-center shadow-sm">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Transfer</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl font-black text-blue-600 leading-none">{formatRupiah(totalPrice)}</p>
                                            <button 
                                                type="button"
                                                onClick={() => handleCopy(totalPrice)}
                                                className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-blue-600"
                                                title="Salin nominal"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <Sparkles className="text-amber-500" size={28} />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Pilih Metode Pembayaran:</label>
                                    <div className="relative group">
    {/* Label kecil di atas dropdown untuk kejelasan */}
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
        Pilih Metode Pembayaran
    </label>
    
    <div className="relative">
        <select 
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full bg-slate-800/50 border-2 border-slate-700 text-white rounded-2xl py-3.5 pl-5 pr-12 text-sm font-bold appearance-none cursor-pointer transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none sm:text-base"
        >
            <option value="" className="bg-slate-900">-- Pilih Metode Transfer --</option>
            {app_settings.bank1_active === '1' && (
                <option value="bank1" className="bg-slate-900">{app_settings.bank1_name}</option>
            )}
            {app_settings.bank2_active === '1' && (
                <option value="bank2" className="bg-slate-900">{app_settings.bank2_name}</option>
            )}
            {app_settings.qris_active === '1' && (
                <option value="qris" className="bg-slate-900">QRIS </option>
            )}
        </select>
        
        {/* Icon Chevron yang lebih responsif posisinya */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-hover:text-white transition-colors">
            <ChevronDown size={20} strokeWidth={2.5} />
        </div>
    </div>

    {/* Info tambahan tipis di bawah dropdown */}
    {!selectedMethod && (
        <p className="mt-2 ml-1 text-[11px] text-slate-500 italic">
            *Pilih salah satu untuk melihat nomor rekening
        </p>
    )}
</div>

                                    {(selectedMethod === 'bank1' || selectedMethod === 'bank2') && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-slate-800 border border-blue-500/50 flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-900 rounded-lg text-blue-400"><Receipt size={18}/></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {selectedMethod === 'bank1' ? app_settings.bank1_name : app_settings.bank2_name}
                                                        </p>
                                                        <p className="text-base font-black text-white tracking-wider">
                                                            {selectedMethod === 'bank1' ? app_settings.bank1_number : app_settings.bank2_number}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleCopy(selectedMethod === 'bank1' ? app_settings.bank1_number : app_settings.bank2_number)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                                                >
                                                    {copied ? <><Check size={12}/> Tersalin!</> : <><Copy size={12}/> Salin No. Rek</>}
                                                </button>
                                            </div>
                                            <p className="text-[11px] font-medium text-slate-400 border-t border-slate-700 pt-2">
                                                Atas Nama: <span className="text-white uppercase">{selectedMethod === 'bank1' ? app_settings.bank1_owner : app_settings.bank2_owner}</span>
                                            </p>
                                        </motion.div>
                                    )}

                                    {selectedMethod === 'qris' && app_settings.qris_path && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-2xl bg-white flex flex-col items-center gap-3">
                                            <img src={`/storage/${app_settings.qris_path}`} alt="QRIS" className="w-full max-w-[180px] h-auto" />
                                            <p className="text-[10px] font-bold text-slate-500 uppercase text-center italic">Scan QRIS melalui M-Banking / E-Wallet</p>
                                        </motion.div>
                                    )}
                                </div>

                                {selectedMethod && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                            <Upload size={16} className="text-blue-400"/> Unggah Bukti Transfer (Wajib)
                                        </label>
                                        <div className="relative w-full h-32 rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800/50 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-400 transition-colors cursor-pointer">
                                            {preview ? (
                                                <img src={preview} alt="Preview Bukti" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <Upload className="mx-auto text-slate-400 mb-2 group-hover:text-blue-400 transition-colors" size={24} />
                                                    <p className="text-xs font-medium text-slate-400">Klik untuk pilih foto struk</p>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
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

                    <div className="w-full md:w-[58%] p-8 sm:p-12 lg:p-16 flex flex-col bg-white overflow-visible">
                        <div className="mb-10 shrink-0">
                            <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">Lengkapi<br/>Identitas Diri</h3>
                            <p className="text-slate-500 text-sm font-medium">Data ini digunakan untuk keperluan administrasi kelas dan pencetakan e-sertifikat Anda.</p>
                        </div>

                        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap (Sesuai KTP)</label>
                                <div className="relative">
                                    <User size={18} className="absolute top-[12px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 text-sm font-medium outline-none transition-colors" placeholder="Contoh: Ahmad Fulan" required />
                                </div>
                                {errors.name && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.name}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Aktif</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute top-[12px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 text-sm font-medium outline-none transition-colors" placeholder="email@anda.com" required />
                                </div>
                                {errors.email && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.email}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Domisili Lengkap</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute top-[12px] left-4 text-slate-400 pointer-events-none" />
                                    <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="3" className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 text-sm font-medium outline-none transition-colors resize-none" placeholder="Nama Jalan, No. Rumah, RT/RW, Kota/Kabupaten..." required></textarea>
                                </div>
                                {errors.alamat && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.alamat}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pekerjaan</label>
                                <div className="relative">
                                    <Briefcase size={18} className="absolute top-[12px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="text" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 text-sm font-medium outline-none transition-colors" placeholder="Cth: Karyawan Swasta" required />
                                </div>
                                {errors.pekerjaan && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.pekerjaan}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Umur</label>
                                    <div className="relative">
                                        <CalendarDays size={18} className="absolute top-[12px] left-4 text-slate-400 pointer-events-none" />
                                        <input type="number" value={data.umur} onChange={e => setData('umur', e.target.value)} className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 text-sm font-medium outline-none transition-colors" placeholder="25" required />
                                    </div>
                                    {errors.umur && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.umur}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status Kawin</label>
                                    <div className="relative">
                                        <Heart size={18} className="absolute top-[12px] left-4 text-slate-400 pointer-events-none" />
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 text-sm font-semibold appearance-none cursor-pointer outline-none transition-colors" required>
                                            <option value="" disabled>Pilih...</option>
                                            <option value="menikah">Menikah</option>
                                            <option value="belum">Belum Menikah</option>
                                        </select>
                                    </div>
                                    {errors.status && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="sm:col-span-2 border-t border-slate-100 my-2"></div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Akun</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute top-[12px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 text-sm font-medium outline-none transition-colors" placeholder="Minimal 8 karakter" required />
                                </div>
                                {errors.password && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Konfirmasi Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute top-[12px] left-4 text-slate-400 pointer-events-none" />
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="pl-11 w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 py-3 text-sm font-medium outline-none transition-colors" placeholder="Ketik ulang password" required />
                                </div>
                            </div>

                            <div className="sm:col-span-2 mt-6 pt-6 border-t border-slate-100">
                                <button 
                                    disabled={processing || data.course_ids.length === 0 || !data.bukti_pembayaran} 
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <> <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sedang Memproses... </>
                                    ) : (
                                        <>Daftar & Kirim Pembayaran <UserPlus size={18} /></>
                                    )}
                                </button>
                                <p className="text-center text-sm font-medium text-slate-500 mt-5">
                                    Sudah punya akun?{' '}
                                    <Link href={route('login')} className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                        Masuk di sini
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}