import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { toggleMobileSidebar } from '@store/slices/uiSlice';

const AdminLayout: React.FC = () => {
    const { isMobileOpen } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-600 overflow-hidden">
            <AdminSidebar />

            <div className="flex flex-1 flex-col h-full overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>

            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => dispatch(toggleMobileSidebar())}
                />
            )}
        </div>
    );
};

export default AdminLayout;
