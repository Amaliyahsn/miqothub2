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

            {/* Header Section Card - Responsif Padding */}
            <div className="relative mb-6 sm:mb-8 p-5 sm:p-8 bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <Link href={route('admin.courses.index')} className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-900 mb-4 sm:mb-6 transition-colors">
                        <ArrowLeft size={14} /> Kembali ke Daftar Kelas
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-5 sm:gap-6">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                                <div className="p-2 bg-blue-900 text-white rounded-xl shadow-md shrink-0">
                                    <LayoutList size={20} sm={24} strokeWidth={2.5} />
                                </div>
                                <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">Kelola Kurikulum</h1>
                            </div>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed mt-1.5">
                                Susun alur belajar untuk kelas <strong className="text-blue-900 font-bold">{course.nama}</strong>. Tambahkan video, modul PDF, dan latihan soal.
                            </p>
                        </div>
                        <button 
                            onClick={() => setModalChapter({ show: true, chapter: null })} 
                            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md active:scale-95 w-full lg:w-auto shrink-0 text-xs sm:text-sm uppercase tracking-wider lg:normal-case lg:tracking-normal"
                        >
                            <Plus size={16} strokeWidth={2.5} /> Tambah Bab Baru
                        </button>
                    </div>
                </div>
            </div>

            {/* Flash Message */}
            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 shadow-sm">
                        <div className="w-7 h-7 bg-blue-200/50 rounded-full flex items-center justify-center shrink-0">
                            <ShieldAlert size={14} className="text-blue-700" />
                        </div>
                        {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Container Daftar Bab */}
            <div className="space-y-4 sm:space-y-6">
                {chapters.length === 0 ? (
                    <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed border-slate-200 p-10 sm:p-20 text-center flex flex-col items-center justify-center min-h-[350px]">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 sm:mb-5 border border-slate-100">
                            <Layers size={32} sm={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1 sm:mb-2">Kurikulum Masih Kosong</h3>
                        <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-md mb-6 sm:mb-8 leading-relaxed">Mulai bangun struktur materi kelas ini dengan menambahkan Bab pertama Anda. Buat alur belajar yang terstruktur dan mudah dipahami member.</p>
                        <button 
                            onClick={() => setModalChapter({ show: true, chapter: null })} 
                            className="px-5 py-3 bg-blue-50 text-blue-900 font-bold text-xs sm:text-sm rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                        >
                            Buat Bab Pertama
                        </button>
                    </div>
                ) : (
                    chapters.map((chapter, index) => (
                        <div key={chapter.id} className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden group/chapter">
                            
                            {/* Header Bab - Penataan Flex Adaptif Vertikal/Horizontal */}
                            <div className="bg-white p-4 sm:px-6 sm:py-5 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 gap-4 transition-colors hover:bg-slate-50/80">
                                <div className="flex items-start gap-3.5 cursor-pointer select-none flex-1 min-w-0" onClick={() => toggleChapter(chapter.id)}>
                                    <button className={`p-2 rounded-xl transition-colors mt-0.5 shrink-0 ${expandedChapters.includes(chapter.id) ? 'bg-blue-900 text-white shadow-md' : 'bg-slate-100 border border-slate-200 text-slate-500'}`}>
                                        {expandedChapters.includes(chapter.id) ? <ChevronUp size={16} sm={20}/> : <ChevronDown size={16} sm={20}/>}
                                    </button>
                                    <div className="min-w-0">
                                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Bab {chapter.urutan}</p>
                                        <h3 className="font-black text-slate-900 text-sm sm:text-lg leading-snug break-words">{chapter.judul}</h3>
                                    </div>
                                </div>

                                {/* Area Aksi Bab: Rapi Berjejer Penuh di HP */}
                                <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 border-t border-slate-100 md:border-0 pt-3 md:pt-0">
                                    {/* Urutan Arrows */}
                                    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <button onClick={() => moveChapter(chapter.id, 'up')} disabled={index === 0} className="p-2 sm:p-2.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-colors" title="Geser ke Atas"><ArrowUp size={15}/></button>
                                        <div className="w-px h-4 sm:h-5 bg-slate-200"></div>
                                        <button onClick={() => moveChapter(chapter.id, 'down')} disabled={index === chapters.length - 1} className="p-2 sm:p-2.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-colors" title="Geser ke Bawah"><ArrowDown size={15}/></button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 ml-auto md:ml-0">
                                        <button 
                                            onClick={() => setModalMaterial({ show: true, chapterId: chapter.id, material: null, nextOrder: chapter.materials?.length + 1 || 1 })} 
                                            className="text-[11px] font-bold px-3.5 py-2 sm:py-2.5 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl hover:bg-blue-900 hover:text-white transition-colors flex items-center gap-1 shadow-sm"
                                        >
                                            <Plus size={14} strokeWidth={2.5} /> Materi
                                        </button>
                                        <button 
                                            onClick={() => setModalChapter({ show: true, chapter: chapter })} 
                                            className="p-2 sm:p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shadow-sm" title="Edit Bab"
                                        >
                                            <Edit size={14}/>
                                        </button>
                                        <button 
                                            onClick={() => deleteChapter(chapter.id)} 
                                            className="p-2 sm:p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shadow-sm" title="Hapus Bab"
                                        >
                                            <Trash2 size={14}/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Isi Materi di Dalam Bab */}
                            <AnimatePresence>
                                {expandedChapters.includes(chapter.id) && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-[#F8FAFC]">
                                        <div className="p-4 sm:p-6 space-y-3">
                                            {chapter.materials && chapter.materials.length > 0 ? (
                                                chapter.materials.map((material, matIndex) => {
                                                    const config = getMaterialConfig(material.tipe);
                                                    return (
                                                        <div key={material.id} className="group flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all gap-4 relative overflow-hidden shadow-sm">
                                                            
                                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${config.bg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                                                            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 pl-1">
                                                                {/* Icon Materi */}
                                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border shrink-0 shadow-sm ${config.bg} ${config.color} ${config.border}`}>
                                                                    {config.icon}
                                                                </div>
                                                                
                                                                {/* Deskripsi Teks */}
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                                        <span className="text-[9px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded tracking-wider">{material.urutan}</span>
                                                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${config.bg} ${config.color} ${config.border}`}>{material.tipe === 'text_only' ? 'TEKS' : material.tipe}</span>
                                                                        {material.is_preview && <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold rounded uppercase tracking-wider">Preview</span>}
                                                                    </div>
                                                                    <p className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition-colors leading-snug break-words">{material.judul}</p>
                                                                    
                                                                    {/* Meta Durasi / Jadwal */}
                                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] sm:text-[11px] text-slate-400 font-semibold">
                                                                        {material.durasi && (
                                                                            <span className="flex items-center gap-1"><Clock size={11}/> {material.durasi}</span>
                                                                        )}
                                                                        {material.tipe === 'pertemuan' && material.tanggal_waktu_meet && (
                                                                            <span className="flex items-center gap-1 text-violet-700 bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded truncate max-w-full"><Clock size={11}/> {new Date(material.tanggal_waktu_meet).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} WIB</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Panel Aksi Materi - Ditata Rapi Menumpuk Rata di HP */}
                                                            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 border-t border-slate-100 lg:border-0 pt-3 lg:pt-0">
                                                                {/* Urutan Arrows Materi */}
                                                                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                                                    <button onClick={() => moveMaterial(material.id, 'up')} disabled={matIndex === 0} className="p-2 text-slate-400 hover:text-blue-900 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-colors" title="Geser ke Atas"><ArrowUp size={14}/></button>
                                                                    <div className="w-px h-4 bg-slate-200"></div>
                                                                    <button onClick={() => moveMaterial(material.id, 'down')} disabled={matIndex === chapter.materials.length - 1} className="p-2 text-slate-400 hover:text-blue-900 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-white transition-colors" title="Geser ke Bawah"><ArrowDown size={14}/></button>
                                                                </div>

                                                                {/* Tombol Operasional Tambahan */}
                                                                <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
                                                                    {material.tipe === 'latihan' && material.exercise_id && (
                                                                        <Link 
                                                                            href={route('admin.exercises.show', material.exercise_id)}
                                                                            className="flex items-center gap-1 px-2.5 py-2 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-xl hover:bg-amber-600 hover:text-white transition-colors shadow-sm"
                                                                        >
                                                                            <Target size={13}/> Soal
                                                                        </Link>
                                                                    )}
                                                                    
                                                                    <button onClick={() => setModalDetail({ show: true, material: material })} className="flex items-center gap-1 px-2.5 py-2 text-[11px] font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 shadow-sm">
                                                                        <Eye size={13}/> Detail
                                                                    </button>
                                                                    <button onClick={() => setModalMaterial({ show: true, chapterId: chapter.id, material: material, nextOrder: material.urutan })} className="flex items-center gap-1 px-2.5 py-2 text-[11px] font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 shadow-sm">
                                                                        <Edit size={13}/> Edit
                                                                    </button>
                                                                    <button onClick={() => deleteMaterial(material.id)} className="p-2 text-slate-400 bg-white border border-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shadow-sm" title="Hapus Materi">
                                                                        <Trash2 size={14}/>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-8 sm:py-12 text-center text-xs sm:text-sm font-medium text-slate-400 bg-white border border-dashed border-slate-200 rounded-xl px-4">
                                                    <p>Belum ada materi di bab ini.</p>
                                                    <button onClick={() => setModalMaterial({ show: true, chapterId: chapter.id, material: null, nextOrder: 1 })} className="mt-1.5 font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4">Tambahkan materi sekarang</button>
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

            {/* Modal Components */}
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