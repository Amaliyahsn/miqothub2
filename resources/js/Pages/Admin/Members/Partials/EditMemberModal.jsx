import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, X, Upload, User, Book, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EditMemberModal({ isOpen, onClose, member, classes = [] }) {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, clearErrors, reset, errors } = useForm({
        _method: 'put', 
        name: '', 
        email: '', 
        pekerjaan: '', 
        umur: '', 
        alamat: '', 
        status: '', 
        status_akun: '',
        class_id: '', 
        password: '', 
        foto_profile: null
    });

    // 1. Ambil ID kelas yang sudah diikuti untuk filter dropdown
    const followedCourseIds = member?.transactions?.flatMap(trx => 
        trx.courses?.map(c => c.id)
    ) || [];

    // 2. Filter list classes agar hanya menampilkan yang BELUM diikuti
    const availableClasses = classes.filter(item => !followedCourseIds.includes(item.id));

    // 3. Ambil data nama kelas yang sudah diikuti untuk ditampilkan di UI
    const currentCourses = member?.transactions?.flatMap(trx => 
        trx.courses?.map(c => ({ id: c.id, nama: c.nama }))
    ) || [];

    useEffect(() => {
        if (member && isOpen) {
            clearErrors();
            setData({
                _method: 'put',
                name: member.name || '', 
                email: member.email || '', 
                pekerjaan: member.pekerjaan || '', 
                umur: member.umur || '', 
                alamat: member.alamat || '', 
                status: member.status || '', 
                status_akun: member.status_akun || 'aktif',
                class_id: '', 
                password: '', 
                foto_profile: null 
            });
            setPreview(member.foto_profile ? `/storage/${member.foto_profile}` : null);
        }
    }, [member, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto_profile', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.members.update', member.id), { 
            forceFormData: true, 
            onSuccess: () => {
                reset();
                setPreview(null);
                onClose();
            },
            preserveScroll: true
        });
    };

    return (
        <AnimatePresence>
            {isOpen && member && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose} 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer transition-opacity" 
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 15 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 15 }} 
                        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh] border border-slate-100"
                    >
                        
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                                <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
                                    <Edit size={20} strokeWidth={2.5} />
                                </div>
                                Perbarui Profil Member
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-5 overflow-y-auto scrollbar-thin bg-white">
                            
                            {/* FOTO PROFILE SECTION */}
                            <div className="flex items-center gap-5 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0 relative group">
                                    {preview ? (
                                        <img src={preview} alt="Preview Profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={28} className="text-slate-300" />
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="text-white" size={18} />
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-slate-800 mb-0.5">Foto Profil Member</h3>
                                    <p className="text-[11px] font-medium text-slate-500 mb-2.5">Format JPG/PNG/GIF. Maksimal 2MB.</p>
                                    {errors.foto_profile && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.foto_profile}</p>}
                                </div>
                            </div>

                            {/* TAMPILAN KELAS YANG SUDAH DIIKUTI */}
                            {currentCourses.length > 0 && (
                                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                                    <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2 block">Kelas yang sedang diikuti</label>
                                    <div className="flex flex-wrap gap-2">
                                        {currentCourses.map((course) => (
                                            <span key={course.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold shadow-sm">
                                                <CheckCircle2 size={12} />
                                                {course.nama}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* BARIS 1: NAMA & EMAIL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors" required />
                                    {errors.name && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Email Aktif</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors" required />
                                    {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
                                </div>
                            </div>

                            {/* BARIS 2: PASSWORD & STATUS AKUN */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <div>
                                    <label className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        <span>Ganti Password</span>
                                        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md tracking-widest text-[9px]">Opsional</span>
                                    </label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Kosongkan jika tak diubah" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors" />
                                    {errors.password && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status Akun</label>
                                    <select value={data.status_akun} onChange={e => setData('status_akun', e.target.value)} className={`w-full rounded-xl py-3 px-4 text-sm font-bold tracking-wide outline-none transition-colors cursor-pointer appearance-none shadow-sm ${data.status_akun === 'aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                        <option value="aktif">AKTIF</option>
                                        <option value="suspen">SUSPEN (BLOKIR)</option>
                                        <option value="pending">PENDING</option>
                                    </select>
                                </div>
                            </div>

                            {/* BARIS 3: KELAS & PEKERJAAN */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                        Daftarkan ke Kelas Baru
                                    </label>
                                    <div className="relative">
                                        <select 
                                            value={data.class_id} 
                                            onChange={e => setData('class_id', e.target.value)}
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="">-- Pilih Kelas --</option>
                                            {availableClasses.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.nama}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Book size={16} />
                                        </div>
                                    </div>
                                    {availableClasses.length === 0 && (
                                        <p className="text-[10px] text-amber-600 mt-1 font-medium italic">*Semua kelas sudah diikuti.</p>
                                    )}
                                    {errors.class_id && <p className="text-rose-500 text-xs mt-1.5 font-semibold">{errors.class_id}</p>}
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                        Pekerjaan
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.pekerjaan} 
                                        onChange={e => setData('pekerjaan', e.target.value)} 
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors" 
                                    />
                                </div>
                            </div>

                            {/* BARIS 4: UMUR & STATUS PERNIKAHAN */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Umur</label>
                                    <input type="number" value={data.umur} onChange={e => setData('umur', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status Pernikahan</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-blue-500 py-3 px-4 text-sm font-semibold transition-colors cursor-pointer appearance-none">
                                        <option value="">Pilih...</option>
                                        <option value="menikah">Menikah</option>
                                        <option value="belum">Belum Menikah</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Alamat Lengkap</label>
                                <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="2" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors resize-none"></textarea>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">Batal</button>
                                <button type="submit" disabled={processing} className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-md flex items-center gap-2 text-sm disabled:opacity-70">
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}