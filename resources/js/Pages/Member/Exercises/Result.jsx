import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Trophy, ArrowLeft, Target, XCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Result({ material, exercise, score }) {
    // Anggap KKM / Batas Lulus adalah 70
    const isPassed = score.skor >= 70;
    
    const [offset, setOffset] = useState(440);

    // ✅ Hook untuk menghapus nilai (reset)
    const { delete: destroy, processing } = useForm();

    // ✅ Fungsi konfirmasi dan reset kuis
    const handleReset = () => {
        if (confirm('Apakah Anda yakin ingin mengulang kuis ini? Skor Anda saat ini akan dihapus secara permanen.')) {
            destroy(route('member.exercise.reset', material.id));
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setOffset(440 - (440 * score.skor) / 100);
        }, 100);
    }, [score.skor]);

    return (
        <div className="min-h-screen bg-slate-50/80 flex items-center justify-center p-4 relative overflow-hidden">
            <Head title={`Hasil: ${exercise.judul}`} />

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none opacity-20 ${isPassed ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                // Tetap menggunakan mt-10 agar icon trofi tidak terpotong
                className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-950/5 border border-slate-100 text-center relative z-10 mt-10"
            >
                
                <div className={`h-40 absolute top-0 w-full rounded-t-[2.5rem] opacity-10 ${isPassed ? 'bg-gradient-to-b from-emerald-500 to-transparent' : 'bg-gradient-to-b from-rose-500 to-transparent'}`}></div>

                <div className="p-8 md:p-12 relative z-10">
                    
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.2, damping: 15 }}
                        className={`w-24 h-24 mx-auto rounded-[1.5rem] flex items-center justify-center shadow-xl mb-6 -mt-24 border-[4px] border-white
                            ${isPassed ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-rose-500 shadow-rose-500/30'}
                        `}
                    >
                        {isPassed ? <Trophy size={48} className="text-white" strokeWidth={1.5} /> : <XCircle size={48} className="text-white" strokeWidth={1.5} />}
                    </motion.div>

                    <h2 className={`text-3xl md:text-4xl font-black mb-2 tracking-tight ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPassed ? 'Luar Biasa!' : 'Jangan Menyerah!'}
                    </h2>
                    <p className="text-slate-500 font-semibold mb-10">Anda telah menyelesaikan kuis <strong className="text-blue-950">{exercise.judul}</strong></p>

                    <div className="flex justify-center mb-12">
                        <div className="relative">
                            <svg className="w-48 h-48 transform -rotate-90 drop-shadow-md">
                                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                <circle 
                                    cx="96" cy="96" r="84" 
                                    stroke="currentColor" strokeWidth="12" fill="transparent" strokeLinecap="round"
                                    strokeDasharray={528} strokeDashoffset={offset} 
                                    className={`${isPassed ? 'text-emerald-500' : 'text-rose-500'} transition-all duration-[1.5s] ease-out`} 
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center">
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                    className="text-5xl font-black text-blue-950 tracking-tighter"
                                >
                                    {score.skor}
                                </motion.span>
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Nilai Akhir</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:gap-6 mb-10">
                        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col items-center group hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-emerald-600">
                                <Target size={20} strokeWidth={2.5}/>
                            </div>
                            <p className="text-3xl font-black text-blue-950 mb-1">{score.jumlah_benar}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jawaban Benar</p>
                        </div>
                        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col items-center group hover:border-rose-200 hover:bg-rose-50/30 transition-colors">
                            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mb-3 text-rose-600">
                                <XCircle size={20} strokeWidth={2.5}/>
                            </div>
                            <p className="text-3xl font-black text-blue-950 mb-1">{score.total_soal - score.jumlah_benar}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jawaban Salah</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* ✅ TOMBOL KERJAKAN ULANG KUIS */}
                        <button 
                            onClick={handleReset}
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2.5 w-full py-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl font-black hover:bg-amber-100 transition-all duration-300 active:scale-95 disabled:opacity-50 group"
                        >
                            <RotateCcw size={20} className={processing ? 'animate-spin' : 'group-hover:-rotate-180 transition-transform duration-500'} /> 
                            {processing ? 'Menyiapkan Ulang...' : 'Kerjakan Ulang Kuis'}
                        </button>

                        {/* TOMBOL KEMBALI */}
                        <Link 
                            href={route('member.courses.show', material?.chapter?.course_id || '')} 
                            className="inline-flex items-center justify-center gap-2.5 w-full py-4 bg-blue-950 text-white rounded-xl font-black hover:bg-blue-900 transition-all duration-300 shadow-xl shadow-blue-950/20 active:scale-95 group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                            Kembali ke Ruang Kelas
                        </Link>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}