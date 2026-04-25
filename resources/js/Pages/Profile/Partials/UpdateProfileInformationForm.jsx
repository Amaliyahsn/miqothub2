import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState } from 'react';
import { Camera, CheckCircle2 } from 'lucide-react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const [preview, setPreview] = useState(null);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        pekerjaan: user.pekerjaan || '',
        umur: user.umur || '',
        alamat: user.alamat || '',
        status: user.status || 'belum',
        foto_profile: null,
        _method: 'PATCH', 
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto_profile', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // Paksa sebagai form data agar file terkirim
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setPreview(null),
        });
    };

    const inputStyle = "mt-1 block w-full rounded-xl border-slate-200 text-slate-700 font-semibold focus:border-blue-950 focus:ring-blue-950/10 shadow-sm transition-all";

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-50">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-3xl bg-blue-950 flex items-center justify-center text-white overflow-hidden shadow-xl border-4 border-white">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                            ) : user.foto_profile ? (
                                <img src={`/storage/${user.foto_profile}`} className="w-full h-full object-cover" alt={user.name} />
                            ) : (
                                <span className="text-3xl font-black">{user.name.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all">
                            <Camera size={18} />
                            <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                        </label>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-blue-950 uppercase tracking-widest">Foto Profil</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Gunakan foto wajah yang jelas. Format JPG/PNG, Max 2MB.</p>
                        <InputError className="mt-2" message={errors.foto_profile} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" className="text-blue-950 font-black uppercase text-[10px] tracking-widest mb-1.5" />
                        <TextInput id="name" className={inputStyle} value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Alamat Email" className="text-blue-950 font-black uppercase text-[10px] tracking-widest mb-1.5" />
                        <TextInput id="email" type="email" className={inputStyle} value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="pekerjaan" value="Pekerjaan" className="text-blue-950 font-black uppercase text-[10px] tracking-widest mb-1.5" />
                        <TextInput id="pekerjaan" className={inputStyle} value={data.pekerjaan} onChange={(e) => setData('pekerjaan', e.target.value)} placeholder="Contoh: Pegawai Swasta" />
                        <InputError className="mt-2" message={errors.pekerjaan} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="umur" value="Umur" className="text-blue-950 font-black uppercase text-[10px] tracking-widest mb-1.5" />
                            <TextInput id="umur" type="number" className={inputStyle} value={data.umur} onChange={(e) => setData('umur', e.target.value)} />
                            <InputError className="mt-2" message={errors.umur} />
                        </div>
                        <div>
                            <InputLabel htmlFor="status" value="Status" className="text-blue-950 font-black uppercase text-[10px] tracking-widest mb-1.5" />
                            <select 
                                id="status" 
                                className={inputStyle}
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="belum">Belum Menikah</option>
                                <option value="menikah">Sudah Menikah</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="alamat" value="Alamat Lengkap" className="text-blue-950 font-black uppercase text-[10px] tracking-widest mb-1.5" />
                    <textarea 
                        id="alamat" 
                        className={`${inputStyle} h-28 py-3`}
                        value={data.alamat}
                        onChange={(e) => setData('alamat', e.target.value)}
                        placeholder="Masukkan alamat rumah lengkap Anda..."
                    ></textarea>
                    <InputError className="mt-2" message={errors.alamat} />
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <PrimaryButton 
                        disabled={processing}
                        className="px-8 py-3 bg-blue-950 hover:bg-blue-900 shadow-lg shadow-blue-900/20"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                            <CheckCircle2 size={16} /> Berhasil disimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}