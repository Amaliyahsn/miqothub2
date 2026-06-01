import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Save } from 'lucide-react';

export default function MaterialModal({ show, onClose, chapterId, material, nextOrder }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        judul: '', tipe: 'video', deskripsi: '', 
        link_video: '', file_path: null, 
        is_preview: false, urutan: 1, _method: 'post'
    });

    useEffect(() => {
        if (show) {
            if (material) {
                setData({
                    judul: material.judul, 
                    tipe: material.tipe, 
                    deskripsi: material.deskripsi || '',
                    link_video: material.link_video || '', 
                    file_path: null, 
                    is_preview: material.is_preview ? true : false, 
                    urutan: material.urutan, 
                    _method: 'put'
                });
            } else {
                setData({
                    judul: '', tipe: 'video', deskripsi: '', link_video: '', file_path: null,
                    is_preview: false, urutan: nextOrder, _method: 'post'
                });
            }
        } else {
            reset();
        }
    }, [show, material]);

    const submit = (e) => {
        e.preventDefault();
        
        let targetRoute = '';
        
        if (material) {
            targetRoute = route('admin.materials.update', material.id);
        } else {
            if (data.tipe === 'latihan') {
                targetRoute = route('admin.exercises.store', chapterId);
            } else {
                targetRoute = route('admin.materials.store', chapterId);
            }
        }
        
        post(targetRoute, { forceFormData: true, onSuccess: () => onClose() });
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
                    
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose} 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 15 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden max-h-[95vh] flex flex-col border border-slate-100"
                    >
                        
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                                    <FileText size={20} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                    {material ? 'Edit Data Materi' : 'Tambah Materi Baru'}
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                                <X size={20}/>
                            </button>
                        </div>

                        <form onSubmit={submit} className="flex-1 overflow-y-auto scrollbar-thin bg-white flex flex-col">
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tipe Materi</label>
                                        <select 
                                            value={data.tipe} onChange={e => setData('tipe', e.target.value)} 
                                            className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm font-bold text-slate-800 shadow-sm outline-none transition-colors cursor-pointer appearance-none"
                                        >
                                            <option value="video">Video (YouTube/Drive)</option>
                                            <option value="pdf">File PDF</option>
                                            <option value="latihan">Latihan / Tugas</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Urutan Materi</label>
                                        <input 
                                            type="number" value={data.urutan} onChange={e => setData('urutan', e.target.value)} 
                                            className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm font-bold text-slate-800 shadow-sm outline-none transition-colors" 
                                            title="Urutan" required min="1"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Judul Materi</label>
                                        <input 
                                            type="text" value={data.judul} onChange={e => setData('judul', e.target.value)} 
                                            className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm font-bold text-slate-800 shadow-sm outline-none transition-colors" 
                                            required 
                                        />
                                    </div>
                                </div>

                                {data.tipe === 'video' && (
                                    <div className="p-5 bg-blue-50 border border-blue-200/60 rounded-2xl shadow-sm">
                                        <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-2">Link URL Video</label>
                                        <input type="url" value={data.link_video} onChange={e => setData('link_video', e.target.value)} className="w-full px-4 py-3 rounded-xl border-blue-200 bg-white text-sm font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors" placeholder="https://youtube.com/..." required />
                                    </div>
                                )}

                                {data.tipe === 'pdf' && (
                                    <div className="p-5 bg-rose-50 border border-rose-200/60 rounded-2xl shadow-sm">
                                        <label className="block text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-2">Upload File PDF {material && '(Biarkan kosong jika tidak diganti)'}</label>
                                        <input type="file" accept=".pdf" onChange={e => setData('file_path', e.target.files[0])} className="w-full text-sm font-medium file:mr-4 file:py-2 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-100 file:text-rose-800 hover:file:bg-rose-200 cursor-pointer transition-colors" required={!material} />
                                        {errors.file_path && <span className="text-[11px] text-rose-600 mt-2 block font-semibold">{errors.file_path}</span>}
                                    </div>
                                )}

                                {data.tipe === 'latihan' && (
                                    <div className="p-5 bg-amber-50 border border-amber-200/60 rounded-2xl shadow-sm">
                                        <div className="bg-amber-100/50 text-amber-800 p-4 rounded-xl text-sm font-medium border border-amber-200/50">
                                            <p><strong>Penting:</strong> Setelah materi latihan ini dibuat, Anda harus masuk ke <b>Menu Latihan / Bank Soal</b> untuk menambahkan soal Pilihan Ganda ke dalam modul ini.</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Deskripsi Tambahan / Catatan</label>
                                    <textarea 
                                        value={data.deskripsi} onChange={e => setData('deskripsi', e.target.value)} rows="3" 
                                        className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm font-medium text-slate-800 shadow-sm outline-none transition-colors resize-none"
                                        placeholder="Berikan ringkasan materi..."
                                    ></textarea>
                                </div>

                                <label className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-slate-200 hover:border-blue-200 cursor-pointer transition-colors group shadow-sm">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" checked={data.is_preview} onChange={e => setData('is_preview', e.target.checked)} 
                                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer transition-colors" 
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Jadikan Free Preview</p>
                                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Materi ini bisa dilihat pengunjung publik sebagai "tester" tanpa perlu mendaftar kelas.</p>
                                    </div>
                                </label>
                            </div>

                            <div className="px-6 py-5 border-t border-slate-100 bg-[#F8FAFC] flex justify-end gap-3 shrink-0">
                                <button 
                                    type="button" onClick={onClose} 
                                    className="px-6 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:text-slate-800 hover:bg-slate-200 transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" disabled={processing} 
                                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                >
                                    {processing ? (
                                        <> <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses... </>
                                    ) : (
                                        <> <Save size={18} /> {material ? 'Simpan Perubahan' : 'Simpan Materi'} </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}