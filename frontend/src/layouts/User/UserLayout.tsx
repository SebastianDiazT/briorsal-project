import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppUserHeader from './AppUserHeader';
import AppUserSidebar from './AppUserSidebar';
import Footer from '@components/layout/Footer';

const UserLayout: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
            <AppUserSidebar />

            <AppUserHeader />

            <main className="flex-grow pt-20 animate-fade-in">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default UserLayout;
