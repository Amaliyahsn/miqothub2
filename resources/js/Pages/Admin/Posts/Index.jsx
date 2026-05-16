import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Calendar, Eye, Newspaper, FileText } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Index({ auth, posts }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        category: 'Kegiatan',
        content: '',
        image: null,
    });

    const openModal = (postData = null) => {
        if (postData) {
            setEditData(postData);
            setData({
                title: postData.title,
                category: postData.category,
                content: postData.content,
                image: null,
            });
        } else {
            setEditData(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editData) {
            // Untuk update dengan file di Laravel/Inertia, gunakan method POST dengan _method: PUT
            router.post(route('admin.posts.update', editData.id), {
                _method: 'put',
                ...data
            }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.posts.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const deletePost = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            router.delete(route('admin.posts.destroy', id));
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Berita" />

            {/* Header Section - Adaptif Mobile */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Newspaper className="text-blue-900 shrink-0" size={28} sm={32} /> Berita & Kegiatan
                    </h1>
                    <p className="text-slate-500 mt-1 font-semibold text-xs sm:text-sm">Kelola semua informasi, pengumuman, dan artikel MiqotHub.</p>
                </div>
                <button 
                    onClick={() => openModal()} 
                    className="flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 active:scale-95 text-xs sm:text-sm uppercase tracking-wider sm:normal-case sm:tracking-normal w-full sm:w-auto shrink-0"
                >
                    <Plus size={16} strokeWidth={2.5} /> Tambah Berita
                </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="block">
                
                {/* 📱 1. TAMPILAN RESMI SMARTPHONE / MOBILE (< sm) */}
                <div className="block sm:hidden space-y-4">
                    {posts.length === 0 ? (
                        <div className="bg-white p-10 rounded-2xl text-center border border-slate-200 text-slate-400 text-xs font-semibold">
                            Belum ada artikel berita atau pengumuman diterbitkan.
                        </div>
                    ) : (
                        posts.map((post, index) => (
                            <div 
                                key={post.id}
                                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4"
                            >
                                <div className="flex items-start gap-3.5">
                                    {/* Thumbnail Visual */}
                                    <div className="w-20 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                                        {post.image ? (
                                            <img src={`/storage/${post.image}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold bg-slate-50">No Image</div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <h4 className="font-black text-slate-800 text-xs sm:text-sm leading-snug break-words line-clamp-1">{post.title}</h4>
                                        
                                        {/* 🔥 TAMBAHAN: Deskripsi Cuplikan Berita Singkat di Mobile */}
                                        <p className="text-[11px] font-medium text-slate-400 line-clamp-2 leading-relaxed break-all">
                                            {post.content}
                                        </p>
                                        
                                        <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                                            post.category === 'Pengumuman' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                            post.category === 'Berita' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                            'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>{new Date(post.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => openModal(post)} className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-all" title="Edit Berita">
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => deletePost(post.id)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all" title="Hapus Berita">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 💻 2. TAMPILAN RESMI LAPTOP / DESKTOP (>= sm) */}
                <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="w-full overflow-x-auto scrollbar-thin">
                        <table className="w-full text-left border-collapse whitespace-nowrap table-auto">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-widest font-black">
                                    <th className="p-5 w-28">Thumbnail</th>
                                    <th className="p-5">Judul & Deskripsi Narasi</th>
                                    <th className="p-5 w-44">Tanggal Rilis</th>
                                    <th className="p-5 text-right pr-6 w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-5">
                                            <div className="w-20 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm">
                                                {post.image ? (
                                                    <img src={`/storage/${post.image}`} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold bg-slate-50">No Image</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-slate-900 line-clamp-1 max-w-md md:max-w-xl mb-1">{post.title}</div>
                                            
                                            {/* 🔥 TAMBAHAN: Deskripsi Cuplikan Berita Singkat di Desktop */}
                                            <div className="text-xs text-slate-400 font-medium line-clamp-1 max-w-md md:max-w-xl mb-2 flex items-center gap-1">
                                                <FileText size={12} className="shrink-0 text-slate-300" />
                                                <span className="truncate">{post.content}</span>
                                            </div>

                                            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-black uppercase border tracking-wider ${
                                                post.category === 'Pengumuman' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                post.category === 'Berita' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>{post.category}</span>
                                        </td>
                                        <td className="p-5 font-medium text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(post.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right pr-6">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => openModal(post)} className="p-2 text-slate-400 hover:bg-blue-100 hover:text-blue-900 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="Edit Berita">
                                                    <Pencil size={17} />
                                                </button>
                                                <button onClick={() => deletePost(post.id)} className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100" title="Hapus Berita">
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Modal Tambah/Edit */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-5 sm:p-6 space-y-4 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto scrollbar-thin">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            {editData ? 'Edit Dokumen Postingan' : 'Terbitkan Berita Baru'}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="title" value="Judul Postingan" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5" />
                            <TextInput
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:bg-white text-sm font-bold shadow-inner transition-all outline-none"
                                placeholder="Tuliskan judul berita/kegiatan resmi..."
                                required
                            />
                            <InputError message={errors.title} className="mt-1.5 text-xs font-bold uppercase" />
                        </div>

                        <div>
                            <InputLabel htmlFor="category" value="Kategori Informasi" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5" />
                            <select
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 block w-full border-slate-200 bg-slate-50 py-3 px-4 focus:bg-white rounded-xl shadow-inner text-sm font-bold text-slate-700 focus:border-blue-500 focus:ring-blue-500/20 cursor-pointer outline-none transition-all"
                            >
                                <option value="Kegiatan">Kegiatan</option>
                                <option value="Berita">Berita</option>
                                <option value="Pengumuman">Pengumuman</option>
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="image" value="Thumbnail Sampul (Maks 2MB)" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5" />
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files[0])}
                                className="mt-1 block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl p-1 bg-slate-50 shadow-inner"
                            />
                            <InputError message={errors.image} className="mt-1.5 text-xs font-bold uppercase" />
                        </div>

                        <div>
                            <InputLabel htmlFor="content" value="Isi Artikel / Konten Narasi" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5" />
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="mt-1 block w-full border-slate-200 bg-slate-50 py-3 px-4 focus:bg-white rounded-xl shadow-inner text-sm font-semibold leading-relaxed focus:border-blue-500 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                rows="5"
                                placeholder="Tuliskan isi pengumuman atau detail narasi kegiatan secara lengkap..."
                                required
                            ></textarea>
                            <InputError message={errors.content} className="mt-1.5 text-xs font-bold uppercase" />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-100">
                        <SecondaryButton onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto justify-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider sm:normal-case sm:tracking-normal">Batal</SecondaryButton>
                        <PrimaryButton disabled={processing} className="w-full sm:w-auto justify-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider sm:normal-case sm:tracking-normal">
                            {editData ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}