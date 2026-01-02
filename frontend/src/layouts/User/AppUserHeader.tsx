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
    FaBars,
} from 'react-icons/fa';

const AppUserHeader: React.FC = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const companyInfo =
        {
            facebook: 'https://www.facebook.com/BriorsalConstructora',
            instagram: 'https://www.instagram.com/briorsalconstructora',
            tiktok: 'https://www.tiktok.com/@briorsalconstructora',
            linkedin: 'https://www.linkedin.com/company/briorsalconstructora',
        };

    const socialLinks = [
        { url: companyInfo?.facebook, icon: <FaFacebookF size={18} /> },
        { url: companyInfo?.instagram, icon: <FaInstagram size={18} /> },
        { url: companyInfo?.tiktok, icon: <FaTiktok size={18} /> },
        { url: companyInfo?.linkedin, icon: <FaLinkedinIn size={18} /> },
    ].filter((link) => link.url);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-brand-dark-900/95 backdrop-blur-md shadow-lg transition-all duration-300 border-b border-brand-dark-800">
            <div className="w-full max-w-[95%] mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-12">
                        <Link
                            to="/"
                            className="flex-shrink-0 hover:opacity-90 transition-opacity"
                        >
                            <img
                                src={logoBriorsal}
                                alt="Briorsal Constructora"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>

                        <nav className="hidden lg:flex items-center gap-8 text-[14px] xl:text-[15px] font-semibold text-brand-dark-200 tracking-wider">
                            {items.map((item) => {
                                const isActive =
                                    location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path || '#'}
                                        className={`relative py-2 transition-colors uppercase hover:text-white
                                            ${isActive ? 'text-white' : 'text-gray-400'}
                                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-500 after:transition-all after:duration-300 hover:after:w-full
                                            ${isActive ? 'after:w-full' : ''}
                                        `}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-dark-800 text-white hover:bg-brand-500 hover:text-white transition-all duration-300 hover:-translate-y-1"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>

                    <div className="lg:hidden">
                        <button
                            onClick={() => dispatch(toggleMobileSidebar())}
                            className="text-white hover:text-brand-400 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                            aria-label="Abrir menú"
                        >
                            <FaBars size={28} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppUserHeader;
