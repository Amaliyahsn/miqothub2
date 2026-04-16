import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Users, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ auth, statsData, recentMembers }) {
    // Menggunakan data dari database (statsData), dengan fallback '0' jika data kosong
    const stats = [
        { title: 'Total Member', value: statsData?.totalMember || '0', icon: <Users size={24} />, color: 'bg-blue-500' },
        { title: 'Modul Aktif', value: statsData?.modulAktif || '0', icon: <FileText size={24} />, color: 'bg-emerald-500' },
        { title: 'Lulus Ujian', value: statsData?.lulusUjian || '0', icon: <CheckCircle size={24} />, color: 'bg-teal-500' },
        { title: 'Tingkat Kelulusan', value: statsData?.tingkatKelulusan || '0%', icon: <TrendingUp size={24} />, color: 'bg-indigo-500' },
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Dashboard Admin" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Statistik</h1>
                <p className="text-gray-500 mt-1">Selamat datang kembali, {auth.user.name}. Berikut ringkasan sistem hari ini.</p>
            </div>

            {/* Menampilkan Widget Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div 
                        key={index}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5"
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Menampilkan Tabel Pendaftar Terbaru */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Pendaftar Member Terbaru</h2>
                    <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Lihat Semua</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="pb-3 font-medium">Nama Member</th>
                                <th className="pb-3 font-medium">Pekerjaan</th>
                                <th className="pb-3 font-medium">Tanggal Daftar</th>
                                <th className="pb-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            
                            {/* Cek apakah data recentMembers ada dan tidak kosong */}
                            {recentMembers && recentMembers.length > 0 ? (
                                recentMembers.map((member) => (
                                    <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Menampilkan inisial huruf pertama nama di avatar */}
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-gray-600">{member.pekerjaan}</td>
                                        <td className="py-4 text-gray-600">{member.tanggal_daftar}</td>
                                        <td className="py-4">
                                            {/* Pewarnaan badge status dinamis menggunakan kata "Aktif" */}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                member.status === 'Aktif' 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {member.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                /* Tampilan jika belum ada member yang mendaftar */
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">
                                        Belum ada pendaftar terbaru saat ini.
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}