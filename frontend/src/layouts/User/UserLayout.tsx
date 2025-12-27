import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import AppUserHeader from './AppUserHeader';
import AppUserSidebar from './AppUserSidebar';
import Footer from '@components/footer/Footer';

import { useAppDispatch } from '@store/hooks';
import { setIsMobile } from '@store/slices/uiSlice'

const UserLayout: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 1024;
            dispatch(setIsMobile(isMobile));
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch]);

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <AppUserSidebar />

                <div className="flex flex-col flex-1">
                    <AppUserHeader />
                    <main className="pt-20">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default UserLayout;
