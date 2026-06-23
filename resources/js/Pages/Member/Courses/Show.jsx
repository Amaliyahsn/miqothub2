import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import MaterialViewer from './Partials/MaterialViewer';
import CurriculumSidebar from './Partials/CurriculumSidebar';

export default function Show({ auth, course }) {
    
    const firstChapter = course.chapters?.[0];
    const firstMaterial = firstChapter?.materials?.[0] || null;

    const [activeMaterial, setActiveMaterial] = useState(firstMaterial);
    const [expandedChapters, setExpandedChapters] = useState(firstChapter ? [firstChapter.id] : []);

    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();

        const handleAggressiveKeyDown = (e) => {
    // 1. Izinkan tombol navigasi standar
    const allowedKeys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'PageUp', 'PageDown', 'Home', 'End', ' ', 'F5',
        '+', '-', '=', '_' // 👈 Tambahkan ini agar karakter + dan - tidak di-block
    ];

    const isRefresh = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r';
    
    // 2. 🛠️ FIX UNTUK ZOOM LAPTOP: Izinkan kombinasi Ctrl + atau Ctrl - atau Ctrl 0
    const isZoom = (e.ctrlKey || e.metaKey) && ['+', '-', '=', '_', '0'].includes(e.key);

    // Jika tombol tidak ada di whitelist, bukan refresh, dan bukan zoom, barulah diblokir
    if (!allowedKeys.includes(e.key) && !isRefresh && !isZoom) {
        e.preventDefault();
        if (e.key === 'PrintScreen' || e.metaKey || e.ctrlKey) {
            navigator.clipboard.writeText(''); 
        }
    }
};

        const handleDragStart = (e) => e.preventDefault();

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleAggressiveKeyDown);
        document.addEventListener('dragstart', handleDragStart);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleAggressiveKeyDown);
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, []);

    const toggleChapter = (id) => {
        setExpandedChapters(prev => 
            prev.includes(id) ? prev.filter(chapId => chapId !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans select-none">
            <Head title={`${course.nama} - Ruang Belajar`} />

            <nav className="bg-blue-950 text-white sticky top-0 z-50 shadow-xl shadow-blue-950/10 border-b border-blue-900/50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    
                    <div className="flex items-center gap-4 md:gap-5">
                        <Link 
                            href={route('member.courses.index')} 
                            className="p-2.5 bg-blue-900/40 hover:bg-blue-800 rounded-xl transition-all duration-300 flex items-center gap-2 md:pr-4 border border-blue-800/50 hover:border-blue-500/50 group"
                        >
                            <ArrowLeft size={18} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" /> 
                            <span className="hidden md:block text-sm font-bold text-blue-100">Kembali</span>
                        </Link>
                        <div>
                            <h1 className="font-bold text-lg leading-tight hidden md:block">{course.nama}</h1>
                            <p className="text-xs text-slate-400">Ruang Kelas</p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-3 bg-blue-900/30 px-4 py-2 rounded-xl border border-blue-800/30">
                        <GraduationCap size={18} className="text-blue-400" />
                        <div className="flex flex-col text-right">
                            <span className="text-xs font-black text-white">{auth.user?.name}</span>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Pelajar Aktif</span>
                        </div>
                    </div>

                </div>
            </nav>
            
            <main className="flex-1 max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-8 p-4 md:p-6 lg:p-8">
                
                <div className="w-full lg:flex-1 min-w-0">
                    <MaterialViewer activeMaterial={activeMaterial} />
                </div>

                <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-4">
                    <CurriculumSidebar 
                        course={course} 
                        activeMaterial={activeMaterial} 
                        setActiveMaterial={setActiveMaterial} 
                        expandedChapters={expandedChapters} 
                        toggleChapter={toggleChapter} 
                    />
                </div>

            </main>
        </div>
    );
}