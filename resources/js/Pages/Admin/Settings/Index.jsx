import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Save, Settings, Phone, CreditCard, CheckCircle2, QrCode, Image as ImageIcon, BarChart3 } from 'lucide-react';

export default function Index({ auth, settings }) {
    const { flash = {} } = usePage().props;
    const getBool = (val) => val === 'true' || val === true || val === 1 || val === '1';

    const { data, setData, post, processing, transform } = useForm({
        wa_admin: settings?.wa_admin || '',
        hero_description: settings?.hero_description || '',
        bank1_active: getBool(settings?.bank1_active),
        bank1_name: settings?.bank1_name || '',
        bank1_number: settings?.bank1_number || '',
        bank1_owner: settings?.bank1_owner || '',
        bank2_active: getBool(settings?.bank2_active),
        bank2_name: settings?.bank2_name || '',
        bank2_number: settings?.bank2_number || '',
        bank2_owner: settings?.bank2_owner || '',
        qris_active: getBool(settings?.qris_active),
        qris_image: null,
        qris_preview: settings?.qris_path || '',
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

    useEffect(() => {
        transform((data) => ({
            ...data,
            bank1_active: data.bank1_active ? 1 : 0,
            bank2_active: data.bank2_active ? 1 : 0,
            qris_active: data.qris_active ? 1 : 0,
        }));
    }, [data.bank1_active, data.bank2_active, data.qris_active]);

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

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                        <Settings size={28} strokeWidth={2.5} />
                    </div>
                    Pengaturan Sistem
                </h1>
                <p className="text-slate-500 mt-2 font-medium text-sm">Kelola kontak, pembayaran, dan statistik landing page.</p>
            </div>

            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl font-bold flex items-center gap-3 text-sm shadow-sm">
                        <div className="bg-emerald-500 text-white p-1 rounded-full"><CheckCircle2 size={14} /></div> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={submit} className="space-y-6 pb-20">
                
                {/* SECTION 1: WHATSAPP */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                        <div className="p-3 bg-blue-900 text-white rounded-xl shadow-md">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 leading-tight">Kontak Customer Service</h2>
                            <p className="text-sm text-slate-500 font-medium">Nomor WhatsApp rujukan utama bantuan.</p>
                        </div>
                    </div>
                    <div className="max-w-md">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nomor WhatsApp Admin</label>
                        <input type="text" value={data.wa_admin} onChange={e => setData('wa_admin', e.target.value)} placeholder="6281234567890" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-semibold outline-none transition-all" />
                    </div>
                </div>  

        {/* INPUT BARU: DESKRIPSI HERO */}
        <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Deskripsi Hero (Landing Page)</label>
            <textarea 
                value={data.hero_description} 
                onChange={e => setData('hero_description', e.target.value)} 
                rows="3"
                placeholder="Materi disusun sederhana..." 
                className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-medium outline-none transition-all"
            />
        </div>

                {/* SECTION STATISTIK (Dinamis) */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                        <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 leading-tight">Statistik Landing Page</h2>
                            <p className="text-sm text-slate-500 font-medium">Atur 4 poin jumlah/statistik utama.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Data {i}</span>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Angka (Value)</label>
                                    <input type="text" value={data[`stat${i}_value`]} onChange={e => setData(`stat${i}_value`, e.target.value)} placeholder="Misal: 8K+" className="w-full rounded-xl border-slate-200 py-2 px-3 font-bold text-sm outline-none focus:border-indigo-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Keterangan (Label)</label>
                                    <textarea rows="2" value={data[`stat${i}_label`]} onChange={e => setData(`stat${i}_label`, e.target.value)} placeholder="Misal: Alumni Lolos" className="w-full rounded-xl border-slate-200 py-2 px-3 font-medium text-xs outline-none focus:border-indigo-500 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 2: QRIS */}
                <div className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 transition-all duration-300 ${data.qris_active ? 'border-purple-500 shadow-xl shadow-purple-900/5' : 'border-slate-100 opacity-60'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl shadow-sm border transition-colors ${data.qris_active ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                <QrCode size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Pembayaran via QRIS</h2>
                                <p className="text-sm text-slate-500 font-medium">Upload barcode QRIS.</p>
                            </div>
                        </div>
                        <label className={`flex items-center cursor-pointer px-4 py-2 rounded-xl border-2 transition-all ${data.qris_active ? 'bg-purple-900 border-purple-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <input type="checkbox" checked={data.qris_active} onChange={e => setData('qris_active', e.target.checked)} className="rounded text-purple-500 focus:ring-purple-500 mr-2.5 w-4 h-4 cursor-pointer" />
                            <span className="text-xs font-black uppercase tracking-widest">{data.qris_active ? 'AKTIF' : 'NONAKTIF'}</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upload File QRIS</label>
                            <div className="relative group">
                                <input disabled={!data.qris_active} type="file" accept="image/*" onChange={e => setData('qris_image', e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" />
                                <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-purple-400 transition-colors bg-slate-50">
                                    <ImageIcon className="text-slate-400" size={32} />
                                    <span className="text-sm font-bold text-slate-500 text-center">{data.qris_image ? data.qris_image.name : 'Pilih Gambar QRIS'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center md:justify-end">
                            {(data.qris_preview || data.qris_image) ? (
                                <div className="p-2 bg-white border border-slate-200 rounded-2xl shadow-sm relative">
                                    <img src={data.qris_image ? URL.createObjectURL(data.qris_image) : `/storage/${data.qris_preview}`} alt="QRIS Preview" className="w-40 h-40 object-contain rounded-xl" />
                                </div>
                            ) : (
                                <div className="w-40 h-40 bg-slate-100 rounded-2xl flex items-center justify-center border border-dashed border-slate-200 text-slate-300 text-xs text-center p-4">Belum ada gambar</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECTION 3: BANK 1 */}
                <div className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 transition-all duration-300 ${data.bank1_active ? 'border-blue-500 shadow-xl shadow-blue-900/5' : 'border-slate-100 opacity-60'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl shadow-sm border transition-colors ${data.bank1_active ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                <CreditCard size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Metode Pembayaran Utama</h2>
                                <p className="text-sm text-slate-500 font-medium">Informasi rekening bank utama.</p>
                            </div>
                        </div>
                        <label className={`flex items-center cursor-pointer px-4 py-2 rounded-xl border-2 transition-all ${data.bank1_active ? 'bg-blue-900 border-blue-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <input type="checkbox" checked={data.bank1_active} onChange={e => setData('bank1_active', e.target.checked)} className="rounded text-blue-500 focus:ring-blue-500 mr-2.5 w-4 h-4 cursor-pointer" />
                            <span className="text-xs font-black uppercase tracking-widest">{data.bank1_active ? 'AKTIF' : 'NONAKTIF'}</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Bank / E-Wallet</label>
                            <input disabled={!data.bank1_active} type="text" value={data.bank1_name} onChange={e => setData('bank1_name', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nomor Rekening</label>
                            <input disabled={!data.bank1_active} type="text" value={data.bank1_number} onChange={e => setData('bank1_number', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Atas Nama</label>
                            <input disabled={!data.bank1_active} type="text" value={data.bank1_owner} onChange={e => setData('bank1_owner', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 font-bold outline-none transition-all" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={processing} className="flex items-center gap-2 px-10 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-95 disabled:opacity-70 text-sm">
                        {processing ? <> <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses... </> : <> <Save size={18} /> Simpan Semua Pengaturan </>}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}