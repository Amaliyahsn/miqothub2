import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, ShieldAlert, Calendar, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AdminModal from './Partials/AdminModal';

export default function Index({ auth, admins }) {
    const { flash = {} } = usePage().props; 
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedAdmin(null);
        setIsModalOpen(true);
    };

    const openEditModal = (admin) => {
        setIsEditMode(true);
        setSelectedAdmin(admin);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
            router.delete(route('admin.management.destroy', id));
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Admin" />

            {/* Header Section - Adaptif Mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Manajemen Admin</h1>
                    <p className="text-slate-500 mt-1 text-xs sm:text-sm font-semibold">Kelola data administrator sistem dengan mudah.</p>
                </div>
                <button 
                    onClick={openCreateModal} 
                    className="flex items-center justify-center gap-2 bg-blue-900 text-white px-5 py-3 sm:py-2.5 rounded-xl font-bold hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 transition-all active:scale-95 text-xs sm:text-sm w-full sm:w-auto uppercase tracking-wider sm:normal-case sm:tracking-normal"
                >
                    <Plus size={16} strokeWidth={2.5} /> Tambah Admin
                </button>
            </div>

            {/* Flash Message */}
            <AnimatePresence>
                {flash?.success && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-3 shadow-sm"
                    >
                        <div className="w-8 h-8 bg-blue-200/50 rounded-full flex items-center justify-center text-blue-900 shrink-0">
                            <ShieldAlert size={16} />
                        </div>
                        {flash.success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🔥 PERBAIKAN RESPONSIVE: Stacked Cards di Mobile & Rapi Table di Desktop */}
            <div className="block">
                
                {/* 📱 1. TAMPILAN RESMI SMARTPHONE / MOBILE (< sm) */}
                <div className="block sm:hidden space-y-4">
                    {admins.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-slate-400 text-xs font-semibold">
                            Belum ada administrator yang terdaftar.
                        </div>
                    ) : (
                        admins.map((admin, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                                key={admin.id}
                                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
                            >
                                <div className="flex items-center gap-3.5">
                                    {admin.foto_url ? (
                                        <img src={admin.foto_url} alt={admin.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-900 border border-blue-800 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                                            {admin.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-black text-slate-800 text-sm truncate">{admin.name}</h4>
                                        <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-50 text-blue-900 uppercase tracking-widest border border-blue-200/60">
                                            <ShieldAlert size={9} /> Admin Utama
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2 font-semibold">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Mail size={13} className="text-slate-400 shrink-0" />
                                        <span className="truncate">{admin.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Calendar size={13} className="text-slate-400 shrink-0" />
                                        <span>Terdaftar: {new Date(admin.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 font-mono">ID: #{admin.id}</span>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => openEditModal(admin)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl transition-all" title="Edit Admin">
                                            <Edit size={16} />
                                        </button>
                                        {auth.user.id !== admin.id && (
                                            <button onClick={() => handleDelete(admin.id)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all" title="Hapus Admin">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* 💻 2. TAMPILAN RESMI LAPTOP / DESKTOP (>= sm) */}
                <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="w-full overflow-x-auto scrollbar-thin">
                        <table className="w-full text-left border-collapse whitespace-nowrap table-auto">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-widest font-black">
                                    <th className="p-5">Profil Admin</th>
                                    <th className="p-5">Email</th>
                                    <th className="p-5">Tgl. Terdaftar</th>
                                    <th className="p-5 text-right pr-6">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                {admin.foto_url ? (
                                                    <img src={admin.foto_url} alt={admin.name} className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-full bg-blue-900 border border-blue-800 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                                                        {admin.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-slate-800 group-hover:text-blue-900 transition-colors text-sm">{admin.name}</p>
                                                    <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-900 uppercase tracking-widest border border-blue-200">
                                                        <ShieldAlert size={10} /> Admin Utama
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-slate-600 text-sm font-medium">{admin.email}</td>
                                        <td className="p-5 text-slate-500 text-sm font-medium">
                                            {new Date(admin.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-5 text-right pr-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEditModal(admin)} className="p-2 text-slate-400 hover:bg-blue-100 hover:text-blue-900 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="Edit Admin">
                                                    <Edit size={17} />
                                                </button>
                                                {auth.user.id !== admin.id && (
                                                    <button onClick={() => handleDelete(admin.id)} className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100" title="Hapus Admin">
                                                        <Trash2 size={17} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Modal Components */}
            <AdminModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                isEditMode={isEditMode} 
                admin={selectedAdmin} 
            />
        </AdminLayout>
    );
}