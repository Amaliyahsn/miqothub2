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

            {/* Header Section - Responsif Mobiles */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Users className="text-blue-900 shrink-0" size={28} sm={32} /> Manajemen Member
                    </h1>
                    <p className="text-slate-500 mt-1 font-semibold text-xs sm:text-sm">Kelola akses, verifikasi, dan data member.</p>
                </div>
                <button 
                    onClick={() => setCreateModal(true)} 
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 active:scale-95 w-full md:w-auto text-xs sm:text-sm"
                >
                    <UserPlus size={16} strokeWidth={2.5} /> Tambah Member Manual
                </button>
            </div>

            {/* Tabs & Search - Diperbaiki layoutnya agar tidak tumpang tindih */}
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mb-6">
                {/* Pembungkus geser tab khusus mobile */}
                <div className="w-full xl:w-auto overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                    <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 min-w-max">
                        {[
                            { id: 'aktif', label: 'Member Aktif', icon: <UserCheck size={16} />, count: counts.aktif, color: 'text-blue-900' },
                            { id: 'registrasi', label: 'Registrasi Baru', icon: <UserPlus size={16} />, count: counts.registrasi, color: 'text-violet-900' },
                            { id: 'pembelian', label: 'Pembelian Paket', icon: <ShoppingCart size={16} />, count: counts.pembelian, color: 'text-sky-900' },
                            { id: 'ditolak', label: 'Ditolak', icon: <ShieldAlert size={16} />, count: counts.ditolak, color: 'text-rose-900' }
                        ].map((tab) => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)} 
                                className={`relative whitespace-nowrap px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors z-10 flex items-center gap-1.5 ${activeTab === tab.id ? tab.color : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div layoutId="tabBg" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200 z-[-1]" />
                                )}
                                {tab.icon} {tab.label}
                                <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-slate-100' : 'bg-slate-200 text-slate-500'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Pencarian Otomatis */}
                <div className="relative w-full xl:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Cari nama atau email..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all outline-none"
                    />
                </div>
            </div>

            {/* Flash Message */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl font-bold flex items-center gap-3 text-xs sm:text-sm shadow-sm">
                        <CheckCircle size={18} className="text-emerald-600 shrink-0" /> {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Perbaikan Mutlak: Tampilan Kartu di Mobile & Tampilan Tabel di Desktop */}
            <div className="block">
                
                {/* 📱 1. TAMPILAN KHUSUS MOBILE (Hanya muncul di layar HP / < sm) */}
                <div className="sm:hidden space-y-4">
                    {filteredMembers.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-400 text-xs font-semibold">
                            Tidak ada data member yang ditemukan.
                        </div>
                    ) : (
                        filteredMembers.map((member, index) => {
                            const activeCourses = member.transactions?.filter(t => t.status === 'verified').flatMap(t => t.courses || []) || [];
                            const pendingTrx = member.transactions?.find(t => t.status === 'pending' || t.status === 'rejected');
                            const displayCourses = pendingTrx?.courses || [];

                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    key={member.id}
                                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4"
                                >
                                    {/* Baris Atas: Foto & Nama */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                            {member.foto_profile ? (
                                                <img src={`/storage/${member.foto_profile}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-slate-400 text-xs">{member.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-black text-slate-900 text-sm truncate">{member.name}</h4>
                                            <p className="text-xs text-slate-500 truncate">{member.email}</p>
                                        </div>
                                        
                                        {/* Status Akun/Bayar Pojok Kanan Atas */}
                                        <div className="shrink-0">
                                            {activeTab === 'aktif' ? (
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-md border border-emerald-200/50">AKTIF</span>
                                            ) : (
                                                <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border ${pendingTrx?.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                                    {pendingTrx?.status === 'rejected' ? 'DITOLAK' : 'MENUNGGU'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Baris Tengah: Info Kelas */}
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">
                                            {activeTab === 'aktif' ? 'Kelas Diikuti' : 'Paket Pengajuan'}
                                        </span>
                                        <p className="font-bold text-slate-700 truncate">
                                            {activeTab === 'aktif' 
                                                ? (activeCourses[0]?.nama || '-') 
                                                : (displayCourses[0]?.nama || 'Manual Input')
                                            }
                                            {activeTab === 'aktif' && activeCourses.length > 1 && (
                                                <span className="ml-1.5 bg-blue-50 text-blue-600 px-1 rounded font-black text-[9px]">+{activeCourses.length - 1}</span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Baris Bawah: Tombol-Tombol Aksi (Gampang Diklik Jari) */}
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                        <span className="text-[10px] font-medium text-slate-400 font-mono">ID: #{member.id}</span>
                                        
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => setViewModal({ isOpen: true, member })} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all" title="Detail"><Eye size={16}/></button>
                                            
                                            {activeTab === 'aktif' ? (
                                                <>
                                                    <button onClick={() => setEnrollModal({ isOpen: true, member })} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all" title="Akses Kelas"><Layers size={16}/></button>
                                                    <button onClick={() => setEditModal({ isOpen: true, member })} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all" title="Edit"><Edit size={16}/></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => triggerConfirm('verify', member)} 
                                                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all"
                                                        title={member.status_akun === 'suspen' ? "Unreject" : "Verifikasi"}
                                                    >
                                                        <CheckCircle size={16}/>
                                                    </button>
                                                    {pendingTrx?.status !== 'rejected' && (
                                                        <button 
                                                            onClick={() => triggerConfirm('reject', member)} 
                                                            className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-all"
                                                            title="Tolak"
                                                        >
                                                            <XCircle size={16}/>
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            <button onClick={() => triggerConfirm('delete', member)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all" title="Hapus"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* 💻 2. TAMPILAN KHUSUS DESKTOP (Otomatis muncul di Layar Laptop / >= sm) */}
                <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="w-full overflow-x-auto scrollbar-thin">
                        <table className="w-full text-left border-collapse whitespace-nowrap table-auto">
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
                                    <th className="p-6 text-right pr-6">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredMembers.map((member, index) => {
                                    const activeCourses = member.transactions?.filter(t => t.status === 'verified').flatMap(t => t.courses || []) || [];
                                    const pendingTrx = member.transactions?.find(t => t.status === 'pending' || t.status === 'rejected');
                                    const displayCourses = pendingTrx?.courses || [];

                                    return (
                                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                                        {member.foto_profile ? (
                                                            <img src={`/storage/${member.foto_profile}`} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="font-bold text-slate-400 text-sm">{member.name.charAt(0)}</span>
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
                                                        <p className="text-sm font-bold text-slate-700 truncate max-w-[260px]">
                                                            {activeCourses[0]?.nama || '-'}
                                                            {activeCourses.length > 1 && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black">+{activeCourses.length - 1}</span>}
                                                        </p>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/50">AKTIF</span>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="p-6 text-sm font-bold text-slate-700">
                                                        <p className="truncate max-w-[260px]">{displayCourses[0]?.nama || 'Manual Input'}</p>
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

                                            <td className="p-6 text-right pr-6">
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => setViewModal({ isOpen: true, member })} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Eye size={17}/></button>
                                                    {activeTab === 'aktif' ? (
                                                        <>
                                                            <button onClick={() => setEnrollModal({ isOpen: true, member })} className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600"><Layers size={17}/></button>
                                                            <button onClick={() => setEditModal({ isOpen: true, member })} className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600"><Edit size={17}/></button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => triggerConfirm('verify', member)} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600" title="Verifikasi"><CheckCircle size={17}/></button>
                                                            {pendingTrx?.status !== 'rejected' && (
                                                                <button onClick={() => triggerConfirm('reject', member)} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600" title="Tolak"><XCircle size={17}/></button>
                                                            )}
                                                        </>
                                                    )}
                                                    <button onClick={() => triggerConfirm('delete', member)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600"><Trash2 size={17}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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
    {confirmModal.isOpen && confirmModal.type === 'verify' && (() => {
        // 1. Cari data member aktif berdasarkan ID konfirmasi
        const currentMember = members.find(m => m.id === confirmModal.id);
        
        // 2. Cek apakah ini pendaftaran akun baru tanpa transaksi awal
        const isNewAccountRegistration = currentMember?.status_akun === 'pending';

        // 3. Ambil data transaksi yang statusnya pending atau rejected (jika ada)
        const activeTrx = currentMember?.transactions?.find(
            t => t.status === 'pending' || t.status === 'rejected'
        );

        // KONDISI A: Jika akun baru DAN tidak punya data transaksi paket sama sekali
        if (isNewAccountRegistration && (!activeTrx || !activeTrx.courses || activeTrx.courses.length === 0)) {
            return (
                <div className="mt-4 p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-left w-full flex items-start gap-3">
                    <div className="p-2 bg-blue-500 text-white rounded-lg text-xs font-black shrink-0">
                        INFO
                    </div>
                    <div>
                        <p className="text-xs font-bold text-blue-950">Registrasi Akun Baru</p>
                        <p className="text-[11px] text-blue-700/90 font-medium mt-0.5 leading-relaxed">
                            User ini murni mendaftar akun ke dalam platform MiqotHub dan tidak ada tagihan pembayaran paket kelas saat ini.
                        </p>
                    </div>
                </div>
            );
        }

        // KONDISI B: Jika ada transaksi paket kelas (Pembelian paket atau registrasi + langsung beli paket)
        if (activeTrx && activeTrx.courses && activeTrx.courses.length > 0) {
            return (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-left w-full">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                        Item & Nominal Tagihan (Database):
                    </p>
                    <div className="space-y-2">
                        {activeTrx.courses.map(c => {
                            // Ambil harga coret/promo jika ada di database, kalau tidak ada pakai harga normal
                            const hargaFinal = c.harga_coret || c.harga;

                            return (
                                <div key={c.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200/70 shadow-sm">
                                    <div className="max-w-[65%]">
                                        <span className="text-xs font-bold text-slate-800 block truncate">
                                            {c.nama}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            Paket Pembelajaran
                                        </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-sm font-black text-emerald-600">
                                            {formatRupiah(hargaFinal)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        // Jalur aman terakhir jika tidak masuk ke kondisi mana pun
        return null;
    })()}
</ConfirmModal>
        </AdminLayout>
    );
}