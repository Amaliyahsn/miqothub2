import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Settings, Phone, CheckCircle2, BarChart3, ShieldCheck, FileText } from 'lucide-react';

export default function Index({ auth, settings }) {
    const { flash = {} } = usePage().props;

    const { data, setData, post, processing } = useForm({
        wa_admin: settings?.wa_admin || '',
        hero_description: settings?.hero_description || '',
        // --- Statistik Dinamis ---
        stat1_value: settings?.stat1_value || '',
        stat1_label: settings?.stat1_label || '',
        stat2_value: settings?.stat2_value || '',
        stat2_label: settings?.stat2_label || '',
        stat3_value: settings?.stat3_value || '',
        stat3_label: settings?.stat3_label || '',
        stat4_value: settings?.stat4_value || '',
        stat4_label: settings?.stat4_label || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), { 
            preserveScroll: true,
            forceFormData: true 
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Pengaturan Sistem" />

            {/* Header Title Section - Adaptif Mobile */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 sm:gap-3">
                    <div className="p-2 bg-blue-50 text-blue-900 rounded-xl shrink-0">
                        <Settings size={24} sm={28} strokeWidth={2.5} />
                    </div>
                    Pengaturan Sistem
                </h1>
                <p className="text-slate-500 mt-2 font-semibold text-xs sm:text-sm">Kelola kontak, konten teks, dan statistik utama landing page.</p>
            </div>

            {/* Flash Message */}
            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl font-bold flex items-center gap-3 text-xs sm:text-sm shadow-sm">
                        <div className="bg-emerald-500 text-white p-1 rounded-full shrink-0"><CheckCircle2 size={12} sm={14} /></div> 
                        <span>{flash.success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={submit} className="space-y-4 sm:space-y-6 pb-20">
                
                {/* 🔥 LINK REKOMENDASI BARU: STATUS GATEWAY MIDTRANS (PENGGANTI REKENING MANUAL) */}
                <div className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-70 pointer-events-none"></div>
                    
                    <div className="flex items-start gap-3 sm:gap-4 pb-4 border-b border-purple-50 relative z-10">
                        <div className="p-2.5 sm:p-3 bg-purple-900 text-white rounded-xl shadow-md shrink-0">
                            <ShieldCheck size={20} sm={24} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight">Integrasi Payment Gateway</h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Sistem pembayaran otomatis yang terhubung ke Midtrans.</p>
                        </div>
                    </div>
            
                </div>

                {/* SECTION 1: WHATSAPP & HERO TEXT */}
                <div className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-200 space-y-5 sm:space-y-6">
                    <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-slate-100">
                        <div className="p-2.5 sm:p-3 bg-blue-900 text-white rounded-xl shadow-md shrink-0">
                            <Phone size={20} sm={24} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight">Kontak & Konten Utama</h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Atur nomor CS rujukan dan teks utama landing page.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-5">
                        <div className="w-full md:max-w-md">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nomor WhatsApp Admin</label>
                            <input type="text" value={data.wa_admin} onChange={e => setData('wa_admin', e.target.value)} placeholder="Contoh: 6281234567890" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold text-xs sm:text-sm outline-none transition-all shadow-inner" />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FileText size={12}/> Deskripsi Hero (Landing Page)</label>
                            <textarea 
                                value={data.hero_description} 
                                onChange={e => setData('hero_description', e.target.value)} 
                                rows="3"
                                placeholder="Materi disusun sederhana agar mudah dipahami jamaah..." 
                                className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-medium text-xs sm:text-sm outline-none transition-all shadow-inner resize-none leading-relaxed"
                            />
                        </div>
                    </div>
                </div>  

                {/* SECTION 2: STATISTIK (Dinamis Grid Laptop/HP) */}
                <div className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-100">
                        <div className="p-2.5 sm:p-3 bg-indigo-600 text-white rounded-xl shadow-md shrink-0">
                            <BarChart3 size={20} sm={24} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight">Statistik Landing Page</h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Atur 4 poin jumlah/statistik pencapaian utama.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 shadow-inner">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Kotak Data {i}</span>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Angka / Nilai (Value)</label>
                                    <input type="text" value={data[`stat${i}_value`]} onChange={e => setData(`stat${i}_value`, e.target.value)} placeholder="Misal: 8K+ atau 100%" className="w-full rounded-xl border-slate-200 py-2.5 px-3 font-black text-xs sm:text-sm outline-none focus:border-indigo-500 transition-all bg-white shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Keterangan (Label)</label>
                                    <textarea rows="2" value={data[`stat${i}_label`]} onChange={e => setData(`stat${i}_label`, e.target.value)} placeholder="Misal: Alumni Lolos Ujian" className="w-full rounded-xl border-slate-200 py-2 px-3 font-semibold text-[11px] sm:text-xs outline-none focus:border-indigo-500 transition-all bg-white shadow-sm resize-none leading-normal" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sticky Simpan Panel Bottom khusus Mobile Jari Layar */}
                <div className="flex justify-end pt-2 sm:pt-4">
                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 active:scale-95 disabled:opacity-70 text-xs sm:text-sm uppercase tracking-wider w-full sm:w-auto"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} sm={18} />
                                <span>Simpan Semua Pengaturan</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}