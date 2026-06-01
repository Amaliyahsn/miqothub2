import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, ChevronRight, ChevronLeft, Flag, Circle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz({ material, exercise, questions }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Ambil durasi waktu dari backend (dalam menit)
    const durationMinutes = parseInt(exercise.waktu_menit) || 0;
    const isTimeLimited = durationMinutes > 0;

    // State untuk sisa waktu dalam detik
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
    const hasAutoSubmitted = useRef(false);

    const { data, setData, post, processing } = useForm({
        answers: {} 
    });

    // --- LOGIKA TIMER ---
    useEffect(() => {
        if (!isTimeLimited) return;

        // Jika waktu habis, langsung auto-submit tanpa confirm
        if (timeLeft <= 0) {
            handleAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isTimeLimited]);

    // Fungsi pembantu untuk submit otomatis tanpa konfirmasi window.confirm
    const handleAutoSubmit = () => {
        if (hasAutoSubmitted.current) return;
        hasAutoSubmitted.current = true;
        
        // Post jawaban yang ada saat ini secara langsung
        post(route('member.exercise.submit', material.id));
    };

    // Format detik ke format mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

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
                <div className="text-center p-8 sm:p-12 md:p-20 bg-white rounded-[2rem] border border-slate-200 shadow-xl max-w-lg w-full">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Flag className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-blue-950 mb-3">Kuis Kosong</h2>
                    <p className="text-sm sm:text-base text-slate-500 font-medium">Instruktur belum menyiapkan soal untuk kuis ini. Silakan kembali nanti.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-4 sm:py-6 md:py-12 px-4 font-sans select-none">
            <Head title={`Kuis: ${exercise.judul}`} />

            <div className="max-w-4xl mx-auto">
                
                {/* HEADER & PROGRESS BAR */}
                <div className="mb-6 md:mb-10">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-blue-950 mb-4 md:mb-6 tracking-tight text-center md:text-left">
                        {exercise.judul}
                    </h1>
                    
                    {/* ✅ Perubahan pada Grid Layout untuk Progress dan Timer */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
                        
                        {/* Progress Tracker */}
                        <div className="sm:col-span-2 bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                            <div className="flex justify-between items-end mb-2.5 md:mb-3">
                                <span className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-widest text-slate-400">
                                    Pertanyaan <strong className="text-blue-600 text-base sm:text-lg md:text-xl">{currentIndex + 1}</strong> / {questions.length}
                                </span>
                                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100/50">
                                    {Math.round(progress)}% Selesai
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 sm:h-2.5 overflow-hidden shadow-inner">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full"
                                />
                            </div>
                        </div>

                        {/* Timer Card */}
                        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-1">
                            <span className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                <Clock size={14} className="text-slate-400" /> Sisa Waktu
                            </span>
                            {isTimeLimited ? (
                                <span className={`text-xl sm:text-2xl font-black tracking-wider ${timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            ) : (
                                <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 sm:py-1.5 rounded-xl">
                                    Tidak Dibatasi
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* AREA SOAL DENGAN ANIMASI TRANSISI */}
                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl md:shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6 md:mb-8">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="p-5 sm:p-8 md:p-10 lg:p-12"
                        >
                            {/* GAMBAR SOAL JIKA ADA */}
                            {currentQ.gambar_soal && (
                                <div className="mb-6 md:mb-8 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 p-2 shadow-inner text-center md:text-left">
                                    <img src={`/storage/${currentQ.gambar_soal}`} alt="Ilustrasi Soal" className="max-h-[200px] sm:max-h-[250px] md:max-h-[350px] w-auto object-contain rounded-xl mx-auto md:mx-0" />
                                </div>
                            )}
                            
                            {/* ✅ Teks soal disesuaikan ukurannya di HP */}
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-800 leading-relaxed font-bold mb-6 md:mb-10 whitespace-pre-wrap">
                                {currentQ.pertanyaan}
                            </p>

                            {/* KARTU PILIHAN GANDA */}
                            {/* ✅ Gap dan padding disesuaikan di mobile */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                {['a', 'b', 'c', 'd', 'e'].map((opt) => {
                                    const isSelected = data.answers[currentQ.id] === opt;
                                    if (!currentQ[`opsi_${opt}`] && !currentQ[`gambar_${opt}`]) return null;
                                    
                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => handleAnswer(opt)}
                                            className={`w-full text-left p-4 md:p-5 rounded-[1rem] md:rounded-2xl border-2 transition-all duration-300 flex flex-col gap-3 group ${
                                                isSelected 
                                                    ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-600/10 scale-[1.02] ring-4 ring-blue-600/10' 
                                                    : 'border-slate-100 hover:border-blue-300 hover:bg-slate-50 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3 md:gap-4">
                                                <div className="mt-0.5 shrink-0 transition-colors duration-300">
                                                    {isSelected ? (
                                                        <CheckCircle className="text-blue-600 drop-shadow-sm w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                                                    ) : (
                                                        <Circle className="text-slate-300 group-hover:text-blue-300 w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                                                    )}
                                                </div>
                                                {/* ✅ Ukuran teks opsi jawaban dibuat lebih pas di layar kecil */}
                                                <span className={`text-sm sm:text-base md:text-lg leading-relaxed font-medium transition-colors ${isSelected ? 'text-blue-950 font-black' : 'text-slate-600 group-hover:text-slate-800'}`}>
                                                    <span className="uppercase mr-1.5 md:mr-2 font-black opacity-50">{opt}.</span> 
                                                    {currentQ[`opsi_${opt}`]}
                                                </span>
                                            </div>

                                            {currentQ[`gambar_${opt}`] && (
                                                <div className="ml-8 md:ml-10 mt-1 md:mt-2 rounded-xl overflow-hidden bg-white border border-slate-100 p-1">
                                                    <img src={`/storage/${currentQ[`gambar_${opt}`]}`} alt={`Opsi ${opt}`} className="max-h-16 md:max-h-24 w-auto object-contain rounded-lg" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* NAVIGASI BAWAH */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4 bg-white p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        disabled={currentIndex === 0}
                        className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 transition-all text-sm md:text-base"
                    >
                        <ChevronLeft size={18} className="md:w-5 md:h-5" /> Sebelumnya
                    </button>

                    {!isLast ? (
                        <button 
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-slate-100 text-blue-950 rounded-xl font-black hover:bg-blue-100 flex items-center justify-center gap-2 transition-all duration-300 group text-sm md:text-base"
                        >
                            Selanjutnya <ChevronRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform md:w-5 md:h-5" />
                        </button>
                    ) : (
                        <button 
                            onClick={submitQuiz}
                            disabled={processing}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 flex items-center justify-center gap-2 md:gap-2.5 shadow-xl shadow-blue-600/30 active:scale-95 transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
                        >
                            <CheckCircle2 size={18} className={`md:w-5 md:h-5 ${processing ? 'animate-pulse' : 'text-blue-200'}`} /> 
                            {processing ? 'Memproses...' : 'Kirim Jawaban'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}