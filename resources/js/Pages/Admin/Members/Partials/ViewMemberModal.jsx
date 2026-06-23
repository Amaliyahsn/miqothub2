import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, User, Heart, Briefcase, MapPin, Receipt, BookOpen, Tag, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

export default function ViewMemberModal({ isOpen, onClose, member }) {
    if (!member) return null;

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    const transaction = member.transactions && member.transactions.length > 0 ? member.transactions[0] : null;
    const courses = transaction?.courses || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                    
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer transition-opacity" />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 15 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                        className="relative z-10 w-full max-w-5xl bg-white flex flex-col lg:flex-row max-h-[85vh] sm:max-h-[90vh] rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Tombol Close Global Pojok Kanan Atas (Universal Desktop & Mobile) */}
                        <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors z-30">
                            <X size={20}/>
                        </button>

                        {/* 🔥 SOLUSI UTAMA: Pembungkus Scroll Utama Gabungan khusus Mobile (Menjadi 2 Kolom di Desktop) */}
                        <div className="w-full h-full overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block">
                            
                            {/* 🏢 BAGIAN 1: Informasi Profil Member (Kiri di Laptop, Atas di HP) */}
                            <div className="w-full lg:w-5/12 bg-slate-50 flex flex-col lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200 shrink-0">
                                <div className="p-5 sm:p-8 pb-5 border-b border-slate-200/60 bg-white relative">
                                    <div className="flex items-center gap-3 sm:gap-4 mb-4 pr-8">
                                        {member.foto_profile ? (
                                            <img src={`/storage/${member.foto_profile}`} alt={member.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                                        ) : (
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-900 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md shrink-0">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="text-base sm:text-xl font-black text-slate-900 leading-tight mb-0.5 sm:mb-1 truncate">{member.name}</h3>
                                            <p className="text-xs sm:text-sm font-semibold text-blue-600 truncate">{member.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-md border flex items-center gap-1 shrink-0 ${member.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : member.status_akun === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                            Status: {member.status_akun}
                                        </span>
                                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 rounded-md border border-slate-200 flex items-center gap-1 uppercase tracking-widest shrink-0">
                                            <CalendarDays size={11} sm={12}/> Daftar: {formatDate(member.created_at)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-5 sm:p-8 space-y-4 sm:space-y-5 flex-1">
                                    <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Informasi Personal</h4>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><User size={12} sm={14}/> Umur</p>
                                            <p className="font-bold text-slate-800 text-xs sm:text-sm">{member.umur ? `${member.umur} Tahun` : '-'}</p>
                                        </div>
                                        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Heart size={12} sm={14}/> Status</p>
                                            <p className="font-bold text-slate-800 capitalize text-xs sm:text-sm">{member.status || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Briefcase size={12} sm={14}/> Pekerjaan</p>
                                        <p className="font-bold text-slate-800 text-xs sm:text-sm">{member.pekerjaan || '-'}</p>
                                    </div>
                                    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-1.5 flex items-center gap-1.5"><MapPin size={12} sm={14}/> Alamat Domisili</p>
                                        <p className="font-bold text-slate-800 leading-relaxed text-xs sm:text-sm">{member.alamat || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 🏢 BAGIAN 2: Detail Pendaftaran & Kelas Gateway (Kanan di Laptop, di Bawah Profil di HP) */}
                            <div className="w-full lg:w-7/12 p-5 sm:p-8 flex flex-col lg:overflow-y-auto bg-white flex-1">
                                <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8 border-b border-slate-100 pb-4 pr-8 lg:pr-0">
                                    <div className="p-1.5 sm:p-2 bg-blue-50 text-blue-900 rounded-lg shrink-0">
                                        <Receipt size={18} sm={20} strokeWidth={2.5}/>
                                    </div>
                                    <h3 className="text-base sm:text-xl font-black text-slate-900">Detail Pendaftaran</h3>
                                </div>

                                {transaction ? (
                                    <div className="space-y-5 sm:space-y-6">
                                        
                                        {/* Panel Informasi Utama Transaksi */}
                                        <div className="bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-5 shadow-lg shadow-slate-900/10 relative overflow-hidden">
                                            <div className="absolute -right-6 -top-6 text-slate-800/50 rotate-12 pointer-events-none hidden sm:block">
                                                <Receipt size={100} />
                                            </div>

                                            <div className="relative z-10 min-w-0">
                                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-1.5 flex items-center gap-1.5">
                                                    <Tag size={11} sm={12} /> Total Pembayaran
                                                </p>
                                                <p className="text-xl sm:text-3xl font-black text-white tracking-tight truncate">{formatRupiah(transaction.total_harga)}</p>
                                                <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-1 sm:mt-1.5 bg-slate-800/50 inline-block px-2 py-0.5 rounded truncate max-w-full">INV: {transaction.kode_transaksi}</p>
                                            </div>
                                            <div className="text-left sm:text-right relative z-10 shrink-0">
                                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">Status Verifikasi</p>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border ${
                                                    transaction.status === 'verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                                                    transaction.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                                                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                                }`}>
                                                    {transaction.status === 'verified' && <CheckCircle2 size={12} sm={14} />}
                                                    {transaction.status === 'pending' && <Clock size={12} sm={14} />}
                                                    {transaction.status === 'rejected' && <AlertCircle size={12} sm={14} />}
                                                    {transaction.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Panel Daftar Kelas */}
                                        <div>
                                            <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-1.5">
                                                <BookOpen size={13} sm={14} className="text-blue-500" /> 
                                                Program Kelas ({courses.length})
                                            </h4>
                                            <div className="space-y-2.5 sm:space-y-3">
                                                {courses.length > 0 ? courses.map(course => {
                                                    // Ambil nilai harga_coret jika bernilai true/ada di dalam objek database
                                                    const hargaFinal = course.harga_coret || course.harga;

                                                    return (
                                                        <div key={course.id} className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center hover:border-blue-200 transition-colors shadow-sm gap-4">
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight mb-1 truncate">{course.nama}</p>
                                                                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">Batch {course.batch}</span>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                {/* Menampilkan nominal yang telah disesuaikan dengan kondisi database */}
                                                                <p className="text-xs sm:text-sm font-black text-slate-900">{formatRupiah(hargaFinal)}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                }) : (
                                                    <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs sm:text-sm font-medium text-slate-500">Data kelas tidak ditemukan.</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Panel Validasi Gateway Midtrans */}
                                        <div>
                                            <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-1.5">
                                                <ShieldCheck size={13} sm={14} className="text-blue-500" /> 
                                                Validasi Gateway Pembayaran (Midtrans)
                                            </h4>
                                            <div className="bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                                <div className="p-2 sm:p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0 shadow-sm border border-emerald-100">
                                                    <ShieldCheck size={24} sm={28} strokeWidth={2.5} />
                                                </div>
                                                <div className="flex-1 space-y-1 min-w-0">
                                                    <p className="text-xs sm:text-sm font-black text-slate-800">Sistem Pembayaran Otomatis Lunas</p>
                                                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                                                        Dana pendaftaran kelas telah divalidasi dan diamankan dengan sukses melalui interkoneksi aman server Midtrans Snap.
                                                    </p>
                                                    <div className="pt-1.5 flex flex-col xs:flex-row xs:flex-wrap gap-x-4 gap-y-0.5 text-[10px] sm:text-xs font-mono text-slate-500">
                                                        <p className="truncate"><span className="font-bold text-slate-400 font-sans">ORDER ID:</span> {transaction.kode_transaksi}</p>
                                                        <p><span className="font-bold text-slate-400 font-sans">METODE:</span> Gateway Otomatis</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 mt-6 p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                        <Receipt size={40} className="mb-3 text-slate-300" />
                                        <p className="font-semibold text-xs sm:text-sm text-center">Belum ada transaksi pendaftaran untuk member ini.</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}