import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleMobileSidebar } from '@store/slices/uiSlice';
import { IoCloseSharp } from 'react-icons/io5';
import { items } from './menuData';
import logoBriorsal from '@assets/logo.png';

const AppUserSidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    const isMobileOpen = useAppSelector((state) => state.ui.isMobileOpen);
    const location = useLocation();

    const handleClose = () => {
        dispatch(toggleMobileSidebar());
    };

    const renderMenuItems = () => (
        <ul className="flex flex-col gap-2">
            {items.map((nav) => {
                const isActive = location.pathname === nav.path;

                return (
                    <li key={nav.name}>
                        <Link
                            to={nav.path || '#'}
                            onClick={handleClose}
                            className={`
                                group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-300
                                ${
                                    isActive
                                        ? 'bg-brand-400 text-white'
                                        : 'text-brand-dark-200 hover:bg-brand-dark-800 hover:text-brand-400'
                                }
                            `}
                        >
                            <span className="text-lg">{nav.icon}</span>
                            <span className="uppercase tracking-wide">
                                {nav.name}
                            </span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
                    isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={handleClose}
            />

            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-[290px] bg-brand-dark-900 border-r border-brand-dark-800 transition-transform duration-300 ease-in-out 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:hidden shadow-2xl`}
            >
                <div className="flex items-center justify-between px-6 py-8 border-b border-brand-dark-800">
                    <Link to="/" onClick={handleClose}>
                        <img
                            src={logoBriorsal}
                            alt="Briorsal Logo"
                            className="w-32 h-auto object-contain"
                        />
                    </Link>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-brand-400 transition-colors"
                    >
                        <IoCloseSharp className="w-7 h-7" />
                    </button>
                </div>

                <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-100px)]">
                    <nav>{renderMenuItems()}</nav>
                </div>
            </aside>
        </>
    );
};

export default AppUserSidebar;
