import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    CheckCircle2, 
    Calendar, 
    Star, 
    BookOpen, 
    ArrowRight,
    Sparkles 
} from "lucide-react";
import { Link } from "@inertiajs/react";

const CourseDetailModal = ({ isOpen, onClose, course }) => {
    if (!course) return null;

    // Helper: Format Mata Uang
    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);

    // Parsing fitur dari JSON string jika perlu
    let fiturList = [];
    try {
        fiturList = typeof course.fitur === "string" 
            ? JSON.parse(course.fitur) 
            : Array.isArray(course.fitur) ? course.fitur : [];
    } catch (e) {
        fiturList = [];
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Background Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-md"
                    />

                    {/* Konten Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
                    >
                        {/* Header Image (Optional) */}
                        <div className="relative h-40 sm:h-56 bg-blue-900">
                            {course.thumbnail_url ? (
                                <img 
                                    src={course.thumbnail_url} 
                                    className="w-full h-full object-cover opacity-60" 
                                    alt={course.nama} 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Sparkles className="text-white/20 w-20 h-20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                            
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/20"
                            >
                                <X size={20} />
                            </button>

                            <div className="absolute bottom-6 left-8">
                                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg">
                                    Batch {course.batch}
                                </span>
                            </div>
                        </div>

                        {/* Konten Utama */}
                        <div className="p-8 sm:p-10 pt-2">
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
                                {course.nama}
                            </h2>
                            
                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <Star className="text-yellow-500" size={18} />
                                    <span className="text-sm font-bold text-slate-700 underline decoration-blue-200">Program Unggulan</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <Calendar className="text-blue-600" size={18} />
                                    <span className="text-sm font-bold text-slate-700">Akses Selamanya</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Kiri: Deskripsi */}
                                <div>
                                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
                                        Tentang Program
                                    </h4>
                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        {course.deskripsi || "Pelajari kurikulum mendalam yang dirancang untuk membekali Anda dengan keterampilan profesional dalam industri ini."}
                                    </p>
                                    
                                    <div className="p-5 bg-blue-50 rounded-[1.5rem] border border-blue-100">
                                        <p className="text-xs font-bold text-blue-800 mb-1">Investasi Pendidikan</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-blue-900">{formatRupiah(course.harga)}</span>
                                            {course.harga_coret > 0 && (
                                                <span className="text-sm text-slate-400 line-through">{formatRupiah(course.harga_coret)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Kanan: Fitur */}
                                <div>
                                    <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
                                        Apa yang akan Anda dapatkan?
                                    </h4>
                                    <ul className="space-y-4">
                                        {fiturList.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1 bg-blue-100 rounded-full p-1 shrink-0">
                                                    <CheckCircle2 size={14} className="text-blue-600" />
                                                </div>
                                                <span className="text-sm text-slate-700 font-medium leading-tight">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Footer Tombol */}
                            <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 px-6 border-2 border-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                                >
                                    Tutup
                                </button>
                                <Link
                                    href={route('register')}
                                    className="flex-[2] py-4 px-6 bg-gradient-to-r from-blue-950 to-blue-800 text-white text-center rounded-2xl font-bold hover:shadow-2xl hover:shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                                >
                                    Daftar Sekarang
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CourseDetailModal;