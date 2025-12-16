import React from 'react';
import { Outlet } from 'react-router';
import { SidebarProvider } from '@context/SidebarContext';
import AppUserHeader from './AppUserHeader';
import AppUserSidebar from './AppUserSidebar';
import Footer from '@components/footer/Footer';

const LayoutContent: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <AppUserSidebar />

                <div className="flex flex-col flex-1">
                    <AppUserHeader />
                    <main className="w-full max-w-screen-2xl mx-auto p-4 md:p-6 2xl:p-10">
                        <Outlet />
                    </main>
                </div>
                <Footer />
            </div>
        </>
    );
};

const UserLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default UserLayout;
