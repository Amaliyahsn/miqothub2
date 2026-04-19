import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Calendar, Eye } from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Index({ auth, posts }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
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
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Berita & Kegiatan</h2>}
        >
            <Head title="Manajemen Berita" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Daftar Postingan</h3>
                                <p className="text-sm text-slate-500">Kelola semua pengumuman dan kegiatan MiqotHub.</p>
                            </div>
                            <PrimaryButton onClick={() => openModal()} className="flex gap-2">
                                <Plus size={18} /> Tambah Berita
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4">Thumbnail</th>
                                        <th className="px-6 py-4">Judul & Kategori</th>
                                        <th className="px-6 py-4">Tanggal</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-20 h-12 rounded-lg bg-slate-100 overflow-hidden">
                                                    {post.image ? (
                                                        <img src={`/storage/${post.image}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Image</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 line-clamp-1">{post.title}</div>
                                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">{post.category}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(post.created_at).toLocaleDateString('id-ID')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openModal(post)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button onClick={() => deletePost(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
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
            </div>

            {/* Modal Tambah/Edit */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">
                        {editData ? 'Edit Berita' : 'Tambah Berita Baru'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="title" value="Judul Berita" />
                            <TextInput
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Masukkan judul menarik..."
                                required
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="category" value="Kategori" />
                            <select
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            >
                                <option value="Kegiatan">Kegiatan</option>
                                <option value="Berita">Berita</option>
                                <option value="Pengumuman">Pengumuman</option>
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="image" value="Thumbnail (Maks 2MB)" />
                            <input
                                type="file"
                                id="image"
                                onChange={(e) => setData('image', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <InputError message={errors.image} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="content" value="Konten / Isi Berita" />
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="5"
                                placeholder="Tulis isi berita di sini..."
                                required
                            ></textarea>
                            <InputError message={errors.content} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {editData ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}