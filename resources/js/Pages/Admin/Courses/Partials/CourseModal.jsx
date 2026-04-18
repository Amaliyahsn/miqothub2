import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Save, Type, FileText, DollarSign, Users, Calendar, Link as LinkIcon, CheckSquare, Plus, Trash2, Tag, CalendarOff } from 'lucide-react';

export default function CourseModal({ isOpen, onClose, isEditMode, course }) {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nama: '', deskripsi: '', harga: '', harga_coret: '', batch: '', 
        status: 'onsale', kuota: '', tanggal_mulai: '', tanggal_selesai: '', link_grup_wa: '', 
        fitur: [''], 
        thumbnail: null, _method: 'post',
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (isEditMode && course) {
                setData({
                    nama: course.nama, deskripsi: course.deskripsi, harga: course.harga, 
                    harga_coret: course.harga_coret || '', batch: course.batch, 
                    status: course.status, kuota: course.kuota || '', 
                    tanggal_mulai: course.tanggal_mulai ? course.tanggal_mulai.split('T')[0] : '', 
                    tanggal_selesai: course.tanggal_selesai ? course.tanggal_selesai.split('T')[0] : '', 
                    link_grup_wa: course.link_grup_wa || '', 
                    fitur: course.fitur?.length > 0 ? course.fitur : [''], 
                    thumbnail: null, _method: 'put',
                });
                setPreview(course.thumbnail_url);
            } else {
                reset(); setData('_method', 'post'); setPreview(null);
            }
        }
    }, [isOpen, isEditMode, course]);

    // Handle Image Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('thumbnail', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    // Handle Dynamic Fitur Array
    const handleFiturChange = (index, value) => {
        const newFitur = [...data.fitur];
        newFitur[index] = value;
        setData('fitur', newFitur);
    };
    const addFitur = () => setData('fitur', [...data.fitur, '']);
    const removeFitur = (index) => {
        const newFitur = data.fitur.filter((_, i) => i !== index);
        setData('fitur', newFitur.length ? newFitur : ['']);
    };

    const submit = (e) => {
        e.preventDefault();
        const targetRoute = isEditMode ? route('admin.courses.update', course.id) : route('admin.courses.store');
        post(targetRoute, { forceFormData: true, onSuccess: () => onClose() });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity" />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden pointer-events-auto flex flex-col max-h-[95vh] border border-slate-100"
                        >
                            
                            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isEditMode ? 'Edit Data Kelas' : 'Buat Kelas Baru'}</h2>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Lengkapi informasi program pelatihan atau materi.</p>
                                </div>
                                <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={submit} className="flex-1 overflow-y-auto scrollbar-thin z-10 flex flex-col bg-white">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
                                    
                                    <div className="lg:col-span-7 space-y-6">
                                        
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Thumbnail Kelas</label>
                                            <div className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-400 transition-colors cursor-pointer">
                                                {preview ? (
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="text-center">
                                                        <Upload className="mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
                                                        <p className="text-sm text-slate-500 font-semibold">Klik untuk upload gambar</p>
                                                        <p className="text-xs text-slate-400 mt-1 font-medium">16:9 Rasio. Maks 2MB.</p>
                                                    </div>
                                                )}
                                                
                                                {preview && (
                                                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold tracking-wider">GANTI FOTO</span>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            </div>
                                            {errors.thumbnail && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.thumbnail}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Kelas</label>
                                            <div className="relative">
                                                <Type size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                                <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} className="pl-11 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-colors" placeholder="Contoh: Pemantapan Petugas Kloter" required />
                                            </div>
                                            {errors.nama && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.nama}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Deskripsi Lengkap</label>
                                            <div className="relative">
                                                <FileText size={18} className="absolute top-3.5 left-4 text-slate-400" />
                                                <textarea value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} rows="4" className="pl-11 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors resize-none" placeholder="Jelaskan apa yang akan dipelajari..." required />
                                            </div>
                                            {errors.deskripsi && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.deskripsi}</p>}
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fasilitas / Fitur yang Didapat</label>
                                                <button type="button" onClick={addFitur} className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/50 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-blue-100 transition-colors uppercase tracking-wider">
                                                    <Plus size={12} strokeWidth={3} /> Tambah
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {data.fitur.map((item, index) => (
                                                    <div key={index} className="flex gap-2 relative">
                                                        <CheckSquare size={18} className="absolute top-3.5 left-4 text-blue-500 z-10" />
                                                        <input type="text" value={item} onChange={e => handleFiturChange(index, e.target.value)} className="pl-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 text-sm font-medium shadow-sm outline-none transition-colors" placeholder="Contoh: E-Sertifikat Resmi" required />
                                                        <button type="button" onClick={() => removeFitur(index)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-5 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-200 h-fit space-y-6">
                                        
                                        <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-200/60">
                                            <div className="p-1.5 bg-blue-100/50 text-blue-600 rounded-lg">
                                                <Tag size={18} />
                                            </div>
                                            <h3 className="font-black text-slate-800">Pengaturan Kelas</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Harga Jual (Rp)</label>
                                                <div className="relative">
                                                    <p className="absolute top-3.5 font-semibold text-xs left-3 text-slate-400">Rp.   </p>
                                                    <input type="number" value={data.harga} onChange={e => setData('harga', e.target.value)} className="pl-9 w-full rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 text-sm font-black text-slate-900 shadow-sm outline-none transition-colors" placeholder="0" required />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Harga Coret</label>
                                                <div className="relative">
                                                    <p className="absolute top-3.5 font-semibold text-xs left-3 text-slate-300">Rp.   </p>
                                                    <input type="number" value={data.harga_coret} onChange={e => setData('harga_coret', e.target.value)} className="pl-9 w-full rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 text-sm font-bold text-slate-400 line-through shadow-sm outline-none transition-colors" placeholder="0" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Gelombang</label>
                                                <input type="text" value={data.batch} onChange={e => setData('batch', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 px-4 text-sm font-bold shadow-sm outline-none transition-colors" placeholder="Misal: 1" required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Status Daftar</label>
                                                <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 px-4 text-sm font-bold shadow-sm outline-none transition-colors cursor-pointer appearance-none">
                                                    <option value="onsale">✅ Buka (On Sale)</option>
                                                    <option value="offsale">⛔ Tutup (Off Sale)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kuota Peserta</label>
                                                <div className="relative">
                                                    <Users size={16} className="absolute top-3.5 left-3 text-slate-400" />
                                                    <input type="number" value={data.kuota} onChange={e => setData('kuota', e.target.value)} className="pl-9 w-full rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 text-sm font-semibold shadow-sm outline-none transition-colors" placeholder="Kosong = ∞" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tanggal Mulai</label>
                                                <div className="relative">
                                                    <Calendar size={16} className="absolute top-3.5 left-3 text-slate-400" />
                                                    <input type="date" value={data.tanggal_mulai} onChange={e => setData('tanggal_mulai', e.target.value)} className="pl-9 w-full rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 text-sm font-semibold text-slate-600 shadow-sm outline-none transition-colors cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* TAMBAHAN BARU: TANGGAL SELESAI / EXPIRED */}
                                        <div className="grid grid-cols-1">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tanggal Selesai</label>
                                            <div className="relative">
                                                <CalendarOff size={16} className="absolute top-3.5 left-3 text-rose-400" />
                                                <input type="date" value={data.tanggal_selesai} onChange={e => setData('tanggal_selesai', e.target.value)} className="pl-9 w-full rounded-xl border border-slate-200 bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 py-3 text-sm font-semibold text-slate-600 shadow-sm outline-none transition-colors cursor-pointer" />
                                            </div>
                                            <p className="text-[9px] text-slate-400 mt-1 font-medium italic">*Tanggal akses kelas bagi member berakhir.</p>
                                        </div>

                                        <div className="pt-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Link Grup WhatsApp</label>
                                            <div className="relative">
                                                <LinkIcon size={16} className="absolute top-3.5 left-3 text-slate-400" />
                                                <input type="url" value={data.link_grup_wa} onChange={e => setData('link_grup_wa', e.target.value)} className="pl-9 w-full rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 py-3 text-sm font-medium text-blue-600 shadow-sm outline-none transition-colors" placeholder="https://chat.whatsapp.com/..." />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                
                                <div className="mt-auto px-8 py-5 border-t border-slate-100 bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
                                    <button type="button" onClick={onClose} disabled={processing} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:text-slate-800 hover:bg-slate-200 transition-colors disabled:opacity-50 text-sm">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="flex items-center gap-2 bg-blue-900 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-800 shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                                        {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                                        {processing ? 'Menyimpan...' : 'Simpan Kelas'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}