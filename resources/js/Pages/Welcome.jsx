import { Head, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import CountUp from "react-countup"; // Pastikan sudah install: npm install react-countup
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
    Newspaper,
    Play,
    Star,
    Calendar,
    MapPin,
    TrendingUp,
    User,
    Clock,
    Share2,
    Tag
} from "lucide-react";

const StatItem = ({ value, label, icon, variants }) => {
    const numberValue = parseFloat(value?.replace(/[^0-9.]/g, '')) || 0;
    const suffix = value?.replace(/[0-9.]/g, '') || '';

    return (
        <motion.div 
            variants={variants}
            // Tambahkan items-center dan text-center agar konten selalu di tengah
            className="relative group flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-500 hover:bg-slate-50/50"
        >
            <div className="mb-5 flex justify-center">
                <div className="p-3 bg-white shadow-sm border border-slate-100 rounded-2xl group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    {icon}
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex justify-center items-baseline">
                    <CountUp 
                        end={numberValue} 
                        duration={2} 
                        enableScrollSpy={true} 
                        scrollSpyOnce={false} // PERBAIKAN: Agar animasi ulang saat di-scroll balik
                    />
                    <span className="text-blue-600 ml-0.5">{suffix}</span>
                </h3>
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-slate-500 group-hover:text-slate-700 transition-colors leading-relaxed">
                    {label}
                </p>
            </div>
            
            {/* Dekorasi Garis Bawah yang juga di tengah */}
            <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-blue-600 rounded-full group-hover:w-16 transition-all duration-500"></div>
        </motion.div>
    );
};

export default function Welcome({
    auth,
    courses = [],
    app_settings = {},
    reviews = [],
    latestPosts = [],
}) {

    const [activePreview, setActivePreview] = useState(null);
const [selectedCourse, setSelectedCourse] = useState(null);
// Di bagian atas komponen Anda
const [selectedPost, setSelectedPost] = useState(null);

    // Mencegah scroll pada body ketika modal terbuka
    useEffect(() => {
        document.body.style.overflow = activePreview ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [activePreview]);

    // PERBAIKAN: Gunakan useMemo agar kalkulasi data berat tidak dijalankan ulang setiap render
    const previewMaterials = useMemo(() => {
        return courses.flatMap(course => 
            (course.chapters || []).flatMap(chapter => 
                (chapter.materials || [])
                    .filter(material => material.is_preview)
                    .map(material => ({
                        ...material,
                        courseName: course.nama
                    }))
            )
        );
    }, [courses]);

    // Definisi Varian Animasi
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

    // Helper: Format Mata Uang
    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);

    // Helper: URL Embed Video
    const getEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) 
            ? `https://www.youtube.com/embed/${match[2]}` 
            : url;
    };

    

    // ... Lanjut ke bagian return JSX (Render Hero, Courses, dan Berita)
    return (
        <div className="min-h-screen bg-white text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-500 selection:text-white relative overflow-x-hidden scroll-smooth">
            <Head title="Platform Pembelajaran Digital" />

{/* Navigation - Clean Floating Design */}
{/* Navigation Container */}
<nav className="fixed w-full z-50 transition-all duration-300">
    
    {/* --- TOP BAR (Logo & Auth) --- */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="bg-white rounded-full px-6 sm:px-8 py-3 shadow-lg shadow-slate-200/60 flex justify-between items-center border-none">
            
            {/* Brand Logo */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2.5 group cursor-pointer"
            >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <BookOpen size={18} strokeWidth={2.5} />
                </div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                    Miqot<span className="text-blue-600">Hub</span>
                </span>
            </motion.div>

<div className="hidden md:flex items-center gap-8 lg:gap-10">
    {[
        { label: 'Kelas', target: 'pricelist' },
        { label: 'Fitur Pembelajaran', target: 'fitur' },
        { label: 'Berita Kegiatan', target: 'berita' },
        { label: 'Testimoni', target: 'testimoni' },
    ].map((item) => (
        <a
            key={item.label}
            href={`#${item.target}`}
            className="text-[13px] font-bold text-slate-500 hover:text-blue-600 transition-colors duration-300 tracking-wide"
        >
            {item.label}
        </a>
    ))}
</div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
                {auth?.user ? (
                    <Link
                        href={route("dashboard")}
                        className="font-bold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all duration-300"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route("login")}
                            className="font-bold text-sm text-slate-500 px-3 py-2 hover:text-blue-600 transition-all duration-300"
                        >
                            Masuk
                        </Link>
                        <Link
                            href={route("register")}
                            className="font-bold text-xs sm:text-sm px-5 sm:px-7 py-2 sm:py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md"
                        >
                            Daftar
                        </Link>
                    </>
                )}
            </div>
        </div>
    </div>

    {/* --- BOTTOM NAVIGATION (Mobile Only) --- */}
<div className="md:hidden fixed bottom-6 left-0 right-0 px-4 flex justify-center">
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-around gap-6 w-full max-w-sm">
        {[
            { name: 'Kelas', target: 'pricelist', icon: <BookOpen size={18} /> },
            { name: 'Fitur', target: 'fitur', icon: <PlayCircle size={20} /> },
            { name: 'Berita', target: 'berita', icon: <Newspaper size={18} /> },
            { name: 'Testimoni', target: 'testimoni', icon: <MessageSquareShare size={20} /> }
        ].map((item) => (
            <a
                key={item.name}
                href={`#${item.target}`}
                className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"
            >
                {item.icon}
                <span className="text-[10px] font-bold uppercase tracking-wider">
                    {item.name}
                </span>
            </a>
        ))}
    </div>
</div>
</nav>

{/* ================= HERO SECTION (FULL BACKGROUND) ================= */}
<main 
    className="relative z-10 w-full min-h-[90vh] md:min-h-screen flex items-center bg-cover bg-center bg-no-repeat pt-16 md:pt-20"
    style={{ backgroundImage: "url('/assets/images/lp-1.png')" }}
>
    {/* Ultra-Thin Cinematic Overlay */}
    <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(15,23,42,0.25)_100%)]"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Container Utama - Lebar ditingkatkan ke 6xl agar teks bisa memanjang ke samping */}
        <motion.div
            className="max-w-6xl text-left" 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
        >
            {/* Meta Info Header - Ukuran diperkecil ke text-[10px] */}
            <motion.div
                variants={fadeUpVariant}
                className="flex flex-wrap items-center gap-4 text-white/70 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-6"
            >
                <div className="flex items-center gap-2 text-blue-400 border-b border-blue-400/50 pb-1">
                    <Sparkles size={14} /> 
                    Edukasi Digital
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    Online Platform
                </div>
            </motion.div>

            {/* Title - Ukuran diturunkan sedikit agar tidak memakan tempat (md:text-6xl) */}
            <motion.h1
                variants={fadeUpVariant}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-4"
            >
                Bantu Kamu Lolos <br />
                <span className="text-blue-400">TKH & PPIH</span>
            </motion.h1>

            {/* Sub-Headline - Ukuran diturunkan ke text-xl */}
            <motion.p
                variants={fadeUpVariant}
                className="text-white text-base sm:text-lg md:text-xl font-bold mb-5 pl-1"
            >
                Siap berangkat ke Tanah Suci?
            </motion.p>

           {/* Description - Rata Kiri Kanan (Justify) Mentok ke Kanan */}
<motion.p
    variants={fadeUpVariant}
    className="text-sm sm:text-base md:text-lg text-white/80 mb-8 w-full md:max-w-5xl leading-relaxed font-medium drop-shadow-md text-justify"
    style={{ 
        hyphens: 'auto', 
        textAlignLast: 'left' // Menjaga baris terakhir tetap rata kiri agar tidak aneh
    }}
>
    {app_settings?.hero_description}
</motion.p>

            {/* CTA Buttons - Ukuran padding dikurangi sedikit agar lebih ramping */}
            <motion.div
                variants={fadeUpVariant}
                className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto"
            >
                <Link
                    href={route("register")}
                    className="group relative w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] sm:text-xs overflow-hidden transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <span>Daftar Sekarang</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <a
                    href="#fitur"
                    className="w-full sm:w-auto px-8 py-3.5 bg-white/5 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold uppercase tracking-widest text-[11px] sm:text-xs transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group"
                >
                    <span>Lihat Fitur</span>
                    <ChevronRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
            </motion.div>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </motion.div>
    </div>

   {/* Bottom Stats / Categories Bar - Sekarang Muncul di Mobile dengan Scroll */}
<div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-black/60 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto no-scrollbar py-4 sm:py-5 justify-between items-center gap-6 text-white/50 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
            <span className="hover:text-white cursor-pointer transition-colors flex-shrink-0">Materi Lengkap</span>
            <span className="hover:text-white cursor-pointer transition-colors flex-shrink-0">Latihan soal</span>
            <span className="hover:text-white cursor-pointer transition-colors flex-shrink-0">Zoom Class</span>
            <span className="hover:text-white cursor-pointer transition-colors flex-shrink-0">E-book</span>
            <span className="hover:text-white cursor-pointer transition-colors flex-shrink-0">Komunitas</span>
        </div>
    </div>
</div>

{/* Tambahkan ini di CSS global Anda untuk menyembunyikan scrollbar yang jelek */}
<style jsx>{`
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>
</main>
{/* ================= SECTION STATISTIK (Centered & Re-animated) ================= */}
<section className="relative z-20 py-20 bg-white">
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
    
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
            initial="hidden"
            whileInView="visible"
            // Ubah viewport agar trigger lebih sensitif saat scroll balik
            viewport={{ once: false, amount: 0.3 }} 
            variants={staggerContainer}
            // Tambahkan justify-items-center
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center"
        >
            <StatItem 
                value={app_settings?.stat1_value || '0'} 
                label={app_settings?.stat1_label || 'Dokter Sukses Lolos PPDS'}
                icon={<Award className="text-blue-600" size={26} />}
                variants={fadeUpVariant}
            />
            <StatItem 
                value={app_settings?.stat2_value || '0'} 
                label={app_settings?.stat2_label || 'Mentor Berpengalaman & Ahli'}
                icon={<ShieldCheck className="text-indigo-600" size={26} />}
                variants={fadeUpVariant}
            />
            <StatItem 
                value={app_settings?.stat3_value || '0'} 
                label={app_settings?.stat3_label || 'Peserta Didik di Indonesia'}
                icon={<TrendingUp className="text-emerald-600" size={26} />}
                variants={fadeUpVariant}
            />
            <StatItem 
                value={app_settings?.stat4_value || '0'} 
                label={app_settings?.stat4_label || 'Topik Pembelajaran Terkini'}
                icon={<MessageSquareShare className="text-orange-600" size={26} />}
                variants={fadeUpVariant}
            />
        </motion.div>
    </div>
</section>

          {/* Section Program Kelas */}
<section
    id="pricelist"
    className="relative z-10 pt-8 pb-16 md:pt-12 md:pb-24 bg-[#F8FAFC] overflow-hidden"
>
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6"
    >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-12 gap-4 text-center md:text-left">
            <div className="flex-1">
                <motion.h2
                    variants={fadeUpVariant}
                    className="text-3xl md:text-4xl font-black text-slate-900 mb-3"
                >
                    Program Kelas
                </motion.h2>
                <motion.p
    variants={fadeUpVariant}
    // Ganti max-w-2xl menjadi max-w-none agar teks memanjang ke kanan
    className="text-slate-500 text-sm sm:text-base max-w-none"
>
    Pilih program komprehensif yang dirancang khusus untuk meningkatkan skill Anda secara sistematis.
</motion.p>
            </div>
            {/* Indikator Geser (Hanya Muncul di Mobile) */}
            <div className="md:hidden flex items-center gap-2 text-blue-600 text-xs font-bold animate-pulse">
                <span>Geser</span> <ArrowRight size={14} />
            </div>
        </div>

        {/* LOGIKA FILTER */}
        {courses.filter(course => !course.is_expired).length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-sm">
                <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Belum Ada Kelas Tersedia</h3>
            </div>
        ) : (
            /* WRAPPER RESPONSIF: Mobile = Scroll, Desktop = Grid */
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-visible pb-10 md:pb-0 gap-6 snap-x snap-mandatory scrollbar-hide">
                {courses
                    .filter(course => !course.is_expired)
                    .map((course) => (
                        <motion.div
                            key={course.id}
                            variants={fadeUpVariant}
                            className="min-w-[85vw] sm:min-w-[350px] md:min-w-full snap-center bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col group"
                        >
                            {/* Thumbnail dengan Badge Lebih Cantik */}
                            <div className="relative h-52 sm:h-60 rounded-[2rem] overflow-hidden bg-slate-50 shadow-inner">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.nama}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                        <BookOpen size={40} className="text-blue-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-blue-900 shadow-sm border border-white">
                                        Batch {course.batch}
                                    </span>
                                    {course.is_popular && (
                                        <span className="px-3 py-1.5 bg-orange-500 rounded-full text-[10px] font-bold text-white shadow-sm">
                                            Terpopuler
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-4 line-clamp-2 h-14">
                                    {course.nama}
                                </h3>

                                {/* Harga Section */}
                                <div className="mb-6 flex flex-col gap-1 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    {course.harga_coret > 0 && (
                                        <span className="text-xs font-bold text-slate-400 line-through">
                                            {formatRupiah(course.harga_coret)}
                                        </span>
                                    )}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-blue-600">
                                            {formatRupiah(course.harga)}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">/ Program</span>
                                    </div>
                                </div>

                                {/* List Fitur (Grid 2 Kolom agar rapi) */}
                                <div className="grid grid-cols-1 gap-3 mb-8 flex-1">
                                    {(() => {
                                        let fiturList = [];
                                        try {
                                            fiturList = typeof course.fitur === "string" 
                                                ? JSON.parse(course.fitur) 
                                                : Array.isArray(course.fitur) ? course.fitur : [];
                                        } catch (e) { fiturList = []; }
                                        
                                        return fiturList.slice(0, 4).map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="bg-green-100 rounded-full p-1 shadow-sm">
                                                    <CheckCircle2 size={12} className="text-green-600 shrink-0" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 truncate">
                                                    {item}
                                                </span>
                                            </div>
                                        ));
                                    })()}
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <button
                                        onClick={() => setSelectedCourse(course)}
                                        className="py-3 px-2 bg-white text-slate-700 rounded-xl font-bold text-xs border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
                                    >
                                        Detail
                                    </button>

                                    <Link
                                        href={auth?.user ? route("member.catalog") : route("register")}
                                        className="py-3 px-2 bg-blue-600 text-white rounded-xl font-bold text-xs text-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                                    >
                                        Daftar
                                    </Link>
                                </div>
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
                    title: "Materi Intensif",
                    desc: "Materi intensif yang akan membantu kamu siap menghadapi ujian CAT dan lolos one shot yang sudah dirangkum dengan strategi yang sudah terbukti membantu 350+ orang lolos PPIH.",
                },
                {
                    icon: ShieldCheck,
                    title: "⁠Mind Maps PDF",
                    desc: "Master mind maps yang akan membantu kamu belajar lebih cepat di mana pun dan kapan pun dan dirancang untuk membuat otakmu bekerja lebih efisien.",
                },
                {
                    icon: MessageSquareShare,
                    title: "⁠Brainstorming Zoom",
                    desc: "Brain Storming Zoom setiap bulan yang akan membantumu lebih siap secara mental dan spiritual + sharing alumni yang akan membuat pun 10 kali lebih mantap Wawancara daripada kompetitor.",
                },
                {
                    icon: Award,
                    title: "⁠Try Out Simulasi",
                    desc: "Try out simulasi yang akan mengukur seberapa jauh pemahamanmu terhadap materi dan membantumu lebih siap untuk lolos CAT One Shot.",
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

{/* --- NEWS / ACTIVITIES SECTION --- */}
<section id="berita" className="relative z-10 py-12 md:py-16 bg-white">
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6"
    >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="text-left">
                <motion.h2 
                    variants={fadeUpVariant}
                    className="text-2xl sm:text-3xl font-black text-slate-900 mb-2"
                >
                    Kegiatan Terbaru
                </motion.h2>
                <motion.p 
                    variants={fadeUpVariant}
                    className="text-slate-500 text-sm sm:text-base max-w-xl"
                >
                    Informasi seputar dokumentasi kegiatan MiqotHub.
                </motion.p>
            </div>
        </div>

        {/* Scrollable News Cards */}
        {/* Tambahkan pengecekan opsional chaining (?.) untuk keamanan ekstra */}
        {!latestPosts || latestPosts.length === 0 ? (
            <motion.div 
                variants={fadeUpVariant}
                className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 italic"
            >
                Belum ada berita atau kegiatan terbaru untuk saat ini.
            </motion.div>
        ) : (
            <div className="relative">
                {/* Gunakan class 'scrollbar-hide' jika sudah menginstall pluginnya, atau ganti dengan 'overflow-x-auto' standar */}
                <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide scroll-smooth">
                    {latestPosts.map((post) => (
                       <motion.div
        key={post.id}
        variants={fadeUpVariant}
        className="min-w-[280px] sm:min-w-[340px] lg:min-w-[calc(33.333%-16px)] snap-start group"
    >
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
            
            {/* Image Section */}
            <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                
                {/* Category */}
                <div className="absolute top-4 left-4 z-20">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/30">
                        {post.category}
                    </span>
                </div>

                {/* Image + fallback */}
                {post.image ? (
                    <img
                        src={`/storage/${post.image}`}
                        alt={post.title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/default-news.jpg';
                        }}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100/30">
                        <FileText size={40} className="text-blue-300" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-slate-400 text-[11px] mb-3 font-medium">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-blue-500" />
                        <span>
                            {new Date(post.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                </h3>

                <div
                    className="text-slate-500 text-sm line-clamp-2 mb-5 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-auto">
                    <button
                onClick={() => setSelectedPost(post)}
                className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
            >
                Baca Selengkapnya
            </button>
                </div>
            </div>
        </div>
    </motion.div>
                    ))}
                </div>
            </div>
        )}
    </motion.div>
</section>  
            {/* --- TESTIMONY SECTION WITH DARK MESH GRADIENT --- */}
<section
    id="testimoni"
    className="relative z-10 py-14 md:py-20 bg-slate-900 overflow-hidden"
>
    {/* Background Decor */}
    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>

    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
    >
        <div className="text-center mb-10 md:mb-14">
            <motion.span
                variants={fadeUpVariant}
                className="text-blue-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm mb-2 block"
            >
                Testimoni
            </motion.span>
            <motion.h2
                variants={fadeUpVariant}
                className="text-3xl sm:text-4xl font-black text-white mb-3"
            >
                Apa Kata Mereka?
            </motion.h2>
            <motion.p
                variants={fadeUpVariant}
                className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto"
            >
                Pengalaman nyata dari mereka yang telah bergabung di MiqotHub.
            </motion.p>
        </div>

        {reviews.length === 0 ? (
            <div className="text-center text-slate-500 italic text-sm">
                Belum ada ulasan saat ini.
            </div>
        ) : (
            /* Container Scroll Berbasis Snap */
            <div className="relative group">
                <div className="flex overflow-x-auto pb-8 gap-5 snap-x snap-mandatory scrollbar-hide scroll-smooth">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUpVariant}
                            /* Lebar fleksibel: 100% di mobile, 1/2 di tablet, 1/4 di laptop */
                            className="min-w-[85%] sm:min-w-[45%] lg:min-w-[calc(25%-15px)] snap-center"
                        >
                            <div className="h-full bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                                        "{review.komentar}"
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase">
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
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Petunjuk Visual (Opsional) */}
                <div className="flex justify-center gap-2 mt-4 lg:hidden">
                    <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                    <div className="w-2 h-1 bg-slate-700 rounded-full"></div>
                    <div className="w-2 h-1 bg-slate-700 rounded-full"></div>
                </div>
            </div>
        )}
    </motion.div>
    
    {/* Style untuk menyembunyikan scrollbar tapi tetap bisa di-scroll */}
    <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `}</style>
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

            <AnimatePresence>
    {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
            
            {/* BACKDROP */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCourse(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* MODAL */}
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* CLOSE BUTTON */}
                <button
                    onClick={() => setSelectedCourse(null)}
                    className="absolute top-4 right-4 z-50 p-2 bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white rounded-full transition"
                >
                    <X size={20} />
                </button>

                {/* IMAGE */}
                <div className="h-52 bg-slate-100">
                    {selectedCourse.thumbnail_url ? (
                        <img
                            src={selectedCourse.thumbnail_url}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="text-slate-300" size={40} />
                        </div>
                    )}
                </div>

                {/* CONTENT */}
                <div className="p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                        {selectedCourse.nama}
                    </h2>
                   <div
                    className="text-slate-600 text-sm leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: selectedCourse.deskripsi }}
                ></div>

                    <p className="text-slate-500 text-sm mb-4">
                        {selectedCourse.batch}
                    </p>

                    {/* HARGA */}
                    <div className="mb-5">
                        {selectedCourse.harga_coret > 0 && (
                            <div className="text-sm text-slate-400 line-through">
                                {formatRupiah(selectedCourse.harga_coret)}
                            </div>
                        )}
                        <div className="text-2xl font-black text-blue-600">
                            {formatRupiah(selectedCourse.harga)}
                        </div>
                    </div>

                    {/* FITUR FULL */}
                    <div className="space-y-2 mb-6">
                        {(() => {
                            let fiturList = [];
                            try {
                                fiturList =
                                    typeof selectedCourse.fitur === "string"
                                        ? JSON.parse(selectedCourse.fitur)
                                        : selectedCourse.fitur || [];
                            } catch {
                                fiturList = [];
                            }

                            return fiturList.map((item, i) => (
                                <div key={i} className="flex gap-2 text-sm text-slate-600">
                                    <CheckCircle2 size={16} className="text-blue-600 mt-0.5" />
                                    {item}
                                </div>
                            ));
                        })()}
                    </div>

                    {/* CTA */}
                    <Link
                        href={
                            auth?.user
                                ? route("member.catalog")
                                : route("register")
                        }
                        className="block w-full text-center py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        Daftar Sekarang
                    </Link>
                </div>
            </motion.div>
        </div>
    )}
</AnimatePresence>
<AnimatePresence>
  {selectedPost && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
      {/* Overlay dengan blur premium */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedPost(null)}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
      />
      
      {/* Container Artikel */}
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-4xl h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col"
      >
        {/* Toolbar Atas (Sticky) */}
        <div className="absolute top-0 inset-x-0 z-30 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
             <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-lg">
                {selectedPost.category}
             </span>
          </div>
          <button 
            onClick={() => setSelectedPost(null)}
            className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-full transition-all border border-white/20"
          >
            <X size={24} />
          </button>
        </div>

        {/* Area Konten (Scrollable) */}
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {/* Hero Image Artikel */}
          <div className="relative w-full h-[40vh] sm:h-[50vh]">
            <img 
              src={`/storage/${selectedPost.image}`} 
              alt={selectedPost.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/default-news.jpg'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>

          {/* Konten Utama */}
          <div className="px-6 py-8 sm:px-12 sm:py-10 -mt-20 relative bg-white rounded-t-[40px]">
            
            {/* Metadata Berita */}
            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <User size={14} className="text-blue-600" />
                </div>
                <span className="font-semibold text-slate-700">Admin MiqotHub</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={15} />
                <span>
                  {new Date(selectedPost.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
            
            </div>

            {/* Judul Berita */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-8">
              {selectedPost.title}
            </h1>

            {/* Isi Berita */}
            <div 
              className="prose prose-lg prose-slate max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
                prose-img:rounded-2xl prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            {/* Footer Artikel (Tagging & Share) */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-blue-600" />
                <div className="flex gap-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-md">#MiqotHub</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-md">#KegiatanTerbaru</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
        </div>
    );
}
