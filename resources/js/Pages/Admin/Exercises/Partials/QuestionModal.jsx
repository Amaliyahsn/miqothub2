import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Trash2, HelpCircle, Save, Plus, ListTodo } from 'lucide-react';

export default function QuestionModal({ show, onClose, exerciseId, question }) {
    const isEdit = !!question;

    const { data, setData, post, processing, reset, errors } = useForm({
        pertanyaan: '',
        jawaban_benar: 0, // Menggunakan index (0=A, 1=B, dst)
        options: [
            { teks: '', gambar: null, remove_gambar: false },
            { teks: '', gambar: null, remove_gambar: false },
            { teks: '', gambar: null, remove_gambar: false }
        ],
        gambar_soal: null,
        remove_gambar_soal: false,
        _method: 'post'
    });

    useEffect(() => {
        if (show) {
            if (isEdit) {
                // Mapping data dari backend (opsi_a, b, c...) ke array options
                const loadedOptions = [];
                ['a', 'b', 'c', 'd', 'e'].forEach((letter, index) => {
                    if (question[`opsi_${letter}`] !== null && question[`opsi_${letter}`] !== undefined) {
                        loadedOptions.push({
                            teks: question[`opsi_${letter}`],
                            gambar: null,
                            existing_gambar: question[`gambar_${letter}`],
                            remove_gambar: false
                        });
                    }
                });

                setData({
                    pertanyaan: question.pertanyaan,
                    jawaban_benar: ['a', 'b', 'c', 'd', 'e'].indexOf(question.jawaban_benar),
                    options: loadedOptions,
                    gambar_soal: null,
                    remove_gambar_soal: false,
                    _method: 'put'
                });
            } else {
                reset();
                setData('_method', 'post');
            }
        }
    }, [show, question]);

    const addOption = () => {
        if (data.options.length < 5) {
            setData('options', [...data.options, { teks: '', gambar: null, remove_gambar: false }]);
        }
    };

    const removeOption = (index) => {
        if (data.options.length > 2) {
            const newOptions = data.options.filter((_, i) => i !== index);
            // Reset jawaban benar jika index yang dihapus adalah jawaban benar
            let newCorrect = data.jawaban_benar;
            if (newCorrect >= newOptions.length) newCorrect = newOptions.length - 1;
            
            setData({
                ...data,
                options: newOptions,
                jawaban_benar: newCorrect
            });
        }
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...data.options];
        newOptions[index][field] = value;
        setData('options', newOptions);
    };

    const submit = (e) => {
        e.preventDefault();
        const routePath = isEdit ? route('admin.questions.update', question.id) : route('admin.questions.store', exerciseId);
        
        post(routePath, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        onClick={onClose} 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                        className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-slate-100"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                                    <ListTodo size={20} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                    {isEdit ? 'Update Pertanyaan' : 'Tambah Pertanyaan'}
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 overflow-y-auto bg-white custom-scrollbar">
                                
                                {/* Area Pertanyaan */}
                                <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Teks Pertanyaan</label>
                                    <textarea 
                                        value={data.pertanyaan} 
                                        onChange={e => setData('pertanyaan', e.target.value)} 
                                        rows="3" 
                                        className="w-full mb-4 px-4 py-3 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800 transition-all resize-none shadow-inner" 
                                        placeholder="Masukkan isi pertanyaan..."
                                        required
                                    />
                                    
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                                <ImageIcon size={14}/> Lampiran Gambar Soal
                                            </label>
                                            <input 
                                                type="file" accept="image/*" 
                                                onChange={e => { setData('gambar_soal', e.target.files[0]); setData('remove_gambar_soal', false); }} 
                                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                                            />
                                        </div>

                                        {((isEdit && question.gambar_soal && !data.remove_gambar_soal) || data.gambar_soal) && (
                                            <div className="relative group p-1 bg-white border rounded-lg shadow-sm">
                                                <img 
                                                    src={data.gambar_soal ? URL.createObjectURL(data.gambar_soal) : `/storage/${question.gambar_soal}`} 
                                                    className="h-20 w-20 object-cover rounded" 
                                                />
                                                <button type="button" onClick={() => setData('remove_gambar_soal', true)} className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600">
                                                    <Trash2 size={12}/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Area Opsi Jawaban */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Opsi Jawaban</h3>
                                        <button 
                                            type="button" 
                                            onClick={addOption}
                                            disabled={data.options.length >= 5}
                                            className="flex items-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-30"
                                        >
                                            <Plus size={14} /> Tambah Opsi
                                        </button>
                                    </div>

                                    <div className="grid gap-3">
                                        {data.options.map((option, index) => {
                                            const letter = String.fromCharCode(97 + index);
                                            const isSelected = data.jawaban_benar === index;

                                            return (
                                                <motion.div 
                                                    layout
                                                    key={index}
                                                    className={`group relative p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                                >
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        {/* Radio & Label */}
                                                        <div className="flex items-start gap-3">
                                                            <button 
                                                                type="button"
                                                                onClick={() => setData('jawaban_benar', index)}
                                                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all shadow-sm ${isSelected ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                                            >
                                                                {letter.toUpperCase()}
                                                            </button>
                                                        </div>

                                                        {/* Textarea & File Upload */}
                                                        <div className="flex-1 space-y-3">
                                                            <textarea 
                                                                value={option.teks} 
                                                                onChange={e => handleOptionChange(index, 'teks', e.target.value)}
                                                                rows="1"
                                                                className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium text-slate-700 placeholder:text-slate-300 resize-none"
                                                                placeholder={`Isi jawaban untuk opsi ${letter.toUpperCase()}...`}
                                                                required
                                                            />
                                                            
                                                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                                                <label className="flex items-center gap-2 cursor-pointer group/file">
                                                                    <div className="p-1.5 bg-slate-100 group-hover/file:bg-blue-100 text-slate-400 group-hover/file:text-blue-600 rounded-md transition-colors">
                                                                        <ImageIcon size={12}/>
                                                                    </div>
                                                                    <input 
                                                                        type="file" accept="image/*" className="hidden" 
                                                                        onChange={e => handleOptionChange(index, 'gambar', e.target.files[0])}
                                                                    />
                                                                    <span className="text-[10px] font-bold text-slate-400 group-hover/file:text-blue-600">
                                                                        {option.gambar ? 'Gambar dipilih' : 'Lampirkan Gambar'}
                                                                    </span>
                                                                </label>

                                                                {(option.existing_gambar || option.gambar) && !option.remove_gambar && (
                                                                    <div className="flex items-center gap-2 px-2 py-1 bg-white border rounded-md shadow-sm">
                                                                        <span className="text-[9px] font-bold text-blue-600">Preview ada</span>
                                                                        <button type="button" onClick={() => handleOptionChange(index, 'remove_gambar', true)} className="text-rose-500 hover:text-rose-700">
                                                                            <X size={12}/>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Tombol Hapus Opsi */}
                                                        {data.options.length > 2 && (
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeOption(index)}
                                                                className="md:opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors text-sm uppercase tracking-wider">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="flex items-center gap-2 px-8 py-2 rounded-xl font-bold text-white bg-blue-900 hover:bg-indigo-950 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 text-sm uppercase tracking-wider">
                                    {processing ? 'Menyimpan...' : <><Save size={16} /> Simpan</>}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}