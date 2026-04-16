import { Link } from '@inertiajs/react';
// TAMBAHAN: Jangan lupa import icon TrendingUp di sini
import { LayoutDashboard, Users, BookOpen, Settings, X, ShieldCheck, TrendingUp } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
    // Menu Admin
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, route: 'dashboard', active: route().current('dashboard') },
        
        // TAMBAHAN: Menu Laporan Keuangan dimasukkan ke dalam array ini
        { name: 'Laporan Keuangan', icon: <TrendingUp size={20} />, route: 'admin.finance.index', active: route().current('admin.finance.*') },
        
        { name: 'Manajemen Admin', icon: <ShieldCheck size={20} />, route: 'admin.management.index', active: route().current('admin.management.*') },
        { name: 'Manejemen Member', icon: <Users size={20} />, route: 'admin.members.index', active: route().current('admin.members.*') },
        { name: 'Manajemen Kelas', icon: <BookOpen size={20} />, route: 'admin.courses.index', active: route().current('admin.courses.*') },
        { name: 'Konfigurasi', icon: <Settings size={20} />, route: 'admin.settings.index', active: route().current('admin.settings.*') },
    ];

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 z-20 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2.5 text-2xl font-black tracking-tighter text-slate-900">
                        <div className="p-2 bg-blue-900 rounded-lg text-white shadow-md shadow-blue-900/20">
                            <BookOpen size={20} strokeWidth={2.5} />
                        </div>
                        Miqot<span className="text-blue-900">Admin</span>
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1.5 mt-2">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Utama</p>
                    
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            // Kita pakai operator chaining (?.) berjaga-jaga jika ada rute yang belum terdaftar di web.php
                            href={item.route === '#' ? '#' : route(item.route)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-semibold text-sm ${
                                item.active 
                                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-900 border border-transparent'
                            }`}
                        >
                            <span className={`${item.active ? 'text-white' : 'text-slate-400 group-hover:text-blue-800'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}