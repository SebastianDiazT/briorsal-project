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
    const location = useLocation();

    const isMobileOpen = useAppSelector((state) => state.ui.isMobileOpen);
    const { companyInfo } = useAppSelector((state) => state.company);

    const handleClose = () => dispatch(toggleMobileSidebar());
    const socialLinks = [
        { url: companyInfo?.facebook, icon: <FaFacebookF /> },
        { url: companyInfo?.instagram, icon: <FaInstagram /> },
        { url: companyInfo?.tiktok, icon: <FaTiktok /> },
        { url: companyInfo?.linkedin, icon: <FaLinkedinIn /> },
    ].filter((link) => link.url);

    return (
        <>
            <div
                className={`fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300
                ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={handleClose}
            />

            <aside
                className={`fixed top-0 left-0 z-[70] h-screen w-[280px] bg-brand-dark-950 flex flex-col shadow-2xl transition-transform duration-300 ease-out border-r border-brand-dark-800
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
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

                <div className="p-6 border-t border-brand-dark-800 bg-brand-dark-900/30">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">
                        Síguenos
                    </p>
                    <div className="flex justify-center gap-3">
                        {socialLinks.map((social, idx) => (
                            <a
                                key={idx}
                                href={social.url}
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
