import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { 
    CheckCircle, XCircle, Trash2, Eye, ShieldAlert, Edit, 
    Clock, AlertTriangle, UserPlus, BookOpen, Search, Users, 
    UserCheck, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';


import ConfirmModal from './Partials/ConfirmModal';
import ViewMemberModal from './Partials/ViewMemberModal';
import EnrollmentModal from './Partials/EnrollmentModal';
import CreateMemberModal from './Partials/CreateMemberModal';
import EditMemberModal from './Partials/EditMemberModal';

export default function Index({ auth, members, allCourses }) {
    const { flash = {} } = usePage().props;
    
    
    const [activeTab, setActiveTab] = useState('aktif'); 
    const [searchQuery, setSearchQuery] = useState('');
    
    
    const [viewModal, setViewModal] = useState({ isOpen: false, member: null });
    const [editModal, setEditModal] = useState({ isOpen: false, member: null });
    const [createModal, setCreateModal] = useState(false);
    const [enrollModal, setEnrollModal] = useState({ isOpen: false, member: null });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', id: null, title: '', message: '', icon: null, color: '' });
    
    const [processingAction, setProcessingAction] = useState(false);
    const [verifyCourseIds, setVerifyCourseIds] = useState([]);

    
    const filteredMembers = useMemo(() => {
        const tabFiltered = members.filter(m => {
            const hasPendingTransaction = m.transactions?.some(t => t.status === 'pending');
            
            if (activeTab === 'aktif') return m.status_akun === 'aktif'; 
            if (activeTab === 'registrasi') return m.status_akun === 'pending'; 
            if (activeTab === 'pembelian') return m.status_akun === 'aktif' && hasPendingTransaction; 
            return false;
        });

        if (!searchQuery) return tabFiltered;
        return tabFiltered.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            m.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [members, activeTab, searchQuery]);

    
    const activeCount = members.filter(m => m.status_akun === 'aktif').length;
    const registrasiCount = members.filter(m => m.status_akun === 'pending').length;
    const pembelianCount = members.filter(m => m.status_akun === 'aktif' && m.transactions?.some(t => t.status === 'pending')).length;

    
    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    
    const triggerConfirm = (type, member) => {
        let config = {};
        if (type === 'verify') {
            const pendingTrx = member.transactions?.find(t => t.status === 'pending');
            const initialCourses = pendingTrx?.courses.map(c => c.id) || [];
            setVerifyCourseIds(initialCourses);
            
            const isNewAccount = member.status_akun === 'pending';
            config = { 
                title: isNewAccount ? 'Terima Pendaftaran Baru' : 'Konfirmasi Pembelian Paket', 
                message: isNewAccount 
                    ? `Verifikasi pembayaran dan aktifkan akun untuk ${member.name}?` 
                    : `Setujui pengajuan penambahan kelas untuk member aktif ${member.name}?`, 
                icon: <CheckCircle size={32} />, color: 'blue' 
            };
        } else if (type === 'reject') {
            const isNewAccount = member.status_akun === 'pending';
            config = { 
                title: isNewAccount ? 'Tolak Pendaftaran' : 'Tolak Pembelian', 
                message: isNewAccount
                    ? `Tolak pendaftaran ${member.name}? Akun tidak akan diaktifkan.`
                    : `Tolak pengajuan pembelian kelas ini? (Akun member tetap aktif).`, 
                icon: <XCircle size={32} />, color: 'amber' 
            };
        } else if (type === 'delete') {
            config = { title: 'Hapus Permanen', message: `Hapus semua data ${member.name}? Tindakan ini tidak bisa dibatalkan.`, icon: <AlertTriangle size={32} />, color: 'red' };
        }
        setConfirmModal({ isOpen: true, type, id: member.id, ...config });
    };

    const executeAction = () => {
        setProcessingAction(true);
        const { type, id } = confirmModal;
        const options = { 
            onSuccess: () => { setConfirmModal({ ...confirmModal, isOpen: false }); setProcessingAction(false); },
            onError: () => setProcessingAction(false)
        };
        
        if (type === 'verify') router.put(route('admin.members.verify', id), { course_ids: verifyCourseIds }, options);
        else if (type === 'reject') router.put(route('admin.members.reject', id), {}, options);
        else if (type === 'delete') router.delete(route('admin.members.destroy', id), options);
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Member" />

            <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-blue-900" size={32} /> Manajemen Member
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">Kelola data peserta, verifikasi pendaftaran baru, dan pembelian paket.</p>
                </div>
                <button onClick={() => setCreateModal(true)} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 active:scale-95 shrink-0 text-sm">
                    <UserPlus size={18} strokeWidth={2.5} /> Tambah Member Manual
                </button>
            </div>

            
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
                <div className="flex bg-slate-100/80 p-1.5 rounded-xl w-full xl:w-auto relative overflow-x-auto scrollbar-thin border border-slate-200/60">
                    
                    <button onClick={() => setActiveTab('aktif')} className={`relative whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-lg transition-colors z-10 flex items-center gap-2 ${activeTab === 'aktif' ? 'text-blue-900' : 'text-slate-500 hover:text-slate-700'}`}>
                        {activeTab === 'aktif' && <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200 z-[-1]" />}
                        <UserCheck size={18} /> Member Aktif 
                        <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'aktif' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>{activeCount}</span>
                    </button>

                    
                    <button onClick={() => setActiveTab('registrasi')} className={`relative whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-lg transition-colors z-10 flex items-center gap-2 ${activeTab === 'registrasi' ? 'text-violet-900' : 'text-slate-500 hover:text-slate-700'}`}>
                        {activeTab === 'registrasi' && <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200 z-[-1]" />}
                        <UserPlus size={18} /> Registrasi Baru 
                        {registrasiCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>}
                        <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'registrasi' ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-500'}`}>{registrasiCount}</span>
                    </button>

                    
                    <button onClick={() => setActiveTab('pembelian')} className={`relative whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-lg transition-colors z-10 flex items-center gap-2 ${activeTab === 'pembelian' ? 'text-sky-900' : 'text-slate-500 hover:text-slate-700'}`}>
                        {activeTab === 'pembelian' && <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200 z-[-1]" />}
                        <ShoppingCart size={18} /> Pembelian Paket
                        {pembelianCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>}
                        <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'pembelian' ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'}`}>{pembelianCount}</span>
                    </button>
                </div>

                
                <div className="relative w-full xl:w-80 shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" placeholder="Cari nama atau email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-blue-500/20 focus:border-blue-500 shadow-sm outline-none transition-colors"
                    />
                </div>
            </div>

            
            <AnimatePresence>
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl font-bold flex items-center gap-3 text-sm shadow-sm">
                        <ShieldAlert size={20} className="text-blue-600" /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-widest font-black">
                                <th className="p-6">Identitas Peserta</th>
                                {activeTab === 'aktif' && <><th className="p-6">Akses Kelas Dimiliki</th><th className="p-6">Status / Masa Aktif</th></>}
                                {activeTab === 'registrasi' && <><th className="p-6">Kelas Dipilih</th><th className="p-6 text-center">Status Pendaftaran</th></>}
                                {activeTab === 'pembelian' && <><th className="p-6">Pengajuan Kelas Baru</th><th className="p-6 text-center">Info Tagihan</th></>}
                                <th className="p-6 text-right">Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredMembers.map((member, index) => {
                                const activeCourses = [];
                                member.transactions?.filter(t => t.status === 'verified').forEach(t => t.courses?.forEach(c => activeCourses.push({...c})));
                                const pendingTrx = member.transactions?.find(t => t.status === 'pending');
                                const pendingCourses = pendingTrx?.courses || [];
                                
                                return (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                                        
                                        
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                {member.foto_profile ? (
                                                    <img 
                                                        src={`/storage/${member.foto_profile}`} 
                                                        alt={member.name} 
                                                        className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" 
                                                    />
                                                ) : (
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-sm border border-white transition-all duration-300 ${activeTab === 'aktif' ? 'bg-blue-50 text-blue-600' : activeTab === 'registrasi' ? 'bg-violet-50 text-violet-600' : 'bg-sky-50 text-sky-600'}`}>
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-sm">{member.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        
                                        {activeTab === 'aktif' && (
                                            <>
                                                <td className="p-6">
                                                    {activeCourses.length > 0 ? (
                                                        <div className="space-y-1.5">
                                                            <p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{activeCourses[0].nama}</p>
                                                            {activeCourses.length > 1 && <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">+ {activeCourses.length - 1} Kelas Lainnya</span>}
                                                        </div>
                                                    ) : <span className="text-xs font-bold text-slate-400 italic">Tidak ada akses kelas</span>}
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="w-fit px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200/50">AKTIF</span>
                                                        {activeCourses.length > 0 && <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-wider"><Clock size={12} className="text-emerald-500" /> Cek di Kelola Akses</span>}
                                                    </div>
                                                </td>
                                            </>
                                        )}

                                        
                                        {activeTab === 'registrasi' && (
                                            <>
                                                <td className="p-6">
                                                    {pendingCourses.length > 0 ? (
                                                        <div className="space-y-1.5"><p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{pendingCourses[0].nama}</p>{pendingCourses.length > 1 && <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">+ {pendingCourses.length - 1} Lainnya</span>}</div>
                                                    ) : <span className="text-xs text-slate-400 italic">-</span>}
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shadow-sm"><Clock size={14} className="animate-pulse" /><span className="text-[10px] font-black uppercase tracking-widest">Cek Pembayaran</span></div>
                                                </td>
                                            </>
                                        )}

                                        
                                        {activeTab === 'pembelian' && (
                                            <>
                                                <td className="p-6">
                                                    {pendingCourses.length > 0 && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                                                                <BookOpen size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{pendingCourses[0].nama}</p>
                                                                {pendingCourses.length > 1 && <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">+ {pendingCourses.length - 1} Paket</span>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <p className="text-sm font-black text-slate-900">{formatRupiah(pendingTrx?.total_harga || 0)}</p>
                                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-widest">INV: {pendingTrx?.kode_transaksi.split('-')[1]}</span>
                                                    </div>
                                                </td>
                                            </>
                                        )}

                                        
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setViewModal({ isOpen: true, member })} title="Lihat Bukti Pembayaran / Detail" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"><Eye size={18} /></button>
                                                
                                                {activeTab === 'aktif' ? (
                                                    <>
                                                        <button onClick={() => setEnrollModal({ isOpen: true, member })} title="Kelola Akses Kelas" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"><BookOpen size={18} /></button>
                                                        <button onClick={() => setEditModal({ isOpen: true, member })} title="Edit Profil" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"><Edit size={18} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => triggerConfirm('verify', member)} title={activeTab === 'pembelian' ? "Setujui Pembelian Kelas" : "Terima & Aktifkan Akun"} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"><CheckCircle size={18} /></button>
                                                        <button onClick={() => triggerConfirm('reject', member)} title="Tolak" className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"><XCircle size={18} /></button>
                                                    </>
                                                )}
                                                {activeTab === 'aktif' && <button onClick={() => triggerConfirm('delete', member)} title="Hapus Permanen" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"><Trash2 size={18} /></button>}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {filteredMembers.length === 0 && <tr><td colSpan="5" className="p-16 text-center"><Users size={40} className="text-slate-300 mb-3 mx-auto" /><p className="text-slate-500 font-semibold text-sm">Tidak ditemukan data dalam kategori ini.</p></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            
            <ViewMemberModal isOpen={viewModal.isOpen} onClose={() => setViewModal({ isOpen: false, member: null })} member={viewModal.member} />
            <EnrollmentModal 
                isOpen={enrollModal.isOpen} 
                onClose={() => setEnrollModal({ isOpen: false, member: null })} 
                member={members.find(m => m.id === enrollModal.member?.id) || enrollModal.member} 
                allCourses={allCourses} 
            />
            <CreateMemberModal isOpen={createModal} onClose={() => setCreateModal(false)} />
            <EditMemberModal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, member: null })} member={editModal.member} />

<ConfirmModal 
    isOpen={confirmModal.isOpen} 
    onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
    onConfirm={executeAction} 
    title={confirmModal.title} 
    message={confirmModal.message} 
    icon={confirmModal.icon} 
    color={confirmModal.color} 
    isProcessing={processingAction}
>
    {confirmModal.type === 'verify' && (
        <div className="space-y-3 border-t border-slate-100 pt-5 mt-3 max-h-56 overflow-y-auto scrollbar-thin">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Paket Kelas yang akan Diaktifkan:
            </p>
            
            {/* PERBAIKAN: Cari member yang sedang di-klik, lalu ambil courses dari transaksi pendingnya */}
            {members.find(m => m.id === confirmModal.id)?.transactions?.find(t => t.status === 'pending')?.courses.map(course => (
                <div 
                    key={course.id} 
                    className="flex items-start gap-3 p-3.5 rounded-xl border bg-blue-50 border-blue-200 shadow-sm"
                >
                    {/* Checkbox dipaksa tercentang dan tidak bisa diubah (readOnly) */}
                    <input 
                        type="checkbox" 
                        checked={true} 
                        readOnly
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500/20 w-4 h-4 border-slate-300 cursor-default"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-bold leading-tight mb-1 text-blue-900">
                            {course.nama}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                            Batch {course.batch} • {formatRupiah(course.harga)}
                        </p>
                    </div>
                </div>
            ))}

            {/* Pesan jika tidak ada transaksi pending ditemukan */}
            {(!members.find(m => m.id === confirmModal.id)?.transactions?.find(t => t.status === 'pending')) && (
                <p className="text-xs text-center text-slate-400 italic py-4">
                    Data transaksi tidak ditemukan.
                </p>
            )}
        </div>
    )}
</ConfirmModal>
        </AdminLayout>
    );
}