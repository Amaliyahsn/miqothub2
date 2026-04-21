import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { 
    CheckCircle, XCircle, Trash2, Eye, ShieldAlert, Edit, 
    Clock, AlertTriangle, UserPlus, Search, Users, 
    UserCheck, ShoppingCart, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';

import ConfirmModal from './Partials/ConfirmModal';
import ViewMemberModal from './Partials/ViewMemberModal';
import EnrollmentModal from './Partials/EnrollmentModal';
import CreateMemberModal from './Partials/CreateMemberModal';
import EditMemberModal from './Partials/EditMemberModal';

export default function Index({ auth, members = [], allCourses = [] }) {
    // Mengambil flash message secara reaktif dari props
    const { flash } = usePage().props;
    
    const [activeTab, setActiveTab] = useState('aktif'); 
    const [searchQuery, setSearchQuery] = useState('');
    
    // State Modal
    const [viewModal, setViewModal] = useState({ isOpen: false, member: null });
    const [editModal, setEditModal] = useState({ isOpen: false, member: null });
    const [createModal, setCreateModal] = useState(false);
    const [enrollModal, setEnrollModal] = useState({ isOpen: false, member: null });
    const [confirmModal, setConfirmModal] = useState({ 
        isOpen: false, type: '', id: null, title: '', message: '', icon: null, color: '' 
    });
    
    const [processingAction, setProcessingAction] = useState(false);

    // Auto-hide flash message (Optional but good for UX)
    const [showFlash, setShowFlash] = useState(false);
    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Logic Filter Member
    const filteredMembers = useMemo(() => {
        const tabFiltered = members.filter(m => {
            const hasPendingOrRejected = m.transactions?.some(t => t.status === 'pending' || t.status === 'rejected');
            
            if (activeTab === 'aktif') return m.status_akun === 'aktif';
            if (activeTab === 'registrasi') return m.status_akun === 'pending';
            if (activeTab === 'pembelian') return m.status_akun === 'aktif' && hasPendingOrRejected;
            // PERBAIKAN: Menambahkan kondisi untuk tab ditolak (berdasarkan status akun suspen dari Controller)
            if (activeTab === 'ditolak') return m.status_akun === 'suspen'; 
            return false;
        });

        if (!searchQuery) return tabFiltered;
        const query = searchQuery.toLowerCase();
        return tabFiltered.filter(m => 
            m.name?.toLowerCase().includes(query) || 
            m.email?.toLowerCase().includes(query)
        );
    }, [members, activeTab, searchQuery]);

    // Badge Counts
    const counts = useMemo(() => ({
        aktif: members.filter(m => m.status_akun === 'aktif').length,
        registrasi: members.filter(m => m.status_akun === 'pending').length,
        pembelian: members.filter(m => m.status_akun === 'aktif' && m.transactions?.some(t => t.status === 'pending' || t.status === 'rejected')).length,
        // PERBAIKAN: Hitung jumlah data yang ditolak
        ditolak: members.filter(m => m.status_akun === 'suspen').length 
    }), [members]);

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { 
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
    }).format(angka);

    const triggerConfirm = (type, member) => {
        let config = {};
        const isNewAccount = member.status_akun === 'pending';
        const isSuspended = member.status_akun === 'suspen'; // Mendeteksi akun yang ditolak

        if (type === 'verify') {
            config = { 
                // PERBAIKAN: Label judul menyesuaikan apakah akun sedang ditolak (unreject) atau pending
                title: isSuspended ? 'Terima Kembali (Unreject)' : (isNewAccount ? 'Terima Pendaftaran' : 'Verifikasi Pembayaran'), 
                message: isSuspended 
                    ? `Batalkan penolakan dan konfirmasi ulang pengajuan dari ${member.name}? Akun akan diaktifkan kembali.` 
                    : `Konfirmasi pembayaran untuk ${member.name}? Sistem akan mengirimkan email notifikasi otomatis.`, 
                icon: <CheckCircle size={32} />, color: 'emerald' 
            };
        } else if (type === 'reject') {
            config = { 
                title: isNewAccount ? 'Tolak Pendaftaran' : 'Tolak Pembelian', 
                message: `Tolak pengajuan dari ${member.name}? Status transaksi akan berubah menjadi rejected.`, 
                icon: <XCircle size={32} />, color: 'amber' 
            };
        } else if (type === 'delete') {
            config = { 
                title: 'Hapus Member', 
                message: `Hapus permanen data ${member.name}? Semua riwayat transaksi akan ikut terhapus.`, 
                icon: <AlertTriangle size={32} />, color: 'rose' 
            };
        }
        setConfirmModal({ isOpen: true, type, id: member.id, ...config });
    };

    const executeAction = () => {
        setProcessingAction(true);
        const { type, id } = confirmModal;
        
        const options = { 
            preserveScroll: true,
            onSuccess: () => { 
                setConfirmModal(prev => ({ ...prev, isOpen: false })); 
                setProcessingAction(false); 
            },
            onError: () => setProcessingAction(false),
            onFinish: () => setProcessingAction(false)
        };
        
        if (type === 'verify') router.put(route('admin.members.verify', id), {}, options);
        else if (type === 'reject') router.put(route('admin.members.reject', id), {}, options);
        else if (type === 'delete') router.delete(route('admin.members.destroy', id), options);
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Member" />

            {/* Header Section */}
            <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-blue-900" size={32} /> Manajemen Member
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">Kelola akses, verifikasi, dan data peserta pelatihan.</p>
                </div>
                <button 
                    onClick={() => setCreateModal(true)} 
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95 shrink-0 text-sm"
                >
                    <UserPlus size={18} strokeWidth={2.5} /> Tambah Member Manual
                </button>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
                <div className="flex bg-slate-100/80 p-1.5 rounded-xl w-full xl:w-auto overflow-x-auto border border-slate-200/60">
                    {[
                        { id: 'aktif', label: 'Member Aktif', icon: <UserCheck size={18} />, count: counts.aktif, color: 'text-blue-900' },
                        { id: 'registrasi', label: 'Registrasi Baru', icon: <UserPlus size={18} />, count: counts.registrasi, color: 'text-violet-900' },
                        { id: 'pembelian', label: 'Pembelian Paket', icon: <ShoppingCart size={18} />, count: counts.pembelian, color: 'text-sky-900' },
                        // PERBAIKAN: Menambahkan Tab Ditolak 
                        { id: 'ditolak', label: 'Ditolak', icon: <ShieldAlert size={18} />, count: counts.ditolak, color: 'text-rose-900' }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)} 
                            className={`relative whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-lg transition-colors z-10 flex items-center gap-2 ${activeTab === tab.id ? tab.color : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {activeTab === tab.id && (
                                <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200 z-[-1]" />
                            )}
                            {tab.icon} {tab.label}
                            <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-slate-100' : 'bg-slate-200 text-slate-500'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="relative w-full xl:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari nama atau email..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all outline-none"
                    />
                </div>
            </div>

            {/* Flash Message */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl font-bold flex items-center gap-3 text-sm shadow-sm">
                        <CheckCircle size={20} className="text-emerald-600" /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-widest font-black">
                                <th className="p-6">Identitas Peserta</th>
                                {activeTab === 'aktif' ? (
                                    <>
                                        <th className="p-6">Kelas Diikuti</th>
                                        <th className="p-6">Status</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="p-6">Paket Pengajuan</th>
                                        <th className="p-6 text-center">Status Bayar</th>
                                    </>
                                )}
                                <th className="p-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredMembers.map((member, index) => {
                                const activeCourses = member.transactions?.filter(t => t.status === 'verified').flatMap(t => t.courses || []) || [];
                                const pendingTrx = member.transactions?.find(t => t.status === 'pending' || t.status === 'rejected');
                                const displayCourses = pendingTrx?.courses || [];

                                return (
                                    <motion.tr 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                                        transition={{ delay: index * 0.02 }} key={member.id} 
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                                    {member.foto_profile ? (
                                                        <img src={`/storage/${member.foto_profile}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="font-bold text-slate-400">{member.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                                                    <p className="text-xs text-slate-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {activeTab === 'aktif' ? (
                                            <>
                                                <td className="p-6">
                                                    <p className="text-sm font-bold text-slate-700">
                                                        {activeCourses[0]?.nama || '-'}
                                                        {activeCourses.length > 1 && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">+{activeCourses.length - 1}</span>}
                                                    </p>
                                                </td>
                                                <td className="p-6">
                                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/50">AKTIF</span>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-6 text-sm font-bold text-slate-700">
                                                    {displayCourses[0]?.nama || 'Manual Input'}
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border ${
                                                        pendingTrx?.status === 'rejected' 
                                                        ? 'bg-rose-50 text-rose-700 border-rose-100' 
                                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                        {pendingTrx?.status === 'rejected' ? 'DITOLAK' : 'MENUNGGU'}
                                                    </span>
                                                </td>
                                            </>
                                        )}

                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => setViewModal({ isOpen: true, member })} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Eye size={17}/></button>
                                                
                                                {activeTab === 'aktif' ? (
                                                    <>
                                                        <button onClick={() => setEnrollModal({ isOpen: true, member })} className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600"><Layers size={17}/></button>
                                                        <button onClick={() => setEditModal({ isOpen: true, member })} className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600"><Edit size={17}/></button>
                                                    </>
                                                ) : (
                                                    // PERBAIKAN: Tombol Verify (centang) akan selalu muncul (untuk konfirmasi atau "Unreject").
                                                    // Sedangkan tombol Reject (silang) otomatis sembunyi jika statusnya memang sudah ditolak.
                                                    <>
                                                        <button 
                                                            onClick={() => triggerConfirm('verify', member)} 
                                                            className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600"
                                                            title={member.status_akun === 'suspen' ? "Unreject (Terima Kembali)" : "Verifikasi"}
                                                        >
                                                            <CheckCircle size={17}/>
                                                        </button>
                                                        {pendingTrx?.status !== 'rejected' && (
                                                            <button 
                                                                onClick={() => triggerConfirm('reject', member)} 
                                                                className="p-2 hover:bg-amber-50 rounded-lg text-amber-600"
                                                                title="Tolak"
                                                            >
                                                                <XCircle size={17}/>
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                <button onClick={() => triggerConfirm('delete', member)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600"><Trash2 size={17}/></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Components */}
            <ViewMemberModal 
                isOpen={viewModal.isOpen} 
                onClose={() => setViewModal({ isOpen: false, member: null })} 
                member={viewModal.member} 
            />
            
            <EnrollmentModal 
                isOpen={enrollModal.isOpen} 
                onClose={() => setEnrollModal({ isOpen: false, member: null })} 
                member={members.find(m => m.id === enrollModal.member?.id) || null} 
                allCourses={allCourses} 
            />

            <CreateMemberModal 
                isOpen={createModal} 
                onClose={() => setCreateModal(false)} 
                allCourses={allCourses}
            />

            <EditMemberModal 
                isOpen={editModal.isOpen} 
                onClose={() => setEditModal({ isOpen: false, member: null })} 
                member={editModal.member} 
                allCourses={allCourses} 
            />

            <ConfirmModal 
                {...confirmModal}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                onConfirm={executeAction} 
                isProcessing={processingAction}
                iconColor={confirmModal.color}
            >
                {confirmModal.isOpen && confirmModal.type === 'verify' && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Item Transaksi:</p>
                        {members.find(m => m.id === confirmModal.id)?.transactions?.find(t => t.status === 'pending' || t.status === 'rejected')?.courses?.map(c => (
                            <div key={c.id} className="text-sm font-bold text-blue-900 flex justify-between">
                                <span>{c.nama}</span>
                                <span>{formatRupiah(c.harga)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </ConfirmModal>
        </AdminLayout>
    );
}