import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@store/hooks';
import { toggleMobileSidebar } from '@store/slices/uiSlice';
import { items } from './menuData';
import logoBriorsal from '@assets/logo.png';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTiktok,
} from 'react-icons/fa';

const AppUserHeader: React.FC = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    return (
        <header className="bg-brand-dark-900 font-sans fixed top-0 left-0 w-full z-50 shadow-theme-md transition-all duration-300">
            <div className="w-full max-w-[95%] mx-auto px-2">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-10">
                        <a href="/" className="flex-shrink-0">
                            <img
                                src={logoBriorsal}
                                alt="Briorsal Constructora"
                                className="h-10 w-auto object-contain"
                            />
                        </a>

                        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[15px] font-medium text-brand-dark-200 tracking-wider">
                            {items.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path || '#'}
                                    className={`hover:text-white transition-colors uppercase
                                    ${
                                        location.pathname === item.path
                                            ? 'text-white'
                                            : 'text-gray-300'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="hidden lg:flex items-center gap-5">
                        <a
                            href="https://www.facebook.com/BriorsalConstructora"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-brand-400 transition-colors duration-300"
                        >
                            <FaFacebookF size={20} />
                        </a>
                        <a
                            href="https://www.instagram.com/briorsalconstructora/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-brand-400 transition-colors duration-300"
                        >
                            <FaInstagram size={20} />
                        </a>
                        <a
                            href="https://www.tiktok.com/@briorsalconstructora"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-brand-400 transition-colors duration-300"
                        >
                            <FaTiktok size={20} />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/briorsalconstructora/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-brand-400 transition-colors duration-300"
                        >
                            <FaLinkedinIn size={20} />
                        </a>
                    </div>

                    {/* Botón Menú Móvil */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => dispatch(toggleMobileSidebar())}
                            className="text-white hover:text-brand-400 focus:outline-none p-2"
                        >
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppUserHeader;
