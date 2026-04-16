import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ShieldCheck, LayoutDashboard, BookOpen, Calendar, Award, Receipt, X, ShoppingBag } from 'lucide-react';

export default function Sidebar({ user, isOpen, onClose }) {
    const { url } = usePage();
    const [imageError, setImageError] = useState(false); 

    
    const getAvatarUrl = () => {
        const photoPath = user?.foto_profile || user?.avatar || user?.profile_photo_path || user?.profile_photo_url || user?.photo;
        
        if (!photoPath) return null;
        if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
        if (photoPath.startsWith('/storage/')) return photoPath;
        return `/storage/${photoPath}`;
    };

    const photoUrl = getAvatarUrl();

    
    const menuItems = [
        { name: 'Beranda', icon: <LayoutDashboard size={20} />, route: 'dashboard', active: url.startsWith('/dashboard') },
        { name: 'Kelas Saya', icon: <BookOpen size={20} />, route: 'member.courses.index', active: url.startsWith('/my-courses') },
        { 
            name: 'Tambah Kelas',
            icon: <ShoppingBag size={20} />, 
            route: 'member.catalog', 
            active: url.startsWith('/katalog') 
        },
    ];

    return (
        <>
            
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 fixed inset-y-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                
                <div className="h-20 flex items-center px-8 border-b border-slate-100/60 bg-white/50 backdrop-blur-sm">
                    <Link href="/" className="flex items-center gap-3 text-2xl font-black text-slate-800 tracking-tight">
                    <div className="p-2 bg-blue-900 rounded-lg text-white shadow-md shadow-blue-900/20">
                            <BookOpen size={20} strokeWidth={2.5} />
                        </div>
                        Miqot<span className="text-blue-700">Course</span>
                    </Link>
                </div>

                
                <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-1.5 scrollbar-thin">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Menu Utama</p>
                    {menuItems.map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.route !== '#' ? route(item.route) : '#'}
                            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden ${
                                item.active 
                                ? 'text-blue-950 bg-blue-50/80 shadow-sm border border-blue-100/50' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-900 border border-transparent'
                            }`}
                        >
                            
                            {item.active && (
                                <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                            )}
                            
                            
                            <span className={`${item.active ? 'text-blue-700' : 'text-slate-400 group-hover:text-blue-600'} transition-colors duration-300`}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    ))}
                </div>

                
                <div className="p-4 border-t border-slate-100/80 bg-slate-50/50">
                    <Link href={route('profile.edit')} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white hover:shadow-md hover:border-slate-200 border border-transparent transition-all duration-300 group">
                        
                        <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-white font-black shadow-inner border border-blue-200 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                            {photoUrl && !imageError ? (
                                <img 
                                    src={photoUrl} 
                                    alt={user?.name || 'Member'} 
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase() || 'M'}</span>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-800 truncate group-hover:text-blue-900 transition-colors">{user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5 group-hover:text-blue-800/70 transition-colors">Lihat Profil</p>
                        </div>
                    </Link>
                </div>
            </aside>

            
            <AnimatePresence>
                {isOpen && (
                    <>
                        
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={onClose} 
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" 
                        />
                        
                        
                        <motion.aside 
                            initial={{ x: '-100%' }} 
                            animate={{ x: 0 }} 
                            exit={{ x: '-100%' }} 
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
                            className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-50 flex flex-col lg:hidden border-r border-slate-100"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100/60 bg-slate-50/50">
                                <span className="text-xl font-black text-slate-800 flex items-center gap-2.5">
                                    <div className="p-1.5 bg-gradient-to-tr from-blue-950 to-blue-600 rounded-lg shadow-sm">
                                        <ShieldCheck size={20} className="text-white" strokeWidth={2.5}/>
                                    </div>
                                    Haji<span className="text-blue-700">Course</span>
                                </span>
                                <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-slate-500 transition-colors">
                                    <X size={20}/>
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5">
                                <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Menu Navigasi</p>
                                {menuItems.map((item) => (
                                    <Link 
                                        key={item.name} 
                                        href={item.route !== '#' ? route(item.route) : '#'} 
                                        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold transition-colors ${
                                            item.active 
                                            ? 'text-blue-950 bg-blue-50 border border-blue-100/50' 
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-blue-900'
                                        }`}
                                        onClick={onClose} 
                                    >
                                        <span className={`${item.active ? 'text-blue-700' : 'text-slate-400'}`}>
                                            {item.icon}
                                        </span>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            
                            
                            <div className="p-4 border-t border-slate-100/80 bg-slate-50/50">
                                <Link href={route('profile.edit')} onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white border border-transparent transition-all duration-300">
                                    <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-white font-black shadow-inner overflow-hidden shrink-0">
                                        {photoUrl && !imageError ? (
                                            <img src={photoUrl} alt={user?.name} className="w-full h-full object-cover" onError={() => setImageError(true)} />
                                        ) : (
                                            <span>{user?.name?.charAt(0).toUpperCase() || 'M'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-800 truncate">{user?.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">Lihat Profil</p>
                                    </div>
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}