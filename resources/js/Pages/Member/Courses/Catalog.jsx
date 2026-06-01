import { useState, useEffect } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, X, CheckCircle2, ChevronRight, ShoppingBag, Sparkles, CreditCard, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function Catalog({ auth, courses }) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isMidtransLoading, setIsMidtransLoading] = useState(false);
    
    const { data, setData, post, processing, reset } = useForm({
        course_id: '',
        payment_method: 'midtrans', // Set default langsung ke midtrans gateway
        midtrans_order_id: '',
        midtrans_status: '',
    });

    // Memuat Script Snap Midtrans secara otomatis di background
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
        };
    }, []);

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    // ✅ Fungsi helper disesuaikan dengan skema harga_coret
    const getFinalPrice = (course) => {
        return course.harga_coret && Number(course.harga) > Number(course.harga_coret) ? course.harga_coret : course.harga;
    };

    const openModal = (course) => {
        setSelectedCourse(course);
        setData({
            course_id: course.id,
            payment_method: 'midtrans',
            midtrans_order_id: '',
            midtrans_status: '',
        });
    };

    const closeModal = () => {
        setSelectedCourse(null);
        reset();
    };

    // Fungsi pemicu utama popup Midtrans Snap
    const handleCatalogPayment = async (e) => {
        e.preventDefault();
        setIsMidtransLoading(true);

        // ✅ Pastikan amount yang dikirim ke Midtrans adalah harga final bulat (integer)
        const amountToPay = Math.round(Number(getFinalPrice(selectedCourse)));

        try {
            const response = await axios.post(route('payment.token'), {
                amount: amountToPay,
                name: auth.user.name,
                email: auth.user.email,
                // ✅ Tambahkan phone untuk melewati validasi backend
                phone: auth.user.phone || auth.user.no_hp || '080000000000' 
            });

            const snapToken = response.data.snap_token;
            const orderId = response.data.order_id;

            window.snap.pay(snapToken, {
                onSuccess: function(result) {
                    setData(prev => ({
                        ...prev,
                        midtrans_order_id: orderId,
                        midtrans_status: 'success'
                    }));
                },
                onPending: function(result) {
                    alert("Pembayaran pending. Silakan selesaikan pembayaran Anda.");
                    setIsMidtransLoading(false);
                },
                onError: function(result) {
                    alert("Pembayaran gagal. Silakan coba lagi.");
                    setIsMidtransLoading(false);
                },
                onClose: function() {
                    alert("Anda menutup halaman pendaftaran sebelum menyelesaikan pembayaran.");
                    setIsMidtransLoading(false);
                }
            });

        } catch (error) {
            console.error("Midtrans Error:", error);
            alert("Gagal menyiapkan gerbang pembayaran otomatis. Silakan hubungi admin.");
            setIsMidtransLoading(false);
        }
    };

    // Sinkronisasi Otomatis
    useEffect(() => {
        if (data.midtrans_status === 'success' && data.midtrans_order_id) {
            post(route('member.purchase'), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => setIsMidtransLoading(false)
            });
        }
    }, [data.midtrans_status, data.midtrans_order_id]);

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
                        
                        // ✅ Validasi jika kelas memiliki harga diskon yang valid
                        const hasDiscount = course.harga_coret && Number(course.harga) > Number(course.harga_coret);

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
                                    
                                    {hasDiscount && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="px-3 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                                                Promo Diskon
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute bottom-3 left-4 right-4 z-10">
                                        <h3 className="text-lg font-black text-white leading-snug line-clamp-2">
                                            {course.nama}
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="mb-5 flex flex-col border-b border-slate-100 pb-4">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Investasi Program</span>
                                        
                                        {/* ✅ Logika Tampilan Harga dengan desain sejajar menyamping */}
                                        {hasDiscount ? (
                                            <div className="flex items-end gap-2.5">
                                                <span className="text-3xl font-black text-rose-600 leading-none tracking-tight">
                                                    {formatRupiah(course.harga_coret)}
                                                </span>
                                                <span className="text-sm font-bold text-slate-400 line-through mb-0.5">
                                                    {formatRupiah(course.harga)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-black text-blue-950 leading-none tracking-tight">
                                                    {formatRupiah(course.harga)}
                                                </span>
                                            </div>
                                        )}
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
                            className="relative z-10 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100"
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
                                <h2 className="text-lg font-black text-blue-950 flex items-center gap-2">
                                    <CreditCard size={20} className="text-blue-600"/> Konfirmasi Pendaftaran
                                </h2>
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-rose-500 rounded-xl transition-colors">
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>

                            <form onSubmit={handleCatalogPayment} className="p-6 md:p-8 space-y-6">
                                {/* Panel Ringkasan Tagihan */}
                                <div className="p-6 bg-gradient-to-br from-blue-950 to-blue-900 rounded-2xl relative overflow-hidden text-white shadow-inner">
                                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Program yang Diikuti</p>
                                    <h4 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-tight">{selectedCourse.nama}</h4>
                                    
                                    <div className="border-t border-white/10 pt-4">
                                        <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">Total Biaya Investasi</p>
                                        
                                        {/* ✅ Tampilan Harga Modal Pembayaran */}
                                        {selectedCourse.harga_coret && Number(selectedCourse.harga) > Number(selectedCourse.harga_coret) ? (
                                            <div className="flex items-end gap-3">
                                                <p className="text-3xl font-black text-emerald-400 tracking-tight leading-none">
                                                    {formatRupiah(selectedCourse.harga_coret)}
                                                </p>
                                                <span className="text-sm font-bold text-slate-400 line-through mb-0.5">
                                                    {formatRupiah(selectedCourse.harga)}
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-3xl font-black text-white tracking-tight leading-none">
                                                {formatRupiah(selectedCourse.harga)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Informasi Sistem */}
                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                                    <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={18} />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-blue-950">Metode Pembayaran Instan (Midtrans)</p>
                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                            Mendukung scan QRIS otomatis, GoPay, ShopeePay, Virtual Account Bank Transfer, dll.
                                        </p>
                                    </div>
                                </div>

                                {/* Tombol Eksekusi Langsung Menembak Gateway */}
                                <button 
                                    type="submit" 
                                    disabled={processing || isMidtransLoading} 
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black disabled:opacity-50 disabled:bg-slate-300 flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/10 active:scale-[0.98] transition-all uppercase tracking-wider text-xs"
                                >
                                    {processing || isMidtransLoading ? 'Menghubungkan Server...' : 'Lanjut ke Pembayaran'}
                                    {!processing && !isMidtransLoading && <ArrowRight size={16} />}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MemberLayout>
    );
}