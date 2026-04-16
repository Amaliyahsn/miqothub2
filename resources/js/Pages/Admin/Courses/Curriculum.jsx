import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Plus, ChevronDown, ChevronUp, Trash2, 
    Video, FileText, FileBadge, ShieldAlert, 
    LayoutList, Layers, Edit, Eye, MonitorPlay, ClipboardList, Clock, Target,
    ArrowUp, ArrowDown 
} from 'lucide-react'; 

// Import Partials
import ChapterModal from './Partials/ChapterModal';
import MaterialModal from './Partials/MaterialModal';
import MaterialDetailModal from './Partials/MaterialDetailModal';

export default function Curriculum({ auth, course }) {
    const { flash = {} } = usePage().props;
    const chapters = course.chapters || [];

    const [expandedChapters, setExpandedChapters] = useState(chapters.map(c => c.id));
    
    const [modalChapter, setModalChapter] = useState({ show: false, chapter: null });
    const [modalMaterial, setModalMaterial] = useState({ show: false, chapterId: null, material: null, nextOrder: 1 });
    const [modalDetail, setModalDetail] = useState({ show: false, material: null });

    const toggleChapter = (id) => {
        setExpandedChapters(prev => prev.includes(id) ? prev.filter(chapId => chapId !== id) : [...prev, id]);
    };

    // --- FUNGSI REORDER (GESER POSISI) ---
    const moveChapter = (id, direction) => {
        router.put(route('admin.chapters.reorder', id), { direction }, { preserveScroll: true });
    };

    const moveMaterial = (id, direction) => {
        router.put(route('admin.materials.reorder', id), { direction }, { preserveScroll: true });
    };

    const deleteChapter = (id) => {
        if (confirm('Yakin ingin menghapus Bab ini beserta SELURUH materinya? Tindakan ini tidak bisa dibatalkan.')) {
            router.delete(route('admin.chapters.destroy', id));
        }
    };

    const deleteMaterial = (id) => {
        if (confirm('Yakin ingin menghapus materi ini?')) {
            router.delete(route('admin.materials.destroy', id));
        }
    };

    // Tema Semantik untuk Tipe Materi
    const getMaterialConfig = (type) => {
        switch (type) {
            case 'video': return { icon: <Video size={18} strokeWidth={2.5} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200/60' };
            case 'pdf': return { icon: <FileBadge size={18} strokeWidth={2.5} />, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200/60' };
            case 'pertemuan': return { icon: <MonitorPlay size={18} strokeWidth={2.5} />, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200/60' };
            case 'latihan': return { icon: <ClipboardList size={18} strokeWidth={2.5} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200/60' };
            default: return { icon: <FileText size={18} strokeWidth={2.5} />, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Kurikulum: ${course.nama}`} />

            
            <div className="relative mb-8 p-8 bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <Link href={route('admin.courses.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-blue-900 mb-6 transition-colors">
                        <ArrowLeft size={16} /> Kembali ke Daftar Kelas
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-blue-900 text-white rounded-xl shadow-md shadow-blue-900/20">
                                    <LayoutList size={24} strokeWidth={2.5} />
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Kurikulum</h1>
                            </div>
                            <p className="text-slate-500 text-sm font-medium max-w-2xl leading-relaxed mt-2">
                                Susun alur belajar untuk kelas <strong className="text-blue-900 font-bold">{course.nama}</strong>. Tambahkan video, modul PDF, dan latihan soal.
                            </p>
                        </div>
                        <button 
                            onClick={() => setModalChapter({ show: true, chapter: null })} 
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md active:scale-95 shrink-0 text-sm"
                        >
                            <Plus size={18} strokeWidth={2.5} /> Tambah Bab Baru
                        </button>
                    </div>
                </div>
            </div>

            
            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl font-bold text-sm flex items-center gap-3 shadow-sm">
                        <div className="w-8 h-8 bg-blue-200/50 rounded-full flex items-center justify-center shrink-0">
                            <ShieldAlert size={16} className="text-blue-700" />
                        </div>
                        {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            
            <div className="space-y-6">
                {chapters.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
                            <Layers size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Kurikulum Masih Kosong</h3>
                        <p className="text-slate-500 text-sm font-medium max-w-md mb-8 leading-relaxed">Mulai bangun struktur materi kelas ini dengan menambahkan Bab pertama Anda. Buat alur belajar yang terstruktur dan mudah dipahami member.</p>
                        <button 
                            onClick={() => setModalChapter({ show: true, chapter: null })} 
                            className="px-6 py-3 bg-blue-50 text-blue-900 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                            Buat Bab Pertama
                        </button>
                    </div>
                ) : (
                    chapters.map((chapter, index) => (
                        <div key={chapter.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden group/chapter">
                            
                            
                            <div className="bg-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 gap-4 transition-colors hover:bg-slate-50/80">
                                <div className="flex items-center gap-4 cursor-pointer select-none flex-1" onClick={() => toggleChapter(chapter.id)}>
                                    <button className={`p-2 rounded-xl transition-colors ${expandedChapters.includes(chapter.id) ? 'bg-blue-900 text-white shadow-md' : 'bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-900 hover:bg-blue-50'}`}>
                                        {expandedChapters.includes(chapter.id) ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                                    </button>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bab {chapter.urutan}</p>
                                        <h3 className="font-black text-slate-900 text-lg leading-tight">{chapter.judul}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:opacity-0 group-hover/chapter:opacity-100 transition-opacity">
                                    
                                    
                                    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mr-2">
                                        <button onClick={() => moveChapter(chapter.id, 'up')} disabled={index === 0} className="p-2.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-colors" title="Geser ke Atas"><ArrowUp size={16}/></button>
                                        <div className="w-px h-5 bg-slate-200"></div>
                                        <button onClick={() => moveChapter(chapter.id, 'down')} disabled={index === chapters.length - 1} className="p-2.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-colors" title="Geser ke Bawah"><ArrowDown size={16}/></button>
                                    </div>

                                    
                                    <button 
                                        onClick={() => setModalMaterial({ show: true, chapterId: chapter.id, material: null, nextOrder: chapter.materials?.length + 1 || 1 })} 
                                        className="text-xs font-bold px-4 py-2.5 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl hover:bg-blue-900 hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Plus size={16} strokeWidth={2.5} /> Materi
                                    </button>
                                    <button 
                                        onClick={() => setModalChapter({ show: true, chapter: chapter })} 
                                        className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shadow-sm" title="Edit Bab"
                                    >
                                        <Edit size={16}/>
                                    </button>
                                    <button 
                                        onClick={() => deleteChapter(chapter.id)} 
                                        className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-xl transition-colors shadow-sm" title="Hapus Bab"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>

                            
                            <AnimatePresence>
                                {expandedChapters.includes(chapter.id) && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-[#F8FAFC]">
                                        <div className="p-6 space-y-3">
                                            {chapter.materials && chapter.materials.length > 0 ? (
                                                chapter.materials.map((material, matIndex) => {
                                                    const config = getMaterialConfig(material.tipe);
                                                    return (
                                                        <div key={material.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all gap-4 relative overflow-hidden shadow-sm">
                                                            
                                                            
                                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                                                            <div className="flex items-start md:items-center gap-4 flex-1 pl-2">
                                                                
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 shadow-sm ${config.bg} ${config.color} ${config.border}`}>
                                                                    {config.icon}
                                                                </div>
                                                                
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1.5">
                                                                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-widest">{material.urutan}</span>
                                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>{material.tipe === 'text_only' ? 'TEKS' : material.tipe}</span>
                                                                        {material.is_preview && <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-widest">Free Preview</span>}
                                                                    </div>
                                                                    <p className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{material.judul}</p>
                                                                    
                                                                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500 font-semibold tracking-wide">
                                                                        {material.durasi && (
                                                                            <span className="flex items-center gap-1"><Clock size={12}/> {material.durasi}</span>
                                                                        )}
                                                                        {material.tipe === 'pertemuan' && material.tanggal_waktu_meet && (
                                                                            <span className="flex items-center gap-1.5 text-violet-700 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded"><Clock size={12}/> {new Date(material.tanggal_waktu_meet).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} WIB</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all justify-end border-t border-slate-100 md:border-0 pt-4 md:pt-0 items-center">
                                                                
                                                                
                                                                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden mr-2 shadow-sm">
                                                                    <button onClick={() => moveMaterial(material.id, 'up')} disabled={matIndex === 0} className="p-2 text-slate-400 hover:text-blue-900 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-colors" title="Geser ke Atas"><ArrowUp size={14}/></button>
                                                                    <div className="w-px h-4 bg-slate-200"></div>
                                                                    <button onClick={() => moveMaterial(material.id, 'down')} disabled={matIndex === chapter.materials.length - 1} className="p-2 text-slate-400 hover:text-blue-900 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-colors" title="Geser ke Bawah"><ArrowDown size={14}/></button>
                                                                </div>

                                                                {material.tipe === 'latihan' && material.exercise_id && (
                                                                    <Link 
                                                                        href={route('admin.exercises.show', material.exercise_id)}
                                                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-lg transition-colors border border-amber-200 hover:border-amber-600 shadow-sm"
                                                                    >
                                                                        <Target size={14}/> Kelola Soal
                                                                    </Link>
                                                                )}
                                                                
                                                                <button onClick={() => setModalDetail({ show: true, material: material })} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors border border-slate-200 shadow-sm">
                                                                    <Eye size={14}/> Detail
                                                                </button>
                                                                <button onClick={() => setModalMaterial({ show: true, chapterId: chapter.id, material: material, nextOrder: material.urutan })} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-lg transition-colors border border-slate-200 shadow-sm">
                                                                    <Edit size={14}/> Edit
                                                                </button>
                                                                <button onClick={() => deleteMaterial(material.id)} className="p-2 text-slate-400 bg-white hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-lg transition-colors border border-slate-200 shadow-sm" title="Hapus Materi">
                                                                    <Trash2 size={16}/>
                                                                </button>
                                                            </div>

                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-12 text-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl">
                                                    <p className="font-semibold text-sm">Belum ada materi di bab ini.</p>
                                                    <button onClick={() => setModalMaterial({ show: true, chapterId: chapter.id, material: null, nextOrder: 1 })} className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-blue-200">Tambahkan materi sekarang</button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                )}
            </div>

            
            <AnimatePresence>
                {modalChapter.show && (
                    <ChapterModal show={modalChapter.show} onClose={() => setModalChapter({ show: false, chapter: null })} courseId={course.id} chapter={modalChapter.chapter} nextOrder={chapters.length + 1} />
                )}
                {modalMaterial.show && (
                    <MaterialModal show={modalMaterial.show} onClose={() => setModalMaterial({ show: false, chapterId: null, material: null, nextOrder: 1 })} chapterId={modalMaterial.chapterId} material={modalMaterial.material} nextOrder={modalMaterial.nextOrder} />
                )}
                {modalDetail.show && (
                    <MaterialDetailModal show={modalDetail.show} onClose={() => setModalDetail({ show: false, material: null })} material={modalDetail.material} />
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}