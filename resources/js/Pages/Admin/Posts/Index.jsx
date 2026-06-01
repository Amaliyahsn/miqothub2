import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Calendar, Newspaper, FileText, Image as ImageIcon } from 'lucide-react';
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
            router.post(route('admin.posts.update', editData.id), {
                _method: 'put',
                ...data
            }, {
                onSuccess: () => { setIsModalOpen(false); reset(); }
            });
        } else {
            post(route('admin.posts.store'), {
                onSuccess: () => { setIsModalOpen(false); reset(); }
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

            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Newspaper className="text-blue-600" size={28} /> Berita & Kegiatan
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Kelola konten informasi MiqotHub.</p>
                </div>
                <button 
                    onClick={() => openModal()} 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95 text-sm w-full sm:w-auto"
                >
                    <Plus size={18} /> Tambah Berita
                </button>
            </div>

            {/* --- LIST MOBILE (List Card) --- */}
            <div className="sm:hidden space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                            {post.image ? <img src={`/storage/${post.image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-slate-300"/></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{post.title}</h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{post.content}</p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md uppercase">{post.category}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(post)} className="text-slate-400 hover:text-blue-600"><Pencil size={16}/></button>
                                    <button onClick={() => deletePost(post.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- TABLE DESKTOP --- */}
            <div className="hidden sm:block bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="p-6">Thumbnail</th>
                            <th className="p-6">Informasi</th>
                            <th className="p-6">Kategori</th>
                            <th className="p-6 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-slate-50/50">
                                <td className="p-5">
                                    <div className="w-20 h-14 rounded-lg bg-slate-100 overflow-hidden border">
                                        {post.image ? <img src={`/storage/${post.image}`} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon size={16} className="text-slate-300"/></div>}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <p className="font-bold text-slate-900 mb-1">{post.title}</p>
                                    <p className="text-xs text-slate-400 truncate max-w-[300px]">{post.content}</p>
                                </td>
                                <td className="p-5">
                                    <span className="text-[10px] font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 uppercase">{post.category}</span>
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openModal(post)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={18} /></button>
                                        <button onClick={() => deletePost(post.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-6 space-y-5">
                    <h2 className="text-xl font-black text-slate-900">{editData ? 'Edit Berita' : 'Tambah Berita'}</h2>
                    <div>
                        <InputLabel value="Judul" />
                        <TextInput value={data.title} onChange={e => setData('title', e.target.value)} className="w-full mt-1" required />
                    </div>
                    <div>
                        <InputLabel value="Kategori" />
                        <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full mt-1 rounded-xl border-slate-300">
                            <option>Kegiatan</option>
                            <option>Berita</option>
                            <option>Pengumuman</option>
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Isi Berita" />
                        <textarea value={data.content} onChange={e => setData('content', e.target.value)} className="w-full mt-1 rounded-xl border-slate-300" rows={4} required />
                    </div>
                    <div>
                        <InputLabel value="Thumbnail" />
                        <input type="file" onChange={e => setData('image', e.target.files[0])} className="w-full mt-1 block text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}