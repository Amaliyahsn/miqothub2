import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, ChevronRight, ChevronLeft, Flag, Circle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz({ material, exercise, questions }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { data, setData, post, processing } = useForm({
        answers: {} 
    });

    const currentQ = questions[currentIndex];
    const isLast = currentIndex === questions.length - 1;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = (optionValue) => {
        setData('answers', {
            ...data.answers,
            [currentQ.id]: optionValue
        });
    };

    const submitQuiz = () => {
        if (confirm('Yakin ingin menyelesaikan latihan ini? Jawaban Anda akan langsung dinilai.')) {
            post(route('member.exercise.submit', material.id));
        }
    };

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center p-12 md:p-20 bg-white rounded-[2rem] border border-slate-200 shadow-xl max-w-lg w-full">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Flag size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-black text-blue-950 mb-3">Kuis Kosong</h2>
                    <p className="text-slate-500 font-medium">Instruktur belum menyiapkan soal untuk kuis ini. Silakan kembali nanti.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-6 md:py-12 px-4 font-sans select-none">
            <Head title={`Kuis: ${exercise.judul}`} />

            <div className="max-w-4xl mx-auto">
                
                {/* HEADER & PROGRESS BAR */}
                <div className="mb-6 md:mb-10">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-950 mb-6 tracking-tight text-center md:text-left">
                        {exercise.judul}
                    </h1>
                    
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-[11px] md:text-xs font-black uppercase tracking-widest text-slate-400">
                                Pertanyaan <strong className="text-blue-600 text-lg md:text-xl">{currentIndex + 1}</strong> / {questions.length}
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100/50">
                                {Math.round(progress)}% Selesai
                            </span>
                        </div>
                        
                        <div className="w-full bg-slate-100 rounded-full h-2.5 md:h-3 overflow-hidden shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* AREA SOAL DENGAN ANIMASI TRANSISI */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6 md:mb-8">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 md:p-10 lg:p-12"
                        >
                            {/* GAMBAR SOAL JIKA ADA */}
                            {currentQ.gambar_soal && (
                                <div className="mb-8 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-2 shadow-inner text-center md:text-left">
                                    <img src={`/storage/${currentQ.gambar_soal}`} alt="Ilustrasi Soal" className="max-h-[250px] md:max-h-[350px] w-auto object-contain rounded-xl mx-auto md:mx-0" />
                                </div>
                            )}
                            
                            <p className="text-lg md:text-xl lg:text-2xl text-slate-800 leading-relaxed font-bold mb-8 md:mb-10 whitespace-pre-wrap">
                                {currentQ.pertanyaan}
                            </p>

                            {/* KARTU PILIHAN GANDA */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['a', 'b', 'c', 'd', 'e'].map((opt) => {
                                    const isSelected = data.answers[currentQ.id] === opt;
                                    if (!currentQ[`opsi_${opt}`] && !currentQ[`gambar_${opt}`]) return null;
                                    
                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => handleAnswer(opt)}
                                            className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-4 group ${
                                                isSelected 
                                                    ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-600/10 scale-[1.02] ring-4 ring-blue-600/10' 
                                                    : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="mt-0.5 shrink-0 transition-colors duration-300">
                                                    {isSelected ? (
                                                        <CheckCircle className="text-blue-600 drop-shadow-sm" size={24} strokeWidth={2.5} />
                                                    ) : (
                                                        <Circle className="text-slate-300 group-hover:text-blue-300" size={24} strokeWidth={2} />
                                                    )}
                                                </div>
                                                <span className={`text-base md:text-lg leading-relaxed font-medium transition-colors ${isSelected ? 'text-blue-950 font-black' : 'text-slate-600 group-hover:text-slate-800'}`}>
                                                    <span className="uppercase mr-2 font-black opacity-50">{opt}.</span> 
                                                    {currentQ[`opsi_${opt}`]}
                                                </span>
                                            </div>

                                            {currentQ[`gambar_${opt}`] && (
                                                <div className="ml-10 mt-2 rounded-xl overflow-hidden bg-white border border-slate-100 p-1">
                                                    <img src={`/storage/${currentQ[`gambar_${opt}`]}`} alt={`Opsi ${opt}`} className="max-h-24 w-auto object-contain rounded-lg" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* NAVIGASI BAWAH (Responsif) */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 bg-white p-4 md:p-6 rounded-[1.5rem] shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        disabled={currentIndex === 0}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 transition-all"
                    >
                        <ChevronLeft size={20} /> Sebelumnya
                    </button>

                    {!isLast ? (
                        <button 
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 text-blue-950 rounded-xl font-black hover:bg-blue-100 flex items-center justify-center gap-2 transition-all duration-300 group"
                        >
                            Selanjutnya <ChevronRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button 
                            onClick={submitQuiz}
                            disabled={processing}
                            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 active:scale-95 transition-all duration-300 disabled:opacity-50"
                        >
                            <CheckCircle2 size={20} className={processing ? 'animate-pulse' : 'text-blue-200'} /> 
                            {processing ? 'Memproses...' : 'Kirim Jawaban'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}