import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Users, FileText, CheckCircle, TrendingUp, Calendar, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react'; 

export default function Dashboard({ auth, statsData, recentMembers }) {
    // State untuk mengatur fitur "Lihat Semua"
    const [showAll, setShowAll] = useState(false);

    // Menggunakan data dari database (statsData), dengan fallback '0' jika data kosong
    const stats = [
        { title: 'Member Aktif', value: statsData?.totalMember || '0', icon: <Users size={22} />, color: 'bg-blue-500' },
        { title: 'Kelas Aktif', value: statsData?.modulAktif || '0', icon: <FileText size={22} />, color: 'bg-emerald-500' },
        { title: 'Lulus Ujian', value: statsData?.lulusUjian || '0', icon: <CheckCircle size={22} />, color: 'bg-teal-500' },
        { title: 'Tingkat Kelulusan', value: statsData?.tingkatKelulusan || '0%', icon: <TrendingUp size={22} />, color: 'bg-indigo-500' },
    ];

    // Potong data menjadi 5 jika showAll bernilai false
    const displayedMembers = showAll ? recentMembers : (recentMembers?.slice(0, 5) || []);

    return (
        <AdminLayout user={auth.user}>
            <Head title="Dashboard Admin" />

            {/* Header Section - Responsif Text */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Dashboard Statistik</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Selamat datang kembali, {auth.user.name}. Berikut ringkasan sistem hari ini.</p>
            </div>

            {/* Menampilkan Widget Statistik - Adaptif Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {stats.map((stat, index) => (
                    <motion.div 
                        key={index}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-5"
                    >
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-gray-400 truncate">{stat.title}</p>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 tracking-tight">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 🔥 PERBAIKAN UTAMA: Area Pendaftar Member Terbaru */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h2 className="text-sm sm:text-lg font-black text-gray-900 tracking-tight">Pendaftar Member Terbaru</h2>
                    {recentMembers && recentMembers.length > 5 && (
                        <button 
                            onClick={() => setShowAll(!showAll)}
                            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1.5 rounded-lg sm:bg-transparent sm:p-0"
                        >
                            {showAll ? 'Sembunyikan' : 'Lihat Semua'}
                        </button>
                    )}
                </div>
                
                {/* 📱 A. TAMPILAN KHUSUS LAYAR HP (Bentuk List Kartu Vertikal yang Elegan) */}
                <div className="block sm:hidden space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {displayedMembers && displayedMembers.length > 0 ? (
                        displayedMembers.map((member) => (
                            <div key={member.id} className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 shadow-sm">
                                            {member.name.charAt(0)}
                                        </div>
                                        <span className="font-black text-gray-900 text-sm truncate">{member.name}</span>
                                    </div>
                                    <span className={`shrink-0 inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-wider ${
                                        member.status === 'Aktif' 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {member.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-gray-500 pt-1.5 border-t border-gray-200/50">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <Briefcase size={12} className="text-gray-400 shrink-0" />
                                        <span className="truncate">{member.pekerjaan || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 min-w-0 justify-end">
                                        <Calendar size={12} className="text-gray-400 shrink-0" />
                                        <span className="truncate">{member.tanggal_daftar}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-xs font-medium text-gray-400">
                            Belum ada pendaftar terbaru saat ini.
                        </div>
                    )}
                </div>

                {/* 💻 B. TAMPILAN KHUSUS DESKTOP (Kembali berbentuk baris tabel resmi saat di laptop) */}
                <div className="hidden sm:block">
                    <div className={`transition-all duration-300 ${showAll ? 'max-h-[400px] overflow-y-auto scrollbar-thin' : ''}`}>
                        <table className="w-full text-left border-collapse whitespace-nowrap table-auto">
                            <thead className={`${showAll ? 'sticky top-0 bg-white shadow-sm z-10' : ''}`}>
                                <tr className="border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-widest font-black pb-3">
                                    <th className="pb-3 pt-2 font-medium">Nama Member</th>
                                    <th className="pb-3 pt-2 font-medium">Pekerjaan</th>
                                    <th className="pb-3 pt-2 font-medium">Tanggal Daftar</th>
                                    <th className="pb-3 pt-2 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
                                {displayedMembers && displayedMembers.length > 0 ? (
                                    displayedMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 uppercase shrink-0">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-gray-900 truncate max-w-xs">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 font-medium">{member.pekerjaan || '-'}</td>
                                            <td className="py-3.5 font-medium">{member.tanggal_daftar}</td>
                                            <td className="py-3.5">
                                                <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase border tracking-wider ${
                                                    member.status === 'Aktif' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-sm font-medium text-gray-400">
                                            Belum ada pendaftar terbaru saat ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}