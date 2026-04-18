import React, { useState } from "react"; // Tambah useState
import MemberLayout from "@/Layouts/MemberLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion"; // Tambah AnimatePresence
import {
    BookOpen,
    Trophy,
    Sparkles,
    PlayCircle,
    Clock,
    ChevronRight,
    Compass,
    Star,
    MessageSquare,
    X,
    ClipboardCheck,
    Percent, // Tambahkan ini
} from "lucide-react";

export default function Dashboard({ auth, stats = {}, recentCourses = [] }) {
    // Tambahkan state untuk kontrol tampilan form ulasan
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const userStats = {
        kelas_aktif: stats.kelas_aktif || 0,
        kuis_selesai: stats.kuis_selesai || 0,
        sertifikat: stats.sertifikat || 0,
    };

    // Logic Form Testimoni
    const { data, setData, post, processing, reset, errors } = useForm({
        rating: 5,
        komentar: "",
    });

    const submitReview = (e) => {
        e.preventDefault();
        post(route("member.reviews.store"), {
            onSuccess: () => {
                reset();
                setIsReviewOpen(false); // Tutup form setelah sukses
                alert("Terima kasih atas ulasan Anda!");
            },
        });
    };

    return (
        <MemberLayout user={auth.user}>
            <Head title="Dashboard Member" />

            {/* ======================================= */}
            {/* HERO SECTION: AHLAN WA SAHLAN (Tetap) */}
            {/* ======================================= */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                // Padding diubah ke p-6 untuk mobile agar ruang teks lebih luas
                className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-2xl shadow-blue-950/20 relative overflow-hidden mb-10"
            >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[60px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
                    {/* Tambahan min-w-0 dan w-full sangat penting agar teks panjang bisa di-wrap dan tidak mendesak layar ke samping */}
                    <div className="flex-1 min-w-0 w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-blue-200 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-5 sm:mb-6">
                            <Sparkles
                                size={14}
                                className="text-blue-300 shrink-0"
                            />{" "}
                            Ruang Belajar Utama
                        </div>

                        {/* Tambahan leading-normal dan pb-2 untuk mencegah harakat Arab (seperti fathatain/dhammahtain) terpotong */}
                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl text-white font-arabic mb-2 drop-shadow-lg leading-normal pb-2"
                            dir="rtl"
                        >
                            أَهْلًا وَسَهْلًا
                        </h1>

                        {/* Tambahan break-words agar jika nama user sangat panjang, akan otomatis turun ke bawah, bukan memotong layar */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 tracking-tight drop-shadow-md break-words leading-tight">
                            Selamat Datang , {auth.user.name.split(" ")[0]}!
                        </h2>

                        {/* Teks diperkecil sedikt di mobile (text-sm) agar lebih proporsional */}
                        <p className="text-blue-200 text-sm sm:text-base md:text-lg max-w-[500px] md:max-w-2xl font-medium leading-relaxed">
                            Semoga Allah memberikan kemudahan dalam setiap
                            langkah belajarmu. Lanjutkan progres materi hari ini
                            dan persiapkan dirimu dengan{" "}
                            <span className="inline-block whitespace-nowrap">
                                sebaik-baiknya.
                            </span>
                        </p>
                    </div>

                    <div className="hidden lg:flex flex-col gap-3 shrink-0 w-64">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 shadow-inner">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-300">
                                <Clock size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1">
                                    Waktu Saat Ini
                                </p>
                                <p className="text-lg font-black text-white tracking-wider">
                                    {new Date().toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}{" "}
                                    WIB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ======================================= */}
            {/* WIDGET STATISTIK (Tetap) */}
            {/* ======================================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-xl hover:shadow-blue-950/5 transition-all duration-300"
                >
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                        <BookOpen size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-blue-950 leading-none mb-1">
                            {userStats.kelas_aktif}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Kelas Diikuti
                        </p>
                    </div>
                </motion.div>

                {/* Kotak 2: Kuis & Persentase (Digabung agar informatif) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-xl transition-all duration-300"
                >
                    {/* Icon diganti ke ClipboardCheck agar lebih nyambung dengan Kuis */}
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                        <ClipboardCheck size={28} strokeWidth={2} />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black text-slate-800 leading-none mb-1">
                                {userStats.kuis_selesai}
                            </p>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Kuis Diselesaikan
                        </p>
                    </div>
                </motion.div>

                {/* Kotak Persentase Kelulusan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-xl transition-all duration-300"
                >
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                        <Trophy size={28} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-3xl font-black text-slate-800 leading-none">
                                {stats.persentase_lulus || 0}%
                            </p>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Tingkat Keberhasilan
                        </p>

                        {/* Progress Bar Kecil */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${stats.persentase_lulus || 0}%`,
                                }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-indigo-500 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-xl hover:shadow-amber-950/5 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                        <Trophy size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-slate-800 leading-none mb-1">{userStats.sertifikat}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sertifikat Diraih</p>
                    </div>
                </motion.div> */}
            </div>

            {/* ======================================= */}
            {/* AREA LANJUTKAN BELAJAR (Tetap) */}
            {/* ======================================= */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-blue-950 tracking-tight">
                        Lanjutkan Belajarmu
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">
                        Akses cepat ke kelas yang sedang kamu ikuti.
                    </p>
                </div>
                <Link
                    href={route("member.courses.index")}
                    className="hidden sm:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group"
                >
                    Lihat Semua Kelas{" "}
                    <ChevronRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            </div>

            {/* Recent Courses List (Tetap) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {recentCourses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full bg-white rounded-[2rem] border border-dashed border-slate-200 p-12 text-center flex flex-col items-center"
                    >
                        <Compass size={36} className="text-slate-300 mb-4" />
                        <h4 className="text-lg font-black text-slate-800 mb-2">
                            Belum Ada Kelas Aktif
                        </h4>
                        <Link
                            href={route("member.catalog")}
                            className="px-6 py-3 bg-blue-950 text-white font-bold rounded-xl"
                        >
                            Eksplorasi Katalog
                        </Link>
                    </motion.div>
                ) : (
                    recentCourses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="bg-white rounded-[1.5rem] p-3 shadow-sm border border-slate-100 flex flex-col hover:shadow-2xl transition-all group"
                        >
                            <div className="h-40 bg-slate-100 rounded-[1.25rem] relative overflow-hidden mb-4">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <BookOpen size={40} />
                                    </div>
                                )}
                            </div>
                            <h4 className="text-base font-black text-slate-800 px-2 line-clamp-2 mb-4">
                                {course.nama}
                            </h4>
                            <Link
                                href={route("member.courses.show", course.id)}
                                className="mt-auto w-full py-2.5 bg-slate-50 text-blue-950 border border-slate-200 rounded-xl text-sm font-bold hover:bg-blue-950 hover:text-white transition-all text-center"
                            >
                                Lanjutkan
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>

            {/* ======================================= */}
            {/* SECTION TESTIMONI: ELEGAN & GAK GANGGU */}
            {/* ======================================= */}
            <AnimatePresence mode="wait">
                {!isReviewOpen ? (
                    /* TAMPILAN AWAL: Hanya Banner Kecil (Nudge) */
                    <motion.div
                        key="nudge"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">
                                    Puas Belajar di MiqotHub?
                                </h4>
                                <p className="text-sm text-slate-500 font-medium">
                                    Bantu kami berkembang dengan memberikan
                                    testimoni Anda.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsReviewOpen(true)}
                            className="px-6 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                            Beri Ulasan
                        </button>
                    </motion.div>
                ) : (
                    /* TAMPILAN FORM: Muncul saat tombol diklik */
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-xl relative"
                    >
                        <button
                            onClick={() => setIsReviewOpen(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="md:w-1/3">
                                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                                    <MessageSquare
                                        size={28}
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                                    Bagikan Pengalaman Belajarmu!
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    Ulasanmu akan ditampilkan di landing page
                                    untuk membantu calon member lainnya.
                                </p>
                            </div>

                            <div className="flex-1 w-full bg-slate-50 p-6 md:p-8 rounded-[1.5rem] border border-slate-100">
                                <form
                                    onSubmit={submitReview}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                            Rating Bintang
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        setData("rating", star)
                                                    }
                                                    className="transition-transform active:scale-90"
                                                >
                                                    <Star
                                                        size={32}
                                                        className={
                                                            data.rating >= star
                                                                ? "text-amber-400 fill-amber-400"
                                                                : "text-slate-300"
                                                        }
                                                        strokeWidth={2}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                            Tulis Kesan Pesan
                                        </label>
                                        <textarea
                                            value={data.komentar}
                                            onChange={(e) =>
                                                setData(
                                                    "komentar",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Tuliskan pengalaman belajarmu di sini..."
                                            className="w-full bg-white rounded-2xl border-slate-200 text-sm font-medium focus:ring-blue-500 min-h-[120px] resize-none p-4"
                                            required
                                        ></textarea>
                                        {errors.komentar && (
                                            <p className="text-rose-500 text-xs mt-2 font-semibold">
                                                {errors.komentar}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-10 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                                        >
                                            {processing
                                                ? "Mengirim..."
                                                : "Kirim Testimoni"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsReviewOpen(false)
                                            }
                                            className="px-6 py-3.5 text-slate-400 font-bold text-sm hover:text-slate-600"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MemberLayout>
    );
}
