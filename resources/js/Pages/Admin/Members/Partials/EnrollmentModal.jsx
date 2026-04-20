import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react'; // Ganti BookOpen ke GraduationCap
import { useForm, router } from '@inertiajs/react';
import { useMemo } from 'react';

export default function EnrollmentModal({ isOpen, onClose, member, allCourses = [] }) {
    // Hooks harus di paling atas agar selalu terpanggil
    const { data, setData, post, processing, reset } = useForm({ 
        course_id: '' 
    });

    const activeCourses = useMemo(() => {
        if (!member?.transactions) return [];
        let courses = [];
        member.transactions.forEach(trx => {
            if ((trx.status === 'verified' || trx.status === 'success') && trx.courses) {
                trx.courses.forEach(course => {
                    if (!courses.find(ac => ac.id === course.id)) {
                        courses.push({ 
                            ...course, 
                            enrollment_date: trx.updated_at || trx.created_at 
                        });
                    }
                });
            }
        });
        return courses;
    }, [member?.transactions]);

    const availableCourses = useMemo(() => {
        return (allCourses || []).filter(c => 
            !activeCourses.find(ac => ac.id === c.id)
        );
    }, [allCourses, activeCourses]);

    // Return null dipindahkan ke bawah Hooks
    if (!member) return null;

    const handleEnroll = (e) => {
        e.preventDefault();
        if (!data.course_id) return;

        post(route('admin.members.enroll', member.id), {
            preserveScroll: true, 
            onSuccess: () => { reset('course_id'); }
        });
    };

    const handleUnenroll = (courseId, courseName) => {
        if (confirm(`Yakin ingin mencabut akses member ini dari kelas: ${courseName}?`)) {
            router.delete(route('admin.members.unenroll', { member: member.id, course: courseId }), {
                preserveScroll: true 
            });
        }
    };

    const getExpiryDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            date.setFullYear(date.getFullYear() + 1); 
            return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) { return '-'; }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose} 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" 
                    />
                    
                    <motion.main 
                        key="enrollment-modal-main"
                        initial={{ scale: 0.95, opacity: 0, y: 15 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                                    <GraduationCap size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1.5">Kelola Akses Kelas</h2>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Atur kelas untuk: <span className="font-bold text-blue-600">{member.name}</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                                <X size={20}/>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto scrollbar-thin bg-white">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                Kelas Aktif Saat Ini ({activeCourses.length})
                            </h3>
                            
                            <div className="space-y-3 mb-8">
                                {activeCourses.length === 0 ? (
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
                                        <GraduationCap size={32} className="text-slate-300 mb-2" />
                                        <p className="text-sm font-medium text-slate-500">Member ini belum memiliki akses ke kelas manapun.</p>
                                    </div>
                                ) : (
                                    activeCourses.map(course => (
                                        <div key={`active-course-${course.id}`} className="flex justify-between items-center p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 transition-colors group shadow-sm">
                                            <div className="flex-1 pr-4">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight group-hover:text-blue-700 transition-colors">
                                                        {course.nama || course.name}
                                                    </h4>
                                                    {course.batch && (
                                                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100/50 border border-blue-200/50 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                                                            Batch {course.batch}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 mt-2">
                                                    <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100/50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                                        <CheckCircle2 size={12} strokeWidth={3}/> Aktif
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock size={12}/> Berlaku hingga: {getExpiryDate(course.enrollment_date)}
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleUnenroll(course.id, (course.nama || course.name))} 
                                                className="shrink-0 p-2.5 sm:px-4 sm:py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                <Trash2 size={16}/> 
                                                <span className="hidden sm:block">Cabut Akses</span>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add New Enrollment */}
                            <div className="border-t border-slate-100 pt-8 mt-4">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Tambahkan ke Kelas Baru</h3>
                                <form onSubmit={handleEnroll} className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <select 
                                            value={data.course_id} 
                                            onChange={e => setData('course_id', e.target.value)} 
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3.5 px-4 text-sm font-semibold outline-none transition-colors cursor-pointer appearance-none shadow-sm" 
                                            required
                                        >
                                            <option value="" disabled>-- Pilih Kelas yang Tersedia --</option>
                                            {availableCourses.map(c => (
                                                <option key={`available-course-${c.id}`} value={c.id}>
                                                    {c.nama || c.name} {c.batch ? `(Batch ${c.batch})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Plus size={16} />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={!data.course_id || processing} 
                                        className="px-6 py-3.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md shrink-0 text-sm"
                                    >
                                        {processing ? 'Memproses...' : (
                                            <>
                                                <Plus size={18} strokeWidth={2.5}/> Masukkan Kelas
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.main>
                </div>
            )}
        </AnimatePresence>
    );
}