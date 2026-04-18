import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Users, Edit, Trash2, BookOpen, Layers, ArrowRight, Clock } from 'lucide-react';

export default function CourseCard({ course, index, onEdit, onDelete, formatRupiah, onShowMembers }) {
    // 1. Cek apakah sudah melewati tanggal selesai (Expired)
    const isExpired = course.tanggal_selesai ? new Date(course.tanggal_selesai) < new Date() : false;
    
    // Hitung jumlah member yang sudah diverifikasi di kelas ini
    const enrolledCount = course.transactions ? course.transactions.length : 0;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.1 }} 
            // 2. Tambahkan filter grayscale dan opacity kalau sudah expired
            className={`relative bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-blue-950/20 hover:-translate-y-2 transition-all duration-500 ${
                isExpired ? 'grayscale-[0.5] opacity-90' : ''
            }`}
        >
            
            <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                
                {course.thumbnail_url ? (
                    <img 
                        src={course.thumbnail_url} 
                        alt={course.nama} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <BookOpen size={64} strokeWidth={1} />
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* --- BAGIAN STATUS BADGE YANG DIPERBAIKI --- */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-white/20 text-white backdrop-blur-md rounded-lg border border-white/20 shadow-sm">
                        Batch {course.batch}
                    </span>
                    
                    {/* Logika Badge: Cek Expired Dulu, Baru Cek Status Onsale */}
                    <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg backdrop-blur-md border shadow-sm flex items-center gap-1.5 ${
                        isExpired 
                        ? 'bg-rose-500/30 text-white border-rose-400/40' 
                        : course.status === 'onsale' 
                            ? 'bg-emerald-500/30 text-white border-emerald-400/40' 
                            : 'bg-rose-500/30 text-white border-rose-400/40'
                    }`}>
                        {isExpired ? (
                            <><Clock size={12} /> Sesi Berakhir</>
                        ) : (
                            course.status === 'onsale' ? 'Pendaftaran Buka' : 'Ditutup'
                        )}
                    </span>
                </div>
                {/* ------------------------------------------ */}

                <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <h3 className="text-xl font-black mb-1.5 line-clamp-2 leading-snug drop-shadow-md group-hover:text-blue-100 transition-colors">
                        {course.nama}
                    </h3>
                    <div className="flex items-end gap-3">
                        <span className="text-2xl font-black text-blue-300 drop-shadow-sm leading-none">
                            {formatRupiah(course.harga)}
                        </span>
                        {course.harga_coret > 0 && (
                            <span className="text-sm font-bold text-slate-300/60 line-through mb-0.5">
                                {formatRupiah(course.harga_coret)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col p-5 bg-white relative z-20 rounded-t-[1.5rem] -mt-3">
                <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-900 shrink-0">
                            <Calendar size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Mulai Kelas</p>
                            <p className="text-xs font-black text-slate-800">
                                {course.tanggal_mulai ? new Date(course.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBA'}
                            </p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-200"></div>

                    <div 
                        onClick={() => onShowMembers(course)}
                        className="flex items-center gap-3 cursor-pointer group/quota p-1.5 -mr-1.5 rounded-2xl hover:bg-slate-50 transition-colors"
                        title="Klik untuk melihat peserta"
                    >
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 flex items-center justify-end gap-1">
                                Peserta <ArrowRight size={10} className="opacity-0 group-hover/quota:opacity-100 -translate-x-1 group-hover/quota:translate-x-0 transition-all text-blue-700"/>
                            </p>
                            <p className="text-xs font-bold text-slate-500">
                                <span className={`text-sm font-black ${enrolledCount > 0 ? 'text-blue-950' : 'text-slate-800'}`}>{enrolledCount}</span> / {course.kuota || '∞'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-900 shrink-0 group-hover/quota:bg-blue-950 group-hover/quota:border-blue-950 group-hover/quota:text-white transition-all shadow-sm">
                            <Users size={16} />
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN TOMBOL --- */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-200 border-dashed">
                    <Link 
                        href={route('admin.courses.curriculum', course.id)} 
                        className="flex-1 py-3 bg-blue-950 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-900 hover:shadow-lg hover:shadow-blue-950/25 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Layers size={16} /> Kelola Materi
                    </Link>
                    
                    <button 
                        onClick={() => onEdit(course)} 
                        className="p-3 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all shadow-sm" 
                        title="Edit Kelas"
                    >
                        <Edit size={16} />
                    </button>
                    
                    <button 
                        onClick={() => onDelete(course.id)} 
                        className="p-3 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-all shadow-sm" 
                        title="Hapus Kelas"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}