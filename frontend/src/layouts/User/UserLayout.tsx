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
                    <main className="pt-20">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
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
