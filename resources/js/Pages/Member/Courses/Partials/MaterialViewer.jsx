import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    FileBadge, MonitorPlay, Calendar, Clock, Lock, 
    ClipboardList, CheckCircle2, FileText, ShieldAlert 
} from 'lucide-react';

// ✅ Konfigurasi PDF.js HD
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function MaterialViewer({ activeMaterial }) {
    
    const getEmbedUrl = (url) => {
        if (!url) return '';
        const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const ytMatch = url.match(ytRegExp);
        if (ytMatch && ytMatch[2].length === 11) {
            return `https://www.youtube.com/embed/${ytMatch[2]}`;
        }
        if (url.includes('drive.google.com/file/d/')) {
            return url.replace(/\/view.*$/, '/preview');
        }
        return url;
    };

    if (!activeMaterial) {
        return (
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 p-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-inner">
                    <FileText size={48} className="text-slate-300" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Belum Ada Materi Terpilih</h2>
                <p className="text-slate-500 font-medium">Silakan pilih materi dari daftar kurikulum di samping untuk mulai belajar.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col no-select">
            
            {/* 1. VIDEO SECTION */}
            {activeMaterial.tipe === 'video' && (
                <div className="aspect-video bg-slate-900 w-full relative border-b border-slate-200 shadow-inner overflow-hidden">
                    {activeMaterial.link_video ? (
                        <iframe 
                            src={getEmbedUrl(activeMaterial.link_video)} 
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                            title={activeMaterial.judul}
                        ></iframe>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                            <MonitorPlay size={48} className="opacity-20" />
                            <span className="font-semibold text-sm tracking-wider uppercase">Video tidak tersedia</span>
                        </div>
                    )}
                </div>
            )}

            {/* 2. PDF SECTION (SECURE HD CANVAS) */}
            {activeMaterial.tipe === 'pdf' && (
                <SecurePDFViewer materialId={activeMaterial.id} />
            )}

{/* 3. PERTEMUAN SECTION */}
            {activeMaterial.tipe === 'pertemuan' && (
                <div className="bg-gradient-to-br from-blue-50/50 via-white to-slate-50 p-10 md:p-20 flex flex-col items-center text-center border-b border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="w-24 h-24 bg-white text-blue-700 rounded-full flex items-center justify-center mb-6 shadow-xl border border-blue-100 relative z-10">
                        <MonitorPlay size={40} strokeWidth={2} />
                    </div>
                    <h3 className="text-3xl font-black text-blue-950 mb-6 relative z-10 tracking-tight">Sesi Pertemuan Live</h3>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-10">
                        <div className="flex items-center gap-2.5 px-6 py-3.5 bg-white text-slate-700 rounded-xl font-bold shadow-sm border border-slate-200">
                            <Calendar size={20} className="text-blue-600"/>
                            {new Date(activeMaterial.tanggal_waktu_meet).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2.5 px-6 py-3.5 bg-white text-slate-700 rounded-xl font-bold shadow-sm border border-slate-200">
                            <Clock size={20} className="text-blue-600"/>
                            {new Date(activeMaterial.tanggal_waktu_meet).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </div>
                    </div>

                    {/* ✅ KOTAK INFORMASI & LINK (Diperbarui) */}
                    <div className="w-full max-w-md relative z-10 flex flex-col gap-4">
                        
                        {/* KOTAK PASSCODE */}
                        {activeMaterial.password_meet && (
                            <div className="p-4 bg-blue-950 border border-blue-900 rounded-2xl shadow-lg flex items-center justify-between px-6">
                                <span className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                    <Lock size={16}/> Passcode
                                </span>
                                <span className="text-xl font-black text-white tracking-widest">
                                    {activeMaterial.password_meet}
                                </span>
                            </div>
                        )}

                        {/* KOTAK COPY LINK EXTERNAL */}
                        <div className="p-2 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center justify-between gap-3">
                            <div className="flex-1 truncate pl-4 text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tautan Ruang Virtual</p>
                                <p className="text-sm font-bold text-slate-700 truncate">
                                    {activeMaterial.link_meet}
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(activeMaterial.link_meet);
                                    alert('Link Zoom/Meet berhasil disalin!');
                                }}
                                className="px-4 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all shrink-0 flex items-center gap-2"
                            >
                                <ClipboardList size={16} /> Salin
                            </button>
                        </div>

                        {/* TOMBOL BUKA LANGSUNG DENGAN AUTO-HTTPS */}
                        <a 
                            href={activeMaterial.link_meet?.startsWith('http') ? activeMaterial.link_meet : `https://${activeMaterial.link_meet}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-full py-4 mt-2 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-600/30 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 text-lg group"
                        >
                            <MonitorPlay size={24} className="group-hover:scale-110 transition-transform" /> 
                            Buka di Tab Baru
                        </a>
                    </div>
                </div>
            )}

            {/* 4. LATIHAN SECTION */}
            {activeMaterial.tipe === 'latihan' && (
                <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-10 md:p-20 flex flex-col items-center text-center border-b border-slate-200 relative overflow-hidden">
                    <div className="w-24 h-24 bg-white text-blue-700 rounded-full flex items-center justify-center mb-6 shadow-xl border border-blue-100 relative z-10">
                        <ClipboardList size={40} strokeWidth={2} />
                    </div>
                    <h3 className="text-3xl font-black text-blue-950 mb-4 relative z-10 tracking-tight">Evaluasi & Kuis</h3>
                    <p className="text-slate-500 max-w-md mb-10 leading-relaxed font-semibold relative z-10">Uji pemahamanmu mengenai materi bab ini.</p>
                    {activeMaterial.exercise_id ? (
                        <Link href={route('member.exercise.show', activeMaterial.id)} className="px-10 py-4 bg-blue-950 text-white font-black rounded-xl hover:bg-blue-900 transition-all text-lg flex items-center justify-center gap-2.5 relative z-10 group">
                            <CheckCircle2 size={24} className="text-blue-400 group-hover:text-white transition-colors" /> Mulai Kerjakan Kuis
                        </Link>
                    ) : (
                        <div className="px-6 py-4 bg-slate-100 text-slate-500 font-bold rounded-xl border border-slate-200 relative z-10 text-sm">Kuis belum disiapkan.</div>
                    )}
                </div>
            )}

            {/* 5. DESCRIPTION SECTION */}
            <div className="p-8 lg:p-10 bg-white no-select border-t border-slate-100">
                <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100/50">Materi {activeMaterial.urutan}</span>
                    {activeMaterial.durasi && <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><Clock size={14} strokeWidth={2.5}/> {activeMaterial.durasi}</span>}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-snug tracking-tight">{activeMaterial.judul}</h2>
                <div className="w-12 h-1 bg-blue-600 rounded-full mb-8"></div>
                {activeMaterial.deskripsi ? (
                    <div className="prose prose-slate max-w-none text-slate-600 leading-loose font-medium no-select" dangerouslySetInnerHTML={{ __html: activeMaterial.deskripsi }} />
                ) : (
                    <p className="text-slate-400 italic font-medium">Tidak ada deskripsi tambahan untuk materi ini.</p>
                )}
            </div>

            {/* CSS PROTECTIONS */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print { body { display: none !important; } }
                .no-select { user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; }
            `}} />
        </div>
    );
}

// ✅ SUB-KOMPONEN SECURE HD VIEWER
function SecurePDFViewer({ materialId }) {
    const containerRef = useRef();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const renderPDF = async () => {
            setLoading(true);
            try {
                const pdf = await pdfjsLib.getDocument(`/materials/stream-pdf/${materialId}`).promise;
                const container = containerRef.current;
                if (!container) return;
                container.innerHTML = ''; 

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    
                    // ✅ SKALA 2.0 UNTUK KUALITAS HD (TAJAM)
                    const viewport = page.getViewport({ scale: 2.0 }); 

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    canvas.style.width = '100%'; 
                    canvas.style.height = 'auto';
                    canvas.style.marginBottom = '24px';
                    canvas.className = "shadow-xl border border-slate-200 bg-white rounded-sm";

                    container.appendChild(canvas);

                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;
                }
            } catch (err) {
                console.error('PDF Render Error:', err);
            }
            setLoading(false);
        };

        renderPDF();

        // 🔒 Keyboard Protection
        const handleKey = (e) => {
            if (e.ctrlKey && ['c','s','u','p'].includes(e.key.toLowerCase())) e.preventDefault();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [materialId]);

    return (
        <div className="bg-slate-50 flex flex-col border-b border-slate-200 relative select-none" onContextMenu={(e) => e.preventDefault()}>
            <div className="h-[75vh] overflow-y-auto p-4 md:p-10 scrollbar-thin bg-slate-200/40">
                {loading && (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Enkripsi Materi HD...</span>
                    </div>
                )}
                <div ref={containerRef} className="max-w-4xl mx-auto"></div>
            </div>

            <div className="p-3.5 bg-blue-950 text-blue-100 text-[10px] font-bold text-center flex items-center justify-center gap-2.5 relative z-20 shadow-lg tracking-widest uppercase">
                <ShieldAlert size={16} className="text-blue-400 animate-pulse" />
                Materi Terproteksi: Fitur Unduh dan Salin Dinonaktifkan.
            </div>
        </div>
    );
}