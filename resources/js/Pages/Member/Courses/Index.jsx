import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PlayCircle, BookOpen, Compass, Sparkles, MessageCircle, AlertCircle, Clock } from 'lucide-react';

export default function Index({ auth, myCourses = [] }) {
    return (
        <MemberLayout user={auth.user}>
            <Head title="Kelas Saya" />

            {/* --- HEADER --- */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-blue-950 tracking-tight flex items-center gap-2">
                        <Sparkles size={24} className="text-blue-600" /> Kelas Saya
                    </h1>
                    <p className="text-slate-500 mt-1.5 text-sm font-semibold">
                        Lanjutkan proses belajar dan persiapkan ibadah Anda dengan maksimal.
                    </p>
                </div>
            </div>

            {myCourses.length === 0 ? (
                // --- EMPTY STATE ---
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-12 lg:p-20 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10">
                        <Compass size={40} className="text-blue-700" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 relative z-10">Anda belum mengikuti kelas apapun</h3>
                    <p className="text-slate-500 mt-3 mb-8 max-w-md text-sm font-medium leading-relaxed relative z-10">
                        Mulai perjalanan belajar Anda dengan mendaftar program bimbingan yang kami sediakan di katalog.
                    </p>
                    <Link 
                        href={route('member.catalog')}
                        className="px-8 py-3.5 bg-blue-950 text-white text-sm font-black rounded-xl hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-blue-950/20 hover:-translate-y-1 relative z-10"
                    >
                        Eksplorasi Katalog Kelas
                    </Link>
                </motion.div>
            ) : (
                // --- GRID KELAS ---
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {myCourses.map((course, index) => {
                        // Logika cek expired (Client-side fallback jika data dari controller belum ada)
                        const isExpired = course.is_expired || (course.tanggal_selesai ? new Date(course.tanggal_selesai) < new Date() : false);

                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: index * 0.1 }} 
                                key={course.id} 
                                className={`bg-white rounded-[1.5rem] p-3.5 shadow-sm border border-slate-100 flex flex-col hover:shadow-2xl hover:shadow-blue-950/10 hover:-translate-y-1.5 transition-all duration-500 group relative ${isExpired ? 'grayscale-[0.4]' : ''}`}
                            >
                                {/* Thumbnail Area */}
                                <div className="h-52 bg-slate-100 rounded-[1.25rem] relative overflow-hidden mb-4 group-hover:shadow-inner transition-all">
                                    {course.thumbnail_url ? (
                                        <img 
                                            src={course.thumbnail_url} 
                                            alt={course.nama} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                                            <BookOpen size={48} strokeWidth={1} />
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Badge Batch & Expired */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                        <span className="w-fit px-3 py-1.5 bg-white/95 text-blue-950 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                                            Batch {course.batch}
                                        </span>
                                        {isExpired && (
                                            <span className="w-fit px-3 py-1.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md flex items-center gap-1.5">
                                                <Clock size={12} /> Masa Aktif Habis
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="px-2 pb-1 flex-1 flex flex-col">
                                    <h3 className={`text-lg font-black leading-snug mb-3 line-clamp-2 transition-colors ${isExpired ? 'text-slate-500' : 'text-slate-800 group-hover:text-blue-900'}`}>
                                        {course.nama}
                                    </h3>
                                    
                                    {course.deskripsi && (
                                        <p className="text-xs font-medium text-slate-500 line-clamp-2 mb-4">
                                            {course.deskripsi}
                                        </p>
                                    )}
                                    
                                    {/* Action Buttons */}
                                    <div className="mt-auto pt-4 border-t border-slate-100/80 flex flex-col gap-2.5">
                                        {isExpired ? (
                                            <div className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-400 rounded-xl text-sm font-bold border border-slate-200 cursor-not-allowed">
                                                <AlertCircle size={18} /> Akses Berakhir
                                            </div>
                                        ) : (
                                            <Link 
                                                href={route('member.courses.show', course.id)} 
                                                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-950 text-white rounded-xl text-sm font-bold hover:bg-blue-900 hover:shadow-lg hover:shadow-blue-950/20 transition-all duration-300 group/btn"
                                            >
                                                <PlayCircle size={18} className="text-blue-300 group-hover/btn:text-white transition-colors group-hover/btn:scale-110" /> 
                                                Mulai Belajar
                                            </Link>
                                        )}

                                        {course.link_grup_wa && (
                                            <a 
                                                href={course.link_grup_wa} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm group/wa ${
                                                    isExpired 
                                                    ? 'bg-slate-50 text-slate-400 border border-slate-200 opacity-60' 
                                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                                                }`}
                                            >
                                                <MessageCircle size={18} className={`${isExpired ? 'text-slate-400' : 'text-emerald-600 group-hover/wa:text-white'} transition-colors`} />
                                                Gabung Grup WA
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </MemberLayout>
    );
}