import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react'; // 🛠️ PERBAIKAN: Tambahkan import Head di sini
import AdminLayout from '@/Layouts/AdminLayout'; 
import { LogOut, Monitor, ShieldCheck, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SessionIndex({ auth, activeSessions }) { // 🛠️ PERBAIKAN: Tangkap data auth dari backend
    // State Kontrol Custom Pop-up
    const [modal, setModal] = useState({ show: false, hashedId: null, userName: null });
    const [toast, setToast] = useState({ show: false, message: '' });

    const openConfirmModal = (hashedId, userName) => {
        setModal({ show: true, hashedId, userName });
    };

    const closeConfirmModal = () => {
        setModal({ show: false, hashedId: null, userName: null });
    };

    const executeKickSession = () => {
        if (!modal.hashedId) return;

        router.delete(route('admin.sessions.destroy', modal.hashedId), {
            preserveScroll: true,
            onSuccess: () => {
                closeConfirmModal();
                setToast({ show: true, message: 'Sesi login berhasil dihapus dari sistem!' });
                setTimeout(() => setToast({ show: false, message: '' }), 4000);
            }
        });
    };

    return (
        <AdminLayout user={auth?.user}> {/* 🛠️ PERBAIKAN: Oper data user agar avatar/nama admin di sidebar tidak kosong */}
            
            {/* 🛠️ SINKRONISASI: Judul tab browser menggunakan komponen Head Inertia */}
            <Head title="Sesi Login Aktif" />

            <div className="p-6 max-w-7xl mx-auto relative">
                
                {/* 🔔 1. TOAST NOTIFIKASI SUKSES (REPLACE WINDOW.ALERT) */}
                <AnimatePresence>
                    {toast.show && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className="fixed top-6 right-6 z-[999] flex items-center gap-3 px-5 py-4 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl shadow-xl shadow-emerald-950/20"
                        >
                            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                            <span className="text-sm font-bold tracking-tight">{toast.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* HEADER LAYOUT */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Sesi Login</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Pantau pengguna yang sedang aktif dan bersihkan sesi yang menggantung/error tanpa buka database.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-100">
                        <ShieldCheck size={16} /> Total Sesi Aktif: {activeSessions?.length || 0}
                    </div>
                </div>

                {/* TABEL DATA SESI */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengguna</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Perangkat / OS</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat IP</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktivitas Terakhir</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                                {!activeSessions || activeSessions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-slate-400 italic">
                                            Tidak ada sesi pengguna aktif yang terdeteksi.
                                        </td>
                                    </tr>
                                ) : (
                                    activeSessions.map((session, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">{session.name}</div>
                                                <div className="text-xs text-slate-400 font-normal">{session.email}</div>
                                                <span className={`inline-block text-[9px] font-black px-2 py-0.5 mt-1 uppercase tracking-wider rounded-md ${session.role === 'admin' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                                    {session.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Monitor size={16} className="text-slate-400" />
                                                    <span className="font-bold">{session.device}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-normal max-w-xs truncate" title={session.user_agent}>
                                                    {session.user_agent}
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-xs text-slate-600">
                                                {session.ip_address}
                                            </td>
                                            <td className="p-4 text-xs text-slate-500">
                                                {session.last_active_human}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => openConfirmModal(session.hashed_id, session.name)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100 active:scale-95 transition-all"
                                                >
                                                    <LogOut size={14} /> Kick
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🛡️ 2. CUSTOM CONFIRMATION POP-UP (REPLACE WINDOW.CONFIRM) */}
                <AnimatePresence>
                    {modal.show && (
                        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
                            
                            {/* Backdrop Blur Layer */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={closeConfirmModal}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            />

                            {/* Modal Box */}
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                                className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 overflow-hidden flex flex-col items-center text-center"
                            >
                                <div className="w-14 h-14 bg-rose-50 border border-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                    <ShieldAlert size={28} />
                                </div>

                                <h3 className="text-lg font-black text-slate-800 tracking-tight">Konfirmasi Putus Sesi</h3>
                                <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                                    Apakah Anda yakin ingin mengeluarkan <span className="font-bold text-slate-800">{modal.userName}</span> secara paksa? Sesi login perangkat aktif bersangkutan akan langsung kedaluwarsa.
                                </p>

                                <div className="grid grid-cols-2 gap-3 w-full mt-6">
                                    <button
                                        type="button"
                                        onClick={closeConfirmModal}
                                        className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-colors"
                                    >
                                        Batalkan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={executeKickSession}
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-rose-600/20 active:scale-95"
                                    >
                                        <LogOut size={16} /> Keluar Paksa
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </AdminLayout>
    );
}