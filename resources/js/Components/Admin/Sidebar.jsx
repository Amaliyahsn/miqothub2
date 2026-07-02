import { Link } from '@inertiajs/react';
// Import Newspaper untuk Berita & Kegiatan, serta Activity untuk Sesi Login Aktif
import { LayoutDashboard, Users, BookOpen, Settings, X, ShieldCheck, TrendingUp, Newspaper, Activity } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
    // Menu Admin
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, route: 'admin.dashboard', active: route().current('admin.dashboard') },
        
        { name: 'Laporan Keuangan', icon: <TrendingUp size={20} />, route: 'admin.finance.index', active: route().current('admin.finance.*') },
        
        { name: 'Manajemen Admin', icon: <ShieldCheck size={20} />, route: 'admin.management.index', active: route().current('admin.management.*') },
        { name: 'Manejemen Member', icon: <Users size={20} />, route: 'admin.members.index', active: route().current('admin.members.*') },
        { name: 'Manajemen Kelas', icon: <BookOpen size={20} />, route: 'admin.courses.index', active: route().current('admin.courses.*') },
        
        // MENU BARU: Berita & Kegiatan
        { name: 'Berita & Kegiatan', icon: <Newspaper size={20} />, route: 'admin.posts.index', active: route().current('admin.posts.*') },
        
        // MENU MANAJEMEN SESI: Sesi Login Aktif
        { name: 'Sesi Login Aktif', icon: <Activity size={20} />, route: 'admin.sessions.index', active: route().current('admin.sessions.*') },
        
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
                    <Link href="/" className="flex items-center gap-3 text-2xl font-black text-slate-800 tracking-tight">
                        <div className="p-2 bg-blue-700 rounded-lg text-white shadow-md shadow-blue-900/20">
                            <BookOpen size={20} strokeWidth={2.5} />
                        </div>
                        Miqot<span className="text-blue-700">Admin</span>
                    </Link>
                </div>

                <nav className="p-4 space-y-1.5 mt-2">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Utama</p>
                    
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
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