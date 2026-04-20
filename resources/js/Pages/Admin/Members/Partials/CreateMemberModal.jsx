import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Layout } from 'lucide-react';

export default function CreateMemberModal({ isOpen, onClose, allCourses = [] }) {
    // Tambahkan log ini untuk debugging di browser (F12 -> Console)
    console.log("Data Courses di Modal:", allCourses);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '', 
        email: '', 
        password: '', 
        password_confirmation: '', 
        pekerjaan: '', 
        umur: '', 
        alamat: '', 
        status: '', 
        status_akun: 'aktif',
        course_id: '' 
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.members.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <UserPlus size={20} strokeWidth={2.5} />
                                </div>
                                Registrasi Member Manual
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-5 overflow-y-auto scrollbar-thin bg-white">
                            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 mb-2">
                                <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Layout size={14}/> Pilih Kelas Untuk Member Ini
                                </label>
                                <div className="relative">
                                    <select 
                                        value={data.course_id} 
                                        onChange={e => setData('course_id', e.target.value)} 
                                        className={`w-full rounded-xl border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500/20 py-3 px-4 text-sm font-semibold shadow-sm outline-none transition-colors cursor-pointer appearance-none ${errors.course_id ? 'border-rose-500' : ''}`}
                                    >
                                        <option value="">-- Berikan Akses Kelas --</option>
                                        {allCourses && allCourses.length > 0 ? (
                                            allCourses.map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.nama || course.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled value="">Tidak ada kelas tersedia</option>
                                        )}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                                {errors.course_id && <p className="text-rose-500 text-[10px] mt-1.5 font-bold italic">{errors.course_id}</p>}
                                <p className="text-[10px] text-slate-400 mt-2 font-medium italic">* Jika dipilih, member akan langsung terdaftar di kelas tersebut secara otomatis.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={`w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors ${errors.name ? 'border-rose-500' : ''}`} required />
                                    {errors.name && <p className="text-rose-500 text-[10px] mt-1.5 font-bold italic">{errors.name}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Email Aktif</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={`w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors ${errors.email ? 'border-rose-500' : ''}`} required />
                                    {errors.email && <p className="text-rose-500 text-[10px] mt-1.5 font-bold italic">{errors.email}</p>}
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Password</label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className={`w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors ${errors.password ? 'border-rose-500' : ''}`} required />
                                    {errors.password && <p className="text-rose-500 text-[10px] mt-1.5 font-bold italic">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Konfirmasi Password</label>
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors" required />
                                </div>
                                
                                <div className="md:col-span-2 border-t border-slate-100 my-2"></div>
                                
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Pekerjaan</label>
                                    <input type="text" value={data.pekerjaan} onChange={e => setData('pekerjaan', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Umur</label>
                                        <input type="number" value={data.umur} onChange={e => setData('umur', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-blue-500 py-3 px-4 text-sm font-semibold transition-colors cursor-pointer appearance-none">
                                            <option value="">Pilih...</option>
                                            <option value="menikah">Menikah</option>
                                            <option value="belum">Belum</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Status Akun</label>
                                    <select value={data.status_akun} onChange={e => setData('status_akun', e.target.value)} className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-blue-500 py-3 px-4 text-sm font-semibold transition-colors cursor-pointer appearance-none">
                                        <option value="aktif">Otomatis Aktif</option>
                                        <option value="pending">Pending</option>
                                        <option value="suspen">Suspen</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Alamat Lengkap</label>
                                    <textarea value={data.alamat} onChange={e => setData('alamat', e.target.value)} rows="2" className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 py-3 px-4 text-sm font-medium transition-colors resize-none"></textarea>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 transition-colors shadow-md flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                                    {processing ? 'Menyimpan...' : 'Simpan Member'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}