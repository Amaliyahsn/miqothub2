import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Plus, Trash2, Target, X, CheckCircle2, 
    ArrowUp, ArrowDown, Edit, Settings, Lock, LockOpen, ListChecks, Users, Award, Clock 
} from 'lucide-react';
import QuestionModal from './Partials/QuestionModal';

export default function Show({ auth, exercise, scores }) {
    const { flash = {} } = usePage().props;
    const questions = exercise.questions || [];
    
    // Tab Navigation State
    const [activeTab, setActiveTab] = useState('soal');

    // Menentukan Course ID untuk tombol kembali
    const courseId = exercise.materials && exercise.materials.length > 0 && exercise.materials[0].chapter 
        ? exercise.materials[0].chapter.course_id 
        : null;
    
    // Modal States
    const [modal, setModal] = useState({ show: false, question: null });
    const [settingModal, setSettingModal] = useState(false);
    const [isReordering, setIsReordering] = useState(false);

    // Form Pengaturan Kuis
    // 1. Pastikan inisialisasi default menghandle angka 0 dengan benar
const formSettings = useForm({
    judul: exercise.judul || '',
    deskripsi: exercise.deskripsi || '',
    password: exercise.password || '',
    // Jika dari backend bernilai 0 atau null/undefined, biarkan default 0 (tidak dibatasi)
    waktu_menit: exercise.waktu_menit !== undefined && exercise.waktu_menit !== null ? exercise.waktu_menit : 0, 
    is_active: exercise.is_active === 1 || exercise.is_active === true,
});

    const submitSettings = (e) => {
        e.preventDefault();
        formSettings.put(route('admin.exercises.update', exercise.id), {
            onSuccess: () => setSettingModal(false)
        });
    };

    const deleteQuestion = (id) => {
        if (confirm('Yakin ingin menghapus soal ini beserta gambarnya?')) {
            router.delete(route('admin.questions.destroy', id));
        }
    };

    const moveQuestion = (index, direction) => {
        setIsReordering(true);
        const newQuestions = [...questions];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
        const orderedIds = newQuestions.map(q => q.id);
        
        router.put(route('admin.questions.reorder', exercise.id), { ordered_ids: orderedIds }, {
            onFinish: () => setIsReordering(false)
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title={`Kelola Latihan: ${exercise.judul}`} />

            
            <div className="mb-8 p-8 bg-white rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden">
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
                    <div>
                        {courseId ? (
                            <Link href={route('admin.courses.curriculum', courseId)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-blue-900 mb-6 transition-colors">
                                <ArrowLeft size={16} /> Kembali ke Kurikulum Kelas
                            </Link>
                        ) : (
                            <Link href={route('admin.courses.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-blue-900 mb-6 transition-colors">
                                <ArrowLeft size={16} /> Kembali ke Menu Kelas
                            </Link>
                        )}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-blue-900 text-white rounded-xl shadow-md shadow-blue-900/20">
                                <Target size={24} strokeWidth={2.5}/>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{exercise.judul}</h1>
                        </div>
                        <p className="text-slate-500 text-sm font-medium max-w-2xl leading-relaxed mt-2">{exercise.deskripsi || 'Kelola daftar soal dan pantau nilai peserta untuk latihan ini.'}</p>
                        
                        
                        <div className="flex flex-wrap gap-2.5 mt-5">
                            <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 ${exercise.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'}`}>
                                <CheckCircle2 size={14}/> {exercise.is_active ? 'Aktif' : 'Ditutup'}
                            </span>
                            {exercise.password ? (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-200/60">
                                    <Lock size={14}/> Diproteksi Password
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                    <LockOpen size={14}/> Tanpa Password
                                </span>
                            )}
                            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg border border-slate-200 flex items-center gap-1.5">
                                <Clock size={14}/> {exercise.waktu_menit} Menit
                            </span>
                            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-lg border border-slate-200 flex items-center gap-1.5">
                                <Users size={14}/> {scores.length} Peserta Selesai
                            </span>
                        </div>
                    </div>
                    
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => setSettingModal(true)} className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm border border-slate-200 text-sm">
                            <Settings size={18} /> Konfigurasi
                        </button>
                        <button onClick={() => setModal({ show: true, question: null })} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md active:scale-95 shrink-0 text-sm">
                            <Plus size={18} strokeWidth={2.5} /> Tambah Soal
                        </button>
                    </div>
                </div>
            </div>

            
            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl font-bold flex items-center gap-3 text-sm shadow-sm">
                        <CheckCircle2 size={18} className="text-blue-600" /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            
            <div className="flex bg-slate-100/80 p-1.5 rounded-xl w-full max-w-md mb-6 relative border border-slate-200/60 shadow-sm">
                <button onClick={() => setActiveTab('soal')} className={`relative flex-1 px-6 py-2.5 text-sm font-bold rounded-lg transition-colors z-10 flex items-center justify-center gap-2 ${activeTab === 'soal' ? 'text-blue-900' : 'text-slate-500 hover:text-slate-700'}`}>
                    {activeTab === 'soal' && <motion.div layoutId="activeTabEx" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200 z-[-1]" />}
                    <ListChecks size={18}/> Daftar Soal
                </button>
                <button onClick={() => setActiveTab('nilai')} className={`relative flex-1 px-6 py-2.5 text-sm font-bold rounded-lg transition-colors z-10 flex items-center justify-center gap-2 ${activeTab === 'nilai' ? 'text-blue-900' : 'text-slate-500 hover:text-slate-700'}`}>
                    {activeTab === 'nilai' && <motion.div layoutId="activeTabEx" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200 z-[-1]" />}
                    <Award size={18}/> Rekap Nilai
                </button>
            </div>

            
            
            
            {activeTab === 'soal' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 relative">
                    
                    {isReordering && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                            <div className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl animate-pulse text-sm">Menyimpan Urutan...</div>
                        </div>
                    )}

                    {questions.length === 0 ? (
                        <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                <Target size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Belum Ada Pertanyaan</h3>
                            <p className="text-sm font-medium text-slate-500 mb-6">Mulai bangun soal latihan untuk menguji pemahaman peserta.</p>
                            <button onClick={() => setModal({ show: true, question: null })} className="px-6 py-3 bg-blue-50 text-blue-900 font-bold text-sm rounded-xl hover:bg-blue-100 border border-blue-100 transition-colors">
                                Buat Pertanyaan Pertama
                            </button>
                        </div>
                    ) : (
                        questions.map((q, index) => (
                            <div key={q.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 hover:border-blue-300 transition-colors group">
                                
                                <div className="flex flex-row md:flex-col items-center gap-2 shrink-0 border-b md:border-b-0 border-slate-100 pb-4 md:pb-0">
                                    <button onClick={() => moveQuestion(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-colors"><ArrowUp size={20}/></button>
                                    <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl font-black flex items-center justify-center text-lg border border-blue-100 shadow-sm">{index + 1}</div>
                                    <button onClick={() => moveQuestion(index, 'down')} disabled={index === questions.length - 1} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-colors"><ArrowDown size={20}/></button>
                                </div>
                                
                                
                                <div className="flex-1">
                                    {q.gambar_soal && (
                                        <div className="mb-4 rounded-xl overflow-hidden bg-slate-50 max-w-sm border border-slate-200 shadow-sm p-1">
                                            <img src={`/storage/${q.gambar_soal}`} alt="Gambar Soal" className="w-full h-auto rounded-lg" />
                                        </div>
                                    )}
                                    <h4 className="text-lg font-bold text-slate-800 mb-6 whitespace-pre-wrap leading-relaxed">{q.pertanyaan}</h4>
                                    
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {['a', 'b', 'c', 'd', 'e'].map((opt) => {
                                            const isCorrect = q.jawaban_benar === opt;
                                            return q[`opsi_${opt}`] || q[`gambar_${opt}`] ? (
                                                <div key={opt} className={`flex flex-col gap-3 p-4 rounded-2xl border-2 transition-colors ${isCorrect ? 'border-emerald-400 bg-emerald-50/50 shadow-sm' : 'border-slate-100 bg-slate-50'}`}>
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                            {opt.toUpperCase()}
                                                        </div>
                                                        <span className={`text-sm font-medium ${isCorrect ? 'text-emerald-900' : 'text-slate-600'}`}>{q[`opsi_${opt}`]}</span>
                                                        {isCorrect && <CheckCircle2 size={16} className="text-emerald-500 ml-auto shrink-0 mt-0.5" />}
                                                    </div>
                                                    {q[`gambar_${opt}`] && (
                                                        <div className="mt-2 ml-9 rounded-lg overflow-hidden bg-white border border-slate-200 max-w-32 shadow-sm p-1">
                                                            <img src={`/storage/${q[`gambar_${opt}`]}`} alt={`Opsi ${opt}`} className="w-full h-auto rounded" />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>

                                
                                <div className="shrink-0 flex md:flex-col justify-end md:justify-start gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                    <button onClick={() => setModal({ show: true, question: q })} className="p-2.5 text-slate-400 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors border border-slate-200 shadow-sm" title="Edit Soal"><Edit size={18}/></button>
                                    <button onClick={() => deleteQuestion(q.id)} className="p-2.5 text-slate-400 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors border border-slate-200 shadow-sm" title="Hapus Soal"><Trash2 size={18}/></button>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            )}

            
            
            
            {activeTab === 'nilai' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2"><Award className="text-blue-600"/> Peringkat Peserta</h3>
                    </div>
                    <div className="overflow-x-auto scrollbar-thin">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
                                    <th className="p-5 pl-6 w-16 text-center">Rank</th>
                                    <th className="p-5">Nama Peserta</th>
                                    <th className="p-5 text-center">Benar</th>
                                    <th className="p-5 text-center">Salah</th>
                                    <th className="p-5 text-center">Waktu Submit</th>
                                    <th className="p-5 pr-6 text-right">Nilai Akhir</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {scores.length === 0 ? (
                                    <tr><td colSpan="6" className="p-16 text-center text-slate-400 font-medium text-sm">Belum ada peserta yang menyelesaikan latihan ini.</td></tr>
                                ) : (
                                    scores.map((score, idx) => (
                                        <tr key={score.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5 pl-6 text-center">
                                                <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center font-black text-sm border shadow-sm ${idx === 0 ? 'bg-amber-100 text-amber-700 border-amber-200' : idx === 1 ? 'bg-slate-200 text-slate-700 border-slate-300' : idx === 2 ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <p className="font-bold text-slate-900">{score.user?.name || 'Peserta Dihapus'}</p>
                                                <p className="text-xs font-medium text-slate-500">{score.user?.email}</p>
                                            </td>
                                            <td className="p-5 text-center font-bold text-emerald-600 bg-emerald-50/30">{score.jumlah_benar}</td>
                                            <td className="p-5 text-center font-bold text-rose-500 bg-rose-50/30">{score.total_soal - score.jumlah_benar}</td>
                                            <td className="p-5 text-center text-xs font-medium text-slate-500">
                                                {new Date(score.dikerjakan_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-5 pr-6 text-right">
                                                <span className={`text-2xl font-black ${score.skor >= 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {score.skor}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            
            
            
            <AnimatePresence>
                {settingModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSettingModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col border border-slate-100">
                            
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-900 rounded-lg"><Settings size={20} strokeWidth={2.5} /></div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Pengaturan Kuis</h2>
                                </div>
                                <button onClick={() => setSettingModal(false)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"><X size={20}/></button>
                            </div>

                            <form onSubmit={submitSettings} className="p-6 md:p-8 space-y-6 bg-white">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Judul Latihan</label>
                                    <input type="text" value={formSettings.data.judul} onChange={e => formSettings.setData('judul', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 font-medium text-slate-800 shadow-sm outline-none transition-colors" required />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Lock size={12}/> Password Kuis</label>
                                        <input type="text" value={formSettings.data.password} onChange={e => formSettings.setData('password', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 font-medium text-slate-800 shadow-sm outline-none transition-colors" placeholder="Kosong = Tanpa" />
                                    </div>
                                    <div>
    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
        <Clock size={12}/> Waktu Latihan
    </label>
    <div className="relative flex items-center">
        <input 
            type="number" 
            min="0" // Diubah dari 1 ke 0 agar nilai 0 diizinkan oleh browser
            value={formSettings.data.waktu_menit} 
            onChange={e => {
                // Konversi string ke integer. Jika kosong, default ke 0
                const val = e.target.value === '' ? '' : parseInt(e.target.value);
                formSettings.setData('waktu_menit', val);
            }} 
            className="w-full pl-4 pr-24 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 font-bold text-slate-800 text-left shadow-sm outline-none transition-colors" 
            placeholder="Contoh: 30"
            required 
        />
        {/* Indikator Teks Dinamis di dalam Input */}
        <div className="absolute right-3 pointer-events-none select-none">
            {parseInt(formSettings.data.waktu_menit) === 0 ? (
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Tanpa Batas
                </span>
            ) : (
                <span className="text-xs font-bold text-slate-400 mr-1">
                    Menit
                </span>
            )}
        </div>
    </div>
    {/* Info Text Tambahan */}
    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
        <strong className="text-slate-600">0</strong> soal tidak dibatasi waktu.
    </p>
    {formSettings.errors.waktu_menit && (
        <div className="text-rose-500 text-xs font-semibold mt-1">{formSettings.errors.waktu_menit}</div>
    )}
</div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Deskripsi Kuis</label>
                                    <textarea value={formSettings.data.deskripsi} onChange={e => formSettings.setData('deskripsi', e.target.value)} rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 font-medium text-slate-800 shadow-sm outline-none transition-colors resize-none" placeholder="Opsional..."></textarea>
                                </div>

                                <label className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 cursor-pointer transition-colors">
                                    <input type="checkbox" checked={formSettings.data.is_active} onChange={e => formSettings.setData('is_active', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Status Aktif Kuis</p>
                                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Jika dimatikan, member tidak akan bisa mengerjakan kuis ini.</p>
                                    </div>
                                </label>

                                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                    <button type="button" onClick={() => setSettingModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">Batal</button>
                                    <button type="submit" disabled={formSettings.processing} className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-md disabled:opacity-70 text-sm">
                                        Simpan Pengaturan
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {modal.show && (
                    <QuestionModal show={modal.show} onClose={() => setModal({ show: false, question: null })} exerciseId={exercise.id} question={modal.question} />
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}