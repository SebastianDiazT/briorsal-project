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

    const handleClose = () => dispatch(toggleMobileSidebar());

    return (
        <>
            {/* OVERLAY CON BLUR */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
                    isMobileOpen
                        ? 'opacity-100 visible'
                        : 'opacity-0 invisible pointer-events-none'
                }`}
                onClick={handleClose}
            />

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-[280px] bg-brand-dark-950 border-r border-brand-dark-800 transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
            >
                {/* CABECERA SIDEBAR */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-brand-dark-800 bg-brand-dark-900">
                    <Link to="/" onClick={handleClose}>
                        <img
                            src={logoBriorsal}
                            alt="Briorsal Logo"
                            className="h-8 w-auto object-contain"
                        />
                    </Link>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-brand-dark-800 rounded-md"
                    >
                        <IoCloseSharp className="w-6 h-6" />
                    </button>
                </div>

                {/* LINKS DE NAVEGACIÓN */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                    <ul className="space-y-2">
                        {items.map((nav) => {
                            const isActive = location.pathname === nav.path;
                            return (
                                <li key={nav.name}>
                                    <Link
                                        to={nav.path || '#'}
                                        onClick={handleClose}
                                        className={`
                                            flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-bold uppercase tracking-wide transition-all duration-200
                                            ${
                                                isActive
                                                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20'
                                                    : 'text-gray-400 hover:bg-brand-dark-800 hover:text-white'
                                            }
                                        `}
                                    >
                                        <span
                                            className={`text-xl ${isActive ? 'text-white' : 'text-brand-500'}`}
                                        >
                                            {nav.icon}
                                        </span>
                                        {nav.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* FOOTER DEL SIDEBAR (Opcional: Copyright o Redes) */}
                <div className="p-6 border-t border-brand-dark-800 text-center">
                    <p className="text-xs text-gray-500 font-medium">
                        © 2024 Grupo Briorsal
                    </p>
                </div>
            </aside>
        </>
    );
};

export default AppUserSidebar;
