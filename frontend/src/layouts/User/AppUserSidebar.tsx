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
    FaWhatsapp,
} from 'react-icons/fa';
import { items } from './menuData';
import logoBriorsal from '@assets/logo.png';

import { useGetCompanyInfoQuery } from '@/features/company/api/companyApi';

const AppUserSidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const isMobileOpen = useAppSelector((state) => state.ui.isMobileOpen);

    const { data: response } = useGetCompanyInfoQuery();
    const companyInfo = response?.data;

    const handleClose = () => dispatch(toggleMobileSidebar());

    const socialLinks = [
        { url: companyInfo?.whatsapp, icon: <FaWhatsapp /> },
        { url: companyInfo?.facebook, icon: <FaFacebookF /> },
        { url: companyInfo?.instagram, icon: <FaInstagram /> },
        { url: companyInfo?.tiktok, icon: <FaTiktok /> },
        { url: companyInfo?.linkedin, icon: <FaLinkedinIn /> },
    ].filter((link) => link.url);

    return (
        <>
            <div
                className={`fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300
                ${isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={handleClose}
            />

            <aside
                className={`fixed top-0 left-0 z-[70] h-screen w-[280px] bg-slate-950 flex flex-col shadow-2xl transition-transform duration-300 ease-out border-r border-slate-800
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-6 h-20 border-b border-slate-800 bg-slate-900/50">
                    <Link to="/" onClick={handleClose}>
                        <img
                            src={logoBriorsal}
                            alt="Briorsal Logo"
                            className="h-8 w-auto object-contain opacity-100"
                        />
                    </Link>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    >
                        <IoCloseOutline size={28} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-8 px-3">
                    <ul className="space-y-1">
                        {items.map((nav) => {
                            const isActive = location.pathname === nav.path;
                            return (
                                <li key={nav.name}>
                                    <Link
                                        to={nav.path || '#'}
                                        onClick={handleClose}
                                        className={`
                                            group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 relative overflow-hidden
                                            ${
                                                isActive
                                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <span
                                            className={`text-xl transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-orange-400'}`}
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

                <div className="p-6 border-t border-slate-800 bg-slate-900/30">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">
                        Síguenos en Redes
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                        {socialLinks.map((social, idx) => (
                            <a
                                key={idx}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-orange-600 hover:text-white transition-all duration-300 hover:-translate-y-1 border border-slate-700"
                            >
                                <span className="text-sm">{social.icon}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AppUserSidebar;
