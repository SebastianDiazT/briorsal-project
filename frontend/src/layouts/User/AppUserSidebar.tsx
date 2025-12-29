import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleMobileSidebar } from '@store/slices/uiSlice';
import { IoCloseOutline } from 'react-icons/io5';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTiktok,
} from 'react-icons/fa';
import { items } from './menuData';
import logoBriorsal from '@assets/logo.png';

const AppUserSidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    const isMobileOpen = useAppSelector((state) => state.ui.isMobileOpen);
    const location = useLocation();

    const handleClose = () => dispatch(toggleMobileSidebar());

    return (
        <>
            {/* 1. BACKDROP (Fondo oscuro con desenfoque) */}
            <div
                className={`fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300
                ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={handleClose}
            />

            {/* 2. SIDEBAR (Panel Lateral) */}
            <aside
                className={`fixed top-0 left-0 z-[70] h-screen w-[280px] bg-brand-dark-950 flex flex-col shadow-2xl transition-transform duration-300 ease-out border-r border-brand-dark-800
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* CABECERA: Logo y Cerrar */}
                <div className="flex items-center justify-between px-6 h-20 border-b border-brand-dark-800 bg-brand-dark-900/50">
                    <Link to="/" onClick={handleClose}>
                        <img
                            src={logoBriorsal}
                            alt="Briorsal Logo"
                            className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                        />
                    </Link>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-brand-dark-700 transition-all"
                    >
                        <IoCloseOutline size={24} />
                    </button>
                </div>

                {/* CUERPO: Navegación */}
                <nav className="flex-1 overflow-y-auto py-8 px-4">
                    <ul className="space-y-2">
                        {items.map((nav) => {
                            const isActive = location.pathname === nav.path;
                            return (
                                <li key={nav.name}>
                                    <Link
                                        to={nav.path || '#'}
                                        onClick={handleClose}
                                        className={`
                                            group flex items-center gap-4 px-4 py-3.5 rounded-r-lg transition-all duration-200 relative overflow-hidden
                                            ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-brand-dark-800 to-transparent text-white'
                                                    : 'text-gray-400 hover:text-white hover:bg-brand-dark-800/30'
                                            }
                                        `}
                                    >
                                        {/* Línea indicadora activa */}
                                        {isActive && (
                                            <span className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-full" />
                                        )}

                                        <span
                                            className={`text-xl transition-colors ${isActive ? 'text-brand-500' : 'text-gray-500 group-hover:text-brand-400'}`}
                                        >
                                            {nav.icon}
                                        </span>

                                        <span className="text-sm font-bold uppercase tracking-widest">
                                            {nav.name}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* FOOTER: Redes Sociales */}
                <div className="p-6 border-t border-brand-dark-800 bg-brand-dark-900/30">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">
                        Síguenos
                    </p>
                    <div className="flex justify-center gap-3">
                        {[
                            {
                                href: 'https://www.facebook.com/BriorsalConstructora',
                                icon: <FaFacebookF />,
                            },
                            {
                                href: 'https://www.instagram.com/briorsalconstructora/',
                                icon: <FaInstagram />,
                            },
                            {
                                href: 'https://www.tiktok.com/@briorsalconstructora',
                                icon: <FaTiktok />,
                            },
                            {
                                href: 'https://www.linkedin.com/company/briorsalconstructora/',
                                icon: <FaLinkedinIn />,
                            },
                        ].map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-dark-800 text-gray-400 hover:bg-brand-500 hover:text-white transition-all duration-300 shadow-lg border border-brand-dark-700"
                            >
                                <span className="text-sm">{social.icon}</span>
                            </a>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-gray-600 font-medium">
                            © {new Date().getFullYear()} Grupo Briorsal
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AppUserSidebar;
