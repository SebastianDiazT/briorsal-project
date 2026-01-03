import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

import AppUserHeader from './AppUserHeader';
import AppUserSidebar from './AppUserSidebar';
import Footer from '@components/layout/Footer';

const UserLayout: React.FC = () => {
    const { pathname } = useLocation();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 relative selection:bg-brand-500 selection:text-white">
            <AppUserSidebar />
            <AppUserHeader />

            <main className="flex-grow w-full pt-20 animate-fade-in">
                <Outlet />
            </main>

            <Footer />

            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-40 p-3 rounded-full shadow-2xl transition-all duration-500 transform border border-white/10
                ${
                    showScrollTop
                        ? 'translate-y-0 opacity-100 bg-brand-500 hover:bg-brand-600 text-white'
                        : 'translate-y-10 opacity-0 pointer-events-none'
                }`}
                aria-label="Volver arriba"
            >
                <FaArrowUp size={18} />
            </button>
        </div>
    );
};

export default UserLayout;
