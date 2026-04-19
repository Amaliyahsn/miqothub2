import { Head, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
    BookOpen,
    ShieldCheck,
    MessageSquareShare,
    Award,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    PlayCircle,
    FileText,
    X,
    ChevronRight,
    Play,
    Star,
    Calendar, // Ditambahkan untuk hero
    MapPin    // Ditambahkan untuk hero
} from "lucide-react";

export default function Welcome({
    auth,
    courses = [],
    app_settings = {},
    reviews = [],
}) {
    const [activePreview, setActivePreview] = useState(null);

    // Mencegah scroll pada body ketika modal terbuka (Khusus Mobile)
    useEffect(() => {
        if (activePreview) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [activePreview]);

    const previewMaterials = courses.reduce((acc, course) => {
        let coursePreviews = [];
        if (course.chapters) {
            course.chapters.forEach((chapter) => {
                if (chapter.materials) {
                    chapter.materials.forEach((material) => {
                        if (material.is_preview) {
                            coursePreviews.push({
                                ...material,
                                courseName: course.nama,
                            });
                        }
                    });
                }
            });
        }
        return [...acc, ...coursePreviews];
    }, []);

    const fadeUpVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);

    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes("youtube.com/watch?v="))
            return url.replace("watch?v=", "embed/");
        if (url.includes("youtu.be/"))
            return url.replace("youtu.be/", "youtube.com/embed/");
        return url;
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-500 selection:text-white relative overflow-x-hidden scroll-smooth">
            <Head title="Platform Pembelajaran Digital" />

            {/* Navigation - Diubah menjadi tema gelap/transparan agar menyatu dengan background */}
            <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-[#white]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl sm:text-2xl font-black tracking-tighter text-white flex items-center gap-2"
                    >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <BookOpen size={18} strokeWidth={2.5} />
                        </div>
                        Miqot<span className="text-blue-400">Hub</span>
                    </motion.div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-[#0B1E20] rounded-full hover:bg-slate-200 transition-colors duration-300 shadow-sm"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="font-semibold text-sm text-white/80 
                                px-4 py-2 rounded-full 
                                border border-white/20 
                                hover:border-white hover:text-white 
                                hover:bg-white/10 
                                transition-all duration-300 hidden sm:block"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                                >
                                    Daftar Sekarang
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ================= HERO SECTION (FULL BACKGROUND) ================= */}
            <main 
                className="relative z-10 w-full min-h-[90vh] md:min-h-screen flex items-center bg-cover bg-center bg-no-repeat pt-20"
                style={{ backgroundImage: "url('/assets/images/lp-1.png')" }}
            >
                {/* Ultra-Thin Cinematic Overlay */}
                <div className="absolute inset-0 z-0">
                    {/* Lapisan 1: Gradien Dasar yang sangat tipis (Hanya untuk menjaga kontras teks di sisi kiri) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/30 to-transparent"></div>
                    
                    {/* Lapisan 2: Vignette yang lebih transparan (Hanya menggelapkan bagian tepi layar secara halus) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(15,23,42,0.25)_100%)]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                        className="max-w-3xl text-left"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Meta Info Header */}
                        <motion.div
                            variants={fadeUpVariant}
                            className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/80 text-xs sm:text-sm font-bold tracking-wider uppercase mb-8"
                        >
                            <div className="flex items-center gap-2 text-blue-400 border-b border-blue-400 pb-1">
                                <Sparkles size={16} /> 
                                Edukasi Digital
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                Online Platform
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            variants={fadeUpVariant}
                            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6"
                        >
                            Bantu Kamu Lolos <br />
                            <span className="text-blue-400">TKH & PPIH</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            variants={fadeUpVariant}
                            className="text-base sm:text-lg md:text-xl text-white/80 mb-10 max-w-xl leading-relaxed font-light"
                        >
                            Materi disusun sederhana, mudah dipahami, dan
                            langsung bisa digunakan dalam situasi nyata untuk
                            persiapan menjadi Petugas Haji ke Tanah Suci.
                        </motion.p>

                      {/* CTA Buttons */}
<motion.div
    variants={fadeUpVariant}
    className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
>
    <Link
        href={route("register")}
        className="group relative w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs sm:text-sm overflow-hidden transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
    >
        {/* Efek kilauan saat hover */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        
        <span>Daftar Sekarang</span>
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
    </Link>

    <a
        href="#fitur"
        className="w-full sm:w-auto px-10 py-4 bg-white/5 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group"
    >
        <span>Lihat Fitur</span>
        <ChevronRight size={20} className="text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
    </a>
</motion.div>

{/* Tambahkan ini di file CSS global atau di dalam tag <style> jika menggunakan Tailwind biasa */}
<style jsx>{`
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
`}</style>
                    </motion.div>
                </div>

                {/* Bottom Stats / Categories Bar */}
                <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-[#white]/50 backdrop-blur-md hidden md:block">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between text-white/60 text-xs font-bold uppercase tracking-[0.2em]">
                        <span className="hover:text-white cursor-pointer transition-colors">Materi Lengkap</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Latihan soal</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Zoom Class</span>
                        <span className="hover:text-white cursor-pointer transition-colors">E-book</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Komunitas</span>
                    </div>
                </div>
            </main>

            {/* DIKURANGI pt-16 menjadi pt-8 agar section ini tidak terlalu melompong di atas */}{/* Section Program Kelas */}
<section
    id="pricelist"
    className="relative z-10 pt-8 pb-16 md:pt-12 md:pb-24 bg-[#F8FAFC]"
>
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6"
    >
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-12 gap-4 text-center md:text-left">
            <div>
                <motion.h2
                    variants={fadeUpVariant}
                    className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2"
                >
                    Program Kelas
                </motion.h2>
                <motion.p
                    variants={fadeUpVariant}
                    className="text-slate-500 text-sm sm:text-base"
                >
                    Pilih program komprehensif yang sesuai dengan kebutuhan Anda.
                </motion.p>
            </div>
        </div>

        {/* LOGIKA FILTER: Menghitung kelas yang tidak expired */}
        {courses.filter(course => !course.is_expired).length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200 shadow-sm mx-2 sm:mx-0">
                <BookOpen
                    size={40}
                    className="mx-auto text-slate-300 mb-4"
                />
                <h3 className="text-lg font-bold text-slate-500">
                    Belum Ada Kelas yang Tersedia
                </h3>
                <p className="text-slate-400 text-sm mt-1">Nantikan pembukaan batch selanjutnya!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {courses
                    /* FILTER: Hanya tampilkan yang is_expired-nya false */
                    .filter(course => !course.is_expired)
                    .map((course, idx) => (
                        <motion.div
                            key={course.id}
                            variants={fadeUpVariant}
                            className="bg-gradient-to-br from-blue-50/80 via-white/90 to-blue-50/50 backdrop-blur-md rounded-[2rem] border border-white p-3 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500 flex flex-col group"
                        >
                            {/* Area Thumbnail */}
                            <div className="relative h-48 sm:h-56 rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-inner">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.nama}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-100/30">
                                        <BookOpen
                                            size={40}
                                            className="text-blue-200"
                                        />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                                    <span className="px-3 py-1.5 bg-blue-900/90 backdrop-blur-md rounded-lg text-[10px] sm:text-xs font-bold text-white shadow-lg border border-white/20">
                                        Batch {course.batch}
                                    </span>
                                </div>
                            </div>

                            {/* Konten */}
                            <div className="p-5 sm:p-6 flex flex-col flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-blue-950 leading-snug mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                                    {course.nama}
                                </h3>

                                <div className="mb-5 sm:mb-6 flex flex-col gap-0.5 pb-5 sm:pb-6 border-b border-blue-100/50">
                                    {course.harga_coret > 0 && (
                                        <span className="text-xs sm:text-sm font-medium text-slate-400 line-through decoration-slate-300">
                                            {formatRupiah(course.harga_coret)}
                                        </span>
                                    )}
                                    <span className="text-2xl sm:text-3xl font-black text-blue-900 drop-shadow-sm">
                                        {formatRupiah(course.harga)}
                                    </span>
                                </div>

                                {/* List Fitur */}
                                <div className="flex-1 space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                                    {(() => {
                                        let fiturList = [];
                                        try {
                                            fiturList = typeof course.fitur === "string"
                                                ? JSON.parse(course.fitur)
                                                : Array.isArray(course.fitur)
                                                    ? course.fitur
                                                    : [];
                                        } catch (e) {
                                            fiturList = [];
                                        }

                                        return fiturList.map((item, i) => (
                                            <div key={i} className="flex items-start gap-2.5">
                                                <div className="bg-blue-100 rounded-full p-0.5 mt-0.5">
                                                    <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                                                </div>
                                                <span className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2">
                                                    {item}
                                                </span>
                                            </div>
                                        ));
                                    })()}
                                </div>

                                <Link
                                    href={auth?.user ? route("member.catalog") : route("register")}
                                    className="w-full py-3.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl font-bold text-sm sm:text-base text-center hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-900/10 active:scale-[0.98]"
                                >
                                    Daftar Sekarang
                                </Link>
                            </div>
                        </motion.div>
                    ))}
            </div>
        )}
    </motion.div>
</section>


<section
    id="fitur"
    /* Dikurangi dari py-16/24 menjadi py-10 md:py-14 untuk merapatkan jarak antar section */
    className="relative z-10 py-10 md:py-14 bg-white border-t border-slate-100"
>
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6"
    >
        {/* mb-10/16 dikurangi menjadi mb-8 md:mb-10 agar judul lebih dekat ke kartu fitur */}
        <div className="text-center mb-8 md:mb-10">
            <motion.h2
                variants={fadeUpVariant}
                className="text-2xl sm:text-3xl font-black text-slate-900 mb-2"
            >
                Fitur Pembelajaran
            </motion.h2>
            <motion.p
                variants={fadeUpVariant}
                className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto px-2 leading-relaxed"
            >
                Sistem cerdas (LMS) yang terstruktur untuk hasil
                belajar yang maksimal.
            </motion.p>
        </div>

        {/* Gap antar grid dirapatkan sedikit untuk tampilan laptop yang lebih padat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
                {
                    icon: BookOpen,
                    title: "Materi Terstruktur",
                    desc: "Modul pembelajaran yang selalu diperbarui, dilengkapi video, PDF, dan text interaktif.",
                },
                {
                    icon: ShieldCheck,
                    title: "Evaluasi Instan",
                    desc: "Latihan soal berbasis komputer (CBT) yang merekam dan menilai progres otomatis.",
                },
                {
                    icon: MessageSquareShare,
                    title: "Notifikasi Cepat",
                    desc: "Tetap terhubung dengan kelas Anda. Dapatkan update jadwal secara langsung.",
                },
                {
                    icon: Award,
                    title: "Rekap Terpadu",
                    desc: "Pantau nilai latihan, masa aktif kelas, dan kelola profil Anda dengan mudah.",
                },
            ].map((fitur, idx) => (
                <motion.div
                    key={idx}
                    variants={fadeUpVariant}
                    /* p-6 sm:p-8 diubah menjadi p-6 agar tinggi kartu tidak terlalu dominan */
                    className="p-6 bg-[#F8FAFC] rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
                >
                    <div className="w-11 h-11 bg-white border border-slate-200 text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <fitur.icon size={20} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                        {fitur.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed">
                        {fitur.desc}
                    </p>
                </motion.div>
            ))}
        </div>
    </motion.div>
</section>

            {/* --- TESTIMONY SECTION WITH DARK MESH GRADIENT --- */}
            <section
                id="testimoni"
                className="relative z-10 py-14 md:py-20 bg-slate-900 overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10"
                >
                    <div className="text-center mb-12 md:mb-16">
                        <motion.span
                            variants={fadeUpVariant}
                            className="text-blue-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm mb-2 block"
                        >
                            Testimoni
                        </motion.span>
                        <motion.h2
                            variants={fadeUpVariant}
                            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3"
                        >
                            Apa Kata Mereka?
                        </motion.h2>
                        <motion.p
                            variants={fadeUpVariant}
                            className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto"
                        >
                            Pengalaman nyata dari mereka yang telah bergabung di
                            MiqotHub.
                        </motion.p>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="text-center text-slate-500 italic text-sm">
                            Belum ada ulasan saat ini.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {reviews.map((review, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeUpVariant}
                                    className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className={
                                                    i < review.rating
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-slate-600"
                                                }
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                                        "{review.komentar}"
                                    </p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-lg shadow-blue-500/20">
                                            {review.user.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">
                                                {review.user.name}
                                            </h4>
                                            <p className="text-blue-400 text-[10px] uppercase tracking-widest font-bold">
                                                Member
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </section>

            <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-xs sm:text-sm z-10 relative">
                <p>
                    &copy; {new Date().getFullYear()} MiqotHub. All rights reserved. 
                </p>
            </footer>

            <AnimatePresence>
                {activePreview && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6 z-50">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActivePreview(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
                        />

                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                            }}
                            className="relative w-full sm:max-w-4xl bg-white rounded-t-3xl sm:rounded-[2rem] shadow-2xl flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-hidden"
                        >
                            <button
                                onClick={() => setActivePreview(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-slate-900/10 hover:bg-slate-900 text-slate-700 hover:text-white rounded-full backdrop-blur-md transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-full flex justify-center py-3 sm:hidden absolute top-0 z-40 bg-gradient-to-b from-slate-900/40 to-transparent pointer-events-none">
                                <div className="w-12 h-1.5 bg-white/50 rounded-full"></div>
                            </div>

                            <div className="overflow-y-auto scrollbar-thin flex-1 flex flex-col bg-white">
                                {activePreview.tipe === "video" &&
                                activePreview.link_video ? (
                                    <div className="w-full aspect-video bg-black relative shrink-0">
                                        <iframe
                                            src={getEmbedUrl(
                                                activePreview.link_video,
                                            )}
                                            className="absolute inset-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : activePreview.tipe === "pdf" ||
                                  activePreview.file_path ? (
                                    <div className="w-full h-[50vh] sm:h-[60vh] bg-slate-100 relative shrink-0 border-b border-slate-200">
                                        <iframe
                                            src={`/storage/${activePreview.file_path}`}
                                            className="absolute inset-0 w-full h-full"
                                            title="PDF Viewer"
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="w-full py-16 bg-slate-50 flex flex-col items-center justify-center text-slate-400 shrink-0 border-b border-slate-200">
                                        <FileText
                                            size={40}
                                            className="mb-3 text-slate-300"
                                        />
                                        <p className="font-medium text-xs sm:text-sm">
                                            Materi berbasis teks. Silakan baca
                                            di bawah.
                                        </p>
                                    </div>
                                )}

                                <div className="p-5 sm:p-8 md:p-10 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                                        <div>
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-md mb-3 inline-block">
                                                Free Preview
                                            </span>
                                            <h3 className="font-black text-slate-900 text-xl sm:text-2xl md:text-3xl leading-tight mb-2">
                                                {activePreview.judul}
                                            </h3>
                                            <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-1.5 font-medium">
                                                <BookOpen
                                                    size={14}
                                                    className="text-blue-500 shrink-0"
                                                />{" "}
                                                Bagian dari:{" "}
                                                <span className="text-slate-700 font-bold truncate">
                                                    {activePreview.courseName}
                                                </span>
                                            </p>
                                        </div>
                                        <Link
                                            href={route("register")}
                                            className="shrink-0 w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
                                        >
                                            Daftar Kelas{" "}
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>

                                    {activePreview.deskripsi && (
                                        <div className="pt-5 border-t border-slate-100">
                                            <h4 className="font-bold text-slate-900 text-sm mb-3">
                                                Deskripsi Materi
                                            </h4>
                                            <div
                                                className="prose prose-sm prose-slate max-w-none text-slate-600 text-sm"
                                                dangerouslySetInnerHTML={{
                                                    __html: activePreview.deskripsi,
                                                }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating WhatsApp Button */}
            <a
                href={`https://wa.me/${app_settings?.wa_admin || " "}?text=${encodeURIComponent(
                    app_settings?.wa_message ||
                        "Halo Admin, saya ingin bertanya tentang kelas di MiqotHub",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-5 right-5 z-[999] group active:scale-90 transition-transform"
            >
                <div className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M20.52 3.48A11.82 11.82 0 0012.01 0C5.38 0 .02 5.36.02 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.21-1.63a11.9 11.9 0 005.8 1.48h.01c6.63 0 11.99-5.36 11.99-11.98 0-3.2-1.25-6.2-3.49-8.39z" />
                    </svg>

                    <span className="hidden sm:inline text-sm font-semibold">
                        Hubungi Admin
                    </span>
                </div>
            </a>
        </div>
    );
}
