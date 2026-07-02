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
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            
{/* 1. VIDEO SECTION */}
{activeMaterial.tipe === 'video' && (
    <div 
        className="aspect-video bg-slate-900 w-full relative border-b border-slate-200 shadow-inner overflow-hidden"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
        {activeMaterial.link_video ? (
            <div className="relative w-full h-full">
                <iframe 
                    src={`${getEmbedUrl(activeMaterial.link_video)}?rel=0&modestbranding=1&controls=1&disablekb=1&iv_load_policy=3`} 
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen={false}
                    title={activeMaterial.judul}
                ></iframe>
                
                {/* 🛡️ OVERLAY PROTEKSI - MENJAGA TOMBOL SENSITIF & TETAP BISA DI-PLAY */}
                
                {/* 1. Tutupi Bagian Atas (Mencegah klik judul, Share, dan Watch Later) */}
                <div 
                    className="absolute top-0 left-0 w-full h-[15%] z-[10] bg-transparent"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                ></div>

                {/* 2. Tutupi Pojok Kanan Bawah (Mencegah klik logo "Watch on YouTube") */}
                <div 
                    className="absolute bottom-0 right-0 w-[30%] h-[15%] z-[10] bg-transparent"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                ></div>

                {/* 3. Tutupi Pojok Kiri Bawah (Mencegah klik logo channel/profil jika muncul) */}
                <div 
                    className="absolute bottom-0 left-0 w-[20%] h-[15%] z-[10] bg-transparent"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                ></div>
                
                {/* 💡 AREA TENGAH SENGAJA DI-KOSONGKAN (TANPA OVERLAY) AGAR TOMBOL PLAY/PAUSE DAN TIMELINE TETAP BISA DIKLIK */}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                <MonitorPlay size={48} className="opacity-20" />
                <span className="font-semibold text-sm tracking-wider uppercase">Video tidak tersedia</span>
            </div>
        )}
    </div>
)}
            {/* 2. PDF SECTION */}
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

                    <div className="w-full max-w-md relative z-10 flex flex-col gap-4">
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
            <div className="p-8 lg:p-10 bg-white border-t border-slate-100">
                <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100/50">Materi {activeMaterial.urutan}</span>
                    {activeMaterial.durasi && <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><Clock size={14} strokeWidth={2.5}/> {activeMaterial.durasi}</span>}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-snug tracking-tight">{activeMaterial.judul}</h2>
                <div className="w-12 h-1 bg-blue-600 rounded-full mb-8"></div>
                {activeMaterial.deskripsi ? (
                    <div className="prose prose-slate max-w-none text-slate-600 leading-loose font-medium" dangerouslySetInnerHTML={{ __html: activeMaterial.deskripsi }} />
                ) : (
                    <p className="text-slate-400 italic font-medium">Tidak ada deskripsi tambahan untuk materi ini.</p>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print { body { display: none !important; } }
            `}} />
        </div>
    );
}

// Sub-komponen SecurePDFViewer tetap di bawah tanpa ada perubahan fungsi...
function SecurePDFViewer({ materialId }) {
    const containerRef = useRef();
    const [pdfDoc, setPdfDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isCancelled = false;
        const loadPDF = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch(`/materials/stream-pdf/${materialId}`, {
                    headers: { 'Accept': 'application/pdf' },
                });

                if (!response.ok) {
                    throw new Error(`Gagal mengunduh berkas materi (Status: ${response.status})`);
                }

                const buffer = await response.arrayBuffer();
                if (isCancelled) return;

                const loadingTask = pdfjsLib.getDocument({
                    data: new Uint8Array(buffer),
                });

                const pdf = await loadingTask.promise;
                if (!isCancelled) {
                    setPdfDoc(pdf);
                    setLoading(false);
                }
            } catch (err) {
                console.error("PDF Load Error:", err);
                if (!isCancelled) {
                    setError("Gagal memuat materi edukasi. Coba refresh browser Anda.");
                    setLoading(false);
                }
            }
        };

        loadPDF();

        const handleKey = (e) => {
            if (e.ctrlKey && ["c", "s", "u", "p"].includes(e.key.toLowerCase())) e.preventDefault();
        };
        document.addEventListener("keydown", handleKey);
        return () => {
            isCancelled = true;
            document.removeEventListener("keydown", handleKey);
        };
    }, [materialId]);

    useEffect(() => {
        if (!pdfDoc || loading) return;

        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = ""; 

        const activeRenderTasks = {};
        const observers = [];

        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const pageDiv = document.createElement("div");
            pageDiv.id = `pdf-page-container-${i}`;
            pageDiv.className = "w-full mb-8 relative min-h-[50vh] flex flex-col items-center justify-center bg-slate-100/30 rounded-xl border border-slate-200/40 shadow-sm overflow-hidden p-1 md:p-2";

            const loadingWrapper = document.createElement('div');
            loadingWrapper.className = "text-center flex flex-col items-center justify-center gap-2";

            const loadingText = document.createElement("span");
            loadingText.className = "text-xs font-semibold text-slate-400 animate-pulse tracking-wider";
            loadingText.innerText = `Memuat halaman ${i}...`;
            
            loadingWrapper.appendChild(loadingText);
            pageDiv.appendChild(loadingWrapper);
            container.appendChild(pageDiv);

            const renderPageGradual = async (pageNum, targetDiv) => {
                if (activeRenderTasks[pageNum]) return;
                activeRenderTasks[pageNum] = true;

                try {
                    const page = await pdfDoc.getPage(pageNum);
                    targetDiv.innerHTML = ""; 

                    const pixelRatio = window.devicePixelRatio || 1;
                    const unscaledViewport = page.getViewport({ scale: 1 });
                    const parentWidth = targetDiv.clientWidth || 800;

                    const baseScale = (parentWidth - 16) / unscaledViewport.width;
                    const lowScaleMultiplier = 1.2;
                    const hdScaleMultiplier = 2.2; 

                    const lowViewport = page.getViewport({ scale: baseScale * lowScaleMultiplier });
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");

                    canvas.height = lowViewport.height * pixelRatio;
                    canvas.width = lowViewport.width * pixelRatio;
                    canvas.style.width = "100%";
                    canvas.style.height = "auto";
                    canvas.style.maxWidth = "100%";
                    canvas.className = "bg-white shadow-md rounded-lg transition-opacity duration-300 opacity-60";

                    targetDiv.appendChild(canvas);
                    context.scale(pixelRatio, pixelRatio);

                    await page.render({
                        canvasContext: context,
                        viewport: lowViewport,
                    }).promise;

                    canvas.classList.remove("opacity-60");

                    setTimeout(async () => {
                        try {
                            const hdViewport = page.getViewport({ scale: baseScale * hdScaleMultiplier });

                            canvas.height = hdViewport.height * pixelRatio;
                            canvas.width = hdViewport.width * pixelRatio;

                            context.restore(); 
                            context.save();
                            context.scale(pixelRatio, pixelRatio);

                            await page.render({
                                canvasContext: context,
                                viewport: hdViewport,
                              }).promise;
                        } catch (hdErr) {
                            console.error(`HD Render timeout error on page ${pageNum}:`, hdErr);
                        }
                    }, 100);
                } catch (err) {
                    console.error(`Error gradual rendering page ${pageNum}:`, err);
                }
            };

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            renderPageGradual(i, pageDiv);
                            observer.unobserve(pageDiv);
                        }
                    });
                },
                { rootMargin: "300px" },
            );

            observer.observe(pageDiv);
            observers.push({ observer, element: pageDiv });
        }

        return () => {
            observers.forEach(({ observer, element }) => observer.unobserve(element));
        };
    }, [pdfDoc, loading]);

    return (
        <div
            className="bg-slate-50 flex flex-col border-b border-slate-200 relative"
            onContextMenu={(e) => e.preventDefault()}
            style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
            }}
        >
            <div className="h-[75vh] overflow-y-auto p-4 md:p-8 scrollbar-thin bg-slate-200/40 flex items-start justify-center relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center m-auto gap-4 bg-slate-50/80 z-10 w-full h-full text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block">
                            Memproses Materi...
                        </span>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center m-auto gap-2 text-rose-600 p-8 text-center font-semibold text-sm">
                        <span>{error}</span>
                    </div>
                )}

                <div ref={containerRef} className="w-full max-w-3xl mx-auto"></div>
            </div>

            <div className="p-3.5 bg-blue-950 text-blue-100 text-[10px] font-bold text-center flex items-center justify-center gap-2.5 relative z-20 shadow-lg tracking-widest uppercase">
                <ShieldAlert size={16} className="text-blue-400 animate-pulse" />
                Materi Terproteksi: Fitur Unduh dan Salin Dinonaktifkan.
            </div>
        </div>
    );
}