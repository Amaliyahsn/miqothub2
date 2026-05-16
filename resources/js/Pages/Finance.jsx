import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Wallet, ArrowUpRight, Calendar, CalendarDays, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Finance({ auth, keuangan, chartData }) {
    
    // Fungsi untuk format angka ke Rupiah standar (Untuk kotak-kotak di atas & Tooltip)
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number || 0);
    };

    // Fungsi khusus Y-Axis agar angkanya ringkas (Contoh: Rp 1 jt, Rp 100 rb)
    const formatYAxisRingkas = (number) => {
        if (number === 0) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            notation: 'compact', // Fitur ajaib untuk menyingkat angka besar
            maximumFractionDigits: 1
        }).format(number);
    };

    // Card Rekap Keuangan
    const financeStats = [
        { title: 'Pendapatan Hari Ini', value: formatRupiah(keuangan?.hari_ini), icon: <Wallet size={22} />, bg: 'bg-amber-50', text: 'text-amber-600' },
        { title: 'Minggu Ini', value: formatRupiah(keuangan?.minggu_ini), icon: <CalendarDays size={22} />, bg: 'bg-blue-50', text: 'text-blue-600' },
        { title: 'Bulan Ini', value: formatRupiah(keuangan?.bulan_ini), icon: <Calendar size={22} />, bg: 'bg-indigo-50', text: 'text-indigo-600' },
        { title: 'Tahun Ini', value: formatRupiah(keuangan?.tahun_ini), icon: <ArrowUpRight size={22} />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    ];

    return (
        <AdminLayout user={auth.user}>
            <Head title="Laporan Keuangan" />

            {/* Header Section - Responsif Text */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <TrendingUp className="text-emerald-500 shrink-0" size={24} /> Laporan Keuangan
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Rekapitulasi pendapatan penjualan kelas.</p>
            </div>

            {/* Deretan Rekap Angka di Atas - Adaptif Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {financeStats.map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-5">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${item.bg} ${item.text}`}>
                            {item.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-gray-400 truncate">{item.title}</p>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 tracking-tight truncate">{item.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Grafik Pemasukan di Bawah - Penyelarasan Padding Mobile */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-6 sm:mb-8 pb-4 border-b border-gray-50">
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">Grafik Pemasukan</h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Tren penjualan 7 hari terakhir</p>
                    </div>
                </div>
                
                {/* Tinggi grafik dibuat otomatis responsif (h-64 di HP, h-96 di laptop) */}
                <div className="h-64 sm:h-96 w-full text-xs font-medium">
                    <ResponsiveContainer width="100%" height="100%">
                        {/* Margin left diubah menjadi 20 agar label Rp tidak terpotong */}
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                            
                            {/* Width ditambahkan & tickFormatter memanggil fungsi pintar kita */}
                            <YAxis 
                                width={65} 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 11, fill: '#64748b' }} 
                                tickFormatter={formatYAxisRingkas} 
                            />
                            
                            <Tooltip 
                                formatter={(value) => [formatRupiah(value), "Pendapatan"]}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="pendapatan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPendapatan)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AdminLayout>
    );
}