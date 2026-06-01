import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Wallet, ArrowUpRight, Calendar, CalendarDays, TrendingUp, Filter, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Finance({ auth, keuangan, chartData, filters }) {
    
    // Sinkronisasi state agar input tanggal selalu sama dengan data yang baru di-load
    const [dateRange, setDateRange] = useState({
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || ''
    });

    useEffect(() => {
        if (filters) {
            setDateRange({
                start_date: filters.start_date || '',
                end_date: filters.end_date || ''
            });
        }
    }, [filters]);

    // Fungsi format angka
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number || 0);
    };

    const formatYAxisRingkas = (number) => {
        if (number === 0) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            notation: 'compact', 
            maximumFractionDigits: 1
        }).format(number);
    };

    // Helper untuk menjaga zona waktu lokal
    const getLocalDateString = (date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().split('T')[0];
    };

    const financeStats = [
        { title: 'Pendapatan Hari Ini', value: formatRupiah(keuangan?.hari_ini), icon: <Wallet size={22} />, bg: 'bg-amber-50', text: 'text-amber-600' },
        { title: 'Minggu Ini', value: formatRupiah(keuangan?.minggu_ini), icon: <CalendarDays size={22} />, bg: 'bg-blue-50', text: 'text-blue-600' },
        { title: 'Bulan Ini', value: formatRupiah(keuangan?.bulan_ini), icon: <Calendar size={22} />, bg: 'bg-indigo-50', text: 'text-indigo-600' },
        { title: 'Tahun Ini', value: formatRupiah(keuangan?.tahun_ini), icon: <ArrowUpRight size={22} />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    ];

    // Eksekusi Pencarian Manual
    const handleFilter = (e) => {
        e.preventDefault();
        router.get(window.location.pathname, dateRange, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Eksekusi Prasetel Pintar (Tombol Pintasan)
    const setPreset = (preset) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        if (preset === '7days') {
            start.setDate(today.getDate() - 6);
        } else if (preset === 'this_month') {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (preset === 'last_month') {
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
        } else if (preset === 'this_year') {
            start = new Date(today.getFullYear(), 0, 1);
        }

        const startStr = getLocalDateString(start);
        const endStr = getLocalDateString(end);

        setDateRange({ start_date: startStr, end_date: endStr });

        router.get(window.location.pathname, { start_date: startStr, end_date: endStr }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Laporan Keuangan" />

            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <TrendingUp className="text-emerald-500 shrink-0" size={24} /> Laporan Keuangan
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Rekapitulasi pendapatan penjualan kelas.</p>
            </div>

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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                            <Filter size={18} className="text-gray-400" /> Analisis Pendapatan
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                            Total pada rentang terpilih: <span className="font-bold text-emerald-600">{formatRupiah(filters?.total_filtered)}</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setPreset('7days')} className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">7 Hari</button>
                            <button onClick={() => setPreset('this_month')} className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">Bulan Ini</button>
                            <button onClick={() => setPreset('last_month')} className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">Bulan Lalu</button>
                            <button onClick={() => setPreset('this_year')} className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">Tahun Ini</button>
                        </div>

                        <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

                        <form onSubmit={handleFilter} className="flex items-center gap-2 w-full sm:w-auto">
                            <input 
                                type="date" 
                                value={dateRange.start_date}
                                onChange={e => setDateRange({...dateRange, start_date: e.target.value})}
                                className="w-full sm:w-auto text-xs px-3 py-1.5 rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                required
                            />
                            <span className="text-gray-400 text-xs font-bold">-</span>
                            <input 
                                type="date" 
                                value={dateRange.end_date}
                                onChange={e => setDateRange({...dateRange, end_date: e.target.value})}
                                className="w-full sm:w-auto text-xs px-3 py-1.5 rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                required
                            />
                            <button type="submit" className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shrink-0">
                                <Search size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="h-64 sm:h-96 w-full text-xs font-medium">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
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
            </div>
        </AdminLayout>
    );
}