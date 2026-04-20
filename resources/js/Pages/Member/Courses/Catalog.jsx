import { useState, useEffect } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Upload, X, CheckCircle2, ChevronRight, Receipt, ShoppingBag, Sparkles, CreditCard, Landmark, Copy, ChevronDown, Check } from 'lucide-react';

export default function Catalog({ auth, courses }) {
    // Mengambil settings dari props (Inertia)
    const { app_settings } = usePage().props;

    // Fallback data jika di database/backend belum diisi
    const settings = {
        bank1_name: app_settings?.bank1_name || "BANK MANDIRI",
        bank1_owner: app_settings?.bank1_owner || "PT MIQOTHUB DIGITAL",
        bank1_number: app_settings?.bank1_number || "1234567890",
        bank1_active: app_settings?.bank1_active ?? true,

        bank2_name: app_settings?.bank2_name || "BANK BCA",
        bank2_owner: app_settings?.bank2_owner || "PT MIQOTHUB DIGITAL",
        bank2_number: app_settings?.bank2_number || "0987654321",
        bank2_active: app_settings?.bank2_active ?? true,
        
        // Perbaikan: Mengambil dari storage jika ada, jika tidak pakai placeholder
        qris_path: app_settings?.qris_image ? `/storage/${app_settings.qris_image}` : null 
    };

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [preview, setPreview] = useState(null);
    const [copied, setCopied] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: '',
        payment_method: '',
        bukti_pembayaran: null,
    });

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    const openModal = (course) => {
        setSelectedCourse(course);
        setData({
            course_id: course.id,
            payment_method: '',
            bukti_pembayaran: null
        });
        setPreview(null);
    };

    const closeModal = () => {
        if (preview) URL.revokeObjectURL(preview);
        setSelectedCourse(null);
        setPreview(null);
        reset();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (preview) URL.revokeObjectURL(preview);
        setData('bukti_pembayaran', file);
        setPreview(URL.createObjectURL(file));
    };

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('member.purchase'), {
            onSuccess: () => closeModal(),
        });
    };

    // Pengecekan status bank yang lebih aman
    const isBankActive = (status) => status === true || status === 'true' || status === 1 || status === '1';

    return (
        <MemberLayout user={auth.user}>
            <Head title="Katalog Kelas" />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
                    <ShoppingBag size={24} className="text-blue-600" /> Katalog Program Kelas
                </h1>
                <p className="text-slate-500 mt-1.5 text-sm font-semibold">
                    Berinvestasi pada ilmu. Pilih program bimbingan terbaik untuk persiapan ibadah Anda.
                </p>
            </div>

            {courses.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-16 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10">
                        <Sparkles size={40} className="text-blue-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 relative z-10">Katalog Sedang Kosong</h3>
                    <p className="text-slate-500 mt-2 max-w-md text-sm font-medium relative z-10">
                        Anda mungkin sudah mengikuti semua kelas yang tersedia.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                    {courses.map((course, index) => {
                        const features = Array.isArray(course.fitur) ? course.fitur : 
                                         (typeof course.fitur === 'string' ? JSON.parse(course.fitur || '[]') : []);

                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: index * 0.1 }}
                                key={course.id} 
                                className="bg-white rounded-[1.5rem] p-2 shadow-sm border border-slate-200 flex flex-col hover:shadow-2xl hover:shadow-blue-950/10 hover:-translate-y-1.5 transition-all duration-500 group"
                            >
                                <div className="relative h-44 rounded-t-[1.25rem] rounded-b-xl overflow-hidden bg-slate-100">
                                    {course.thumbnail_url ? (
                                        <img src={course.thumbnail_url} alt={course.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                            <Layout size={48} strokeWidth={1} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="px-3 py-1.5 bg-white/95 text-blue-950 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                                            Batch {course.batch}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 left-4 right-4 z-10">
                                        <h3 className="text-lg font-black text-white leading-snug line-clamp-2">
                                            {course.nama}
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="mb-5 flex items-end gap-2 border-b border-slate-100 pb-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Investasi Program</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-black text-blue-950 leading-none tracking-tight">
                                                    {formatRupiah(course.harga)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6 flex-1">
                                        <p className="text-xs font-bold text-slate-800 mb-3">Benefit:</p>
                                        <ul className="space-y-2.5">
                                            {features.slice(0, 4).map((fitur, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                                                    <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                                                    <span className="leading-snug">{fitur}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <button 
                                        onClick={() => openModal(course)} 
                                        className="mt-auto w-full py-3.5 bg-slate-50 text-blue-950 border border-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-950 hover:text-white transition-all active:scale-95"
                                    >
                                        Daftar Sekarang <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

           <AnimatePresence>
    {selectedCourse && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={closeModal} 
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" 
            />
            
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                className="relative z-10 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 max-h-[90vh]"
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
                    <h2 className="text-lg font-black text-blue-950 flex items-center gap-2">
                        <CreditCard size={20} className="text-blue-600"/> Checkout Kelas
                    </h2>
                    <button onClick={closeModal} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-colors">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    {/* Panel Pembayaran */}
                    <div className="p-6 bg-gradient-to-br from-blue-950 to-blue-900 rounded-2xl relative overflow-hidden text-white shadow-inner">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1.5">Total Tagihan</p>
                            <p className="text-3xl font-black text-white mb-6 tracking-tight">
                                {formatRupiah(selectedCourse.harga)}
                            </p>
                            
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-blue-200 uppercase tracking-tighter">Pilih Metode Pembayaran:</label>
                                <div className="relative">
                                    <select 
                                        value={data.payment_method} 
                                        onChange={e => setData('payment_method', e.target.value)}
                                        className="w-full p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer text-sm font-medium appearance-none"
                                        required
                                    >
                                        <option value="" className="text-slate-900">-- Pilih Pembayaran --</option>
                                        
                                        {/* Logika: Hanya muncul jika status di settings adalah '1' */}
                                        {settings?.bank1_active === '1' && (
                                            <option value="bank1" className="text-slate-900">{settings.bank1_name}</option>
                                        )}
                                        
                                        {settings?.bank2_active === '1' && (
                                            <option value="bank2" className="text-slate-900">{settings.bank2_name}</option>
                                        )}
                                        
                                        {settings?.qris_active === '1' && (
                                            <option value="qris" className="text-slate-900">QRIS (Otomatis)</option>
                                        )}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-blue-200">
                                        <ChevronDown size={18} />
                                    </div>
                                </div>

                                {/* Detail Rekening (Muncul secara animasi saat dipilih) */}
                                <AnimatePresence mode="wait">
                                    {(data.payment_method === 'bank1' || data.payment_method === 'bank2') && (
                                        <motion.div 
                                            key={data.payment_method}
                                            initial={{ opacity: 0, y: 10 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center gap-3.5 mt-2"
                                        >
                                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white shrink-0">
                                                <Landmark size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-blue-200 uppercase">
                                                    {data.payment_method === 'bank1' ? settings.bank1_name : settings.bank2_name}
                                                </p>
                                                <p className="text-lg font-black text-white font-mono tracking-widest leading-none my-1">
                                                    {data.payment_method === 'bank1' ? settings.bank1_number : settings.bank2_number}
                                                </p>
                                                <p className="text-[11px] font-medium text-blue-100 truncate">
                                                    a.n. {data.payment_method === 'bank1' ? settings.bank1_owner : settings.bank2_owner}
                                                </p>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => copyToClipboard(data.payment_method === 'bank1' ? settings.bank1_number : settings.bank2_number)} 
                                                className="p-2 bg-white/10 hover:bg-white/30 rounded-lg transition-colors text-white shrink-0"
                                            >
                                                {copied ? <Check size={18} className="text-emerald-400"/> : <Copy size={18}/>}
                                            </button>
                                        </motion.div>
                                    )}

                                    {data.payment_method === 'qris' && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }} 
                                            animate={{ opacity: 1, scale: 1 }} 
                                            exit={{ opacity: 0 }}
                                            className="bg-white text-center p-4 rounded-xl mt-2 shadow-inner"
                                        >
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Scan Kode QRIS</p>
                                            {settings.qris_path ? (
                                                <img src={`/storage/${settings.qris_path}`} alt="QRIS" className="mx-auto w-40 h-40 rounded-lg border border-slate-200 object-contain" />
                                            ) : (
                                                <div className="w-32 h-32 bg-slate-100 mx-auto flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300">
                                                    <Layout className="text-slate-300" size={32} />
                                                    <p className="text-[9px] text-slate-400 px-2 mt-1">QRIS Belum Diunggah</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-700 flex items-center gap-2">
                            <Receipt size={16} className="text-blue-600"/> Bukti Transfer
                        </label>
                        <div className="relative w-full h-40 rounded-[1.25rem] border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-500 transition-all cursor-pointer">
                            {preview ? (
                                <div className="relative w-full h-full">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-xs font-bold bg-blue-600 px-4 py-2 rounded-full">Ganti Foto</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <Upload size={24} className="mx-auto mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                    <p className="text-xs text-slate-500 font-bold">Upload struk pembayaran</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing || !data.bukti_pembayaran || !data.payment_method} 
                        className="w-full py-4 bg-blue-950 text-white rounded-2xl font-black disabled:opacity-50 disabled:bg-slate-300 flex items-center justify-center gap-2.5 shadow-xl active:scale-[0.98] transition-all"
                    >
                        {processing ? 'Memproses...' : 'Kirim Konfirmasi'}
                        {!processing && <CheckCircle2 size={18} />}
                    </button>
                </form>
            </motion.div>
        </div>
    )}
</AnimatePresence>
        </MemberLayout>
    );
}