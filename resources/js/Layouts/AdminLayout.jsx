import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react'; // TAMBAHAN 1: Import usePage dari Inertia
import Sidebar from '@/Components/Admin/Sidebar';
import Navbar from '@/Components/Admin/Navbar';

export default function AdminLayout({ user, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // TAMBAHAN 2: Ambil URL saat ini
    const { url } = usePage(); 

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                
                <Navbar user={user} setIsSidebarOpen={setIsSidebarOpen} />

                {/* Sedikit penyesuaian padding untuk mobile (p-4) dan desktop (md:p-6) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
                    <motion.div
                        key={url} // TAMBAHAN 3: Gunakan URL sebagai key agar animasi ter-trigger tiap pindah menu
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }} // Dipercepat sedikit jadi 0.4 agar lebih snappy
                        className="max-w-7xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}