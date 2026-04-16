import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, User, Heart, Briefcase, MapPin, Receipt, BookOpen, Tag, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function ViewMemberModal({ isOpen, onClose, member }) {
    if (!member) return null;

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    
    const transaction = member.transactions && member.transactions.length > 0 ? member.transactions[0] : null;
    const courses = transaction?.courses || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer transition-opacity" />
                    
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 15 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] shadow-2xl bg-white flex flex-col lg:flex-row max-h-[95vh] border border-slate-100"
                    >
                        
                        
                        
                        <div className="w-full lg:w-5/12 bg-slate-50 flex flex-col overflow-y-auto scrollbar-thin border-r border-slate-200 shrink-0">
                            <div className="p-8 pb-6 border-b border-slate-200/60 bg-white relative shrink-0">
                                <button onClick={onClose} className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"><X size={20}/></button>
                                
                                <div className="flex items-center gap-4 mb-5">
                                    
                                    {member.foto_profile ? (
                                        <img src={`/storage/${member.foto_profile}`} alt={member.name} className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{member.name}</h3>
                                        <p className="text-sm font-semibold text-blue-600">{member.email}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2.5 mt-2">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border flex items-center gap-1 ${member.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : member.status_akun === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                        Status: {member.status_akun}
                                    </span>
                                    <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-md border border-slate-200 flex items-center gap-1.5 uppercase tracking-widest">
                                        <CalendarDays size={12}/> Daftar: {formatDate(member.created_at)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-8 space-y-5 flex-1">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Informasi Personal</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><User size={14}/> Umur</p>
                                        <p className="font-bold text-slate-800 text-sm">{member.umur ? `${member.umur} Tahun` : '-'}</p>
                                    </div>
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Heart size={14}/> Status Kawin</p>
                                        <p className="font-bold text-slate-800 capitalize text-sm">{member.status || '-'}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Briefcase size={14}/> Pekerjaan</p>
                                    <p className="font-bold text-slate-800 text-sm">{member.pekerjaan || '-'}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><MapPin size={14}/> Alamat Domisili</p>
                                    <p className="font-bold text-slate-800 leading-relaxed text-sm">{member.alamat || '-'}</p>
                                </div>
                            </div>
                        </div>

                        
                        
                        
                        <div className="w-full lg:w-7/12 p-8 relative flex flex-col bg-white overflow-y-auto scrollbar-thin">
                            <button onClick={onClose} className="hidden lg:block absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors z-10"><X size={20}/></button>
                            
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                                <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                                    <Receipt size={20} strokeWidth={2.5}/>
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Detail Pendaftaran</h3>
                            </div>

                            {transaction ? (
                                <div className="space-y-6">
                                    
                                    
                                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-5 shadow-lg shadow-slate-900/10 relative overflow-hidden">
                                        
                                        <div className="absolute -right-6 -top-6 text-slate-800/50 rotate-12 pointer-events-none">
                                            <Receipt size={100} />
                                        </div>

                                        <div className="relative z-10">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                <Tag size={12} /> Total Tagihan
                                            </p>
                                            <p className="text-3xl font-black text-white tracking-tight">{formatRupiah(transaction.total_harga)}</p>
                                            <p className="text-[11px] text-slate-400 font-mono mt-1.5 bg-slate-800/50 inline-block px-2 py-0.5 rounded">INV: {transaction.kode_transaksi}</p>
                                        </div>
                                        <div className="text-left sm:text-right relative z-10">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status Bayar</p>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest border ${
                                                transaction.status === 'verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                                                transaction.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                                                'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                            }`}>
                                                {transaction.status === 'verified' && <CheckCircle2 size={14} />}
                                                {transaction.status === 'pending' && <Clock size={14} />}
                                                {transaction.status === 'rejected' && <AlertCircle size={14} />}
                                                {transaction.status}
                                            </span>
                                        </div>
                                    </div>

                                    
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <BookOpen size={14} className="text-blue-500" /> 
                                            Program Kelas yang Dipilih ({courses.length})
                                        </h4>
                                        <div className="space-y-3">
                                            {courses.length > 0 ? courses.map(course => (
                                                <div key={course.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center hover:border-blue-200 transition-colors shadow-sm">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{course.nama}</p>
                                                        <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">Batch {course.batch}</span>
                                                    </div>
                                                    <div className="text-right shrink-0 ml-4">
                                                        <p className="text-sm font-black text-slate-900">{formatRupiah(course.harga)}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-sm font-medium text-slate-500">Data kelas tidak ditemukan.</div>
                                            )}
                                        </div>
                                    </div>

                                    
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Receipt size={14} className="text-blue-500" /> 
                                        Foto Bukti Transfer
                                    </h4>
                                    <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden relative group w-full h-64 flex items-center justify-center transition-colors hover:border-blue-300">
                                        
                                        {/* KONDISI 1: Diinput Manual Oleh Admin */}
                                        {transaction.bukti_url && transaction.bukti_url.includes('Manual') ? (
                                            <div className="text-slate-400 text-center px-4">
                                                <Receipt size={32} className="mx-auto mb-3 opacity-50" />
                                                <p className="text-sm font-semibold text-slate-500">Diinput Manual oleh Admin</p>
                                                <p className="text-xs mt-1">Bukti fisik tidak dilampirkan</p>
                                            </div>

                                        /* KONDISI 2: Ada file gambar struk asli */
                                        ) : transaction.bukti_url ? (
                                            <a href={transaction.bukti_url} target="_blank" rel="noopener noreferrer" className="w-full h-full block" title="Klik untuk memperbesar gambar">
                                                <img 
                                                    src={transaction.bukti_url} 
                                                    alt="Bukti Struk" 
                                                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 cursor-zoom-in" 
                                                />
                                            </a>

                                        /* KONDISI 3: Kosong / Member belum upload */
                                        ) : (
                                            <div className="text-slate-400 text-center px-4">
                                                <Receipt size={32} className="mx-auto mb-2 opacity-50" />
                                                <p className="text-xs font-semibold text-red-400">Foto bukti tidak dilampirkan</p>
                                            </div>
                                        )}

                                    </div>
                                    
                                    {/* Teks bantuan di bawah gambar (Hanya muncul jika kondisi ke-2 terpenuhi) */}
                                    {transaction.bukti_url && !transaction.bukti_url.includes('Manual') && (
                                        <p className="text-[10px] font-medium text-slate-400 mt-2 text-center">
                                            Klik pada gambar untuk melihat ukuran penuh di tab baru.
                                        </p>
                                    )}
                                </div>

                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 mt-10 p-10 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                    <Receipt size={48} className="mb-4 text-slate-300" />
                                    <p className="font-semibold text-sm">Belum ada transaksi pendaftaran untuk member ini.</p>
                                </div>
                            )}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}