import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleMobileSidebar } from '@store/slices/uiSlice';
import { logout } from '@store/slices/authSlice';

import logoBriorsal from '@assets/logo.png';
import iconBriorsal from '@assets/icon.png';
import { menuGroups } from './menuData';

const AdminSidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isExpanded, isMobileOpen } = useAppSelector((state) => state.ui);

    const [isHovered, setIsHovered] = useState(false);

    const showExpanded = isExpanded || (isHovered && window.innerWidth >= 1024);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin/login');
    };

    return (
        <aside
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-400 shadow-xl transition-all duration-300 ease-in-out
                lg:static
                ${showExpanded ? 'w-64' : 'w-20'}
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
        >
            <div
                className={`flex h-20 items-center border-b border-slate-800 ${showExpanded ? 'px-6 justify-between' : 'justify-center'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {showExpanded ? (
                        <img
                            src={logoBriorsal}
                            alt="Logo"
                            className="h-10 w-auto object-contain"
                        />
                    ) : (
                        <img
                            src={iconBriorsal}
                            alt="Logo"
                            className="h-10 w-auto object-contain"
                        />
                    )}
                </div>
                <button
                    onClick={() => dispatch(toggleMobileSidebar())}
                    className="lg:hidden text-slate-500 hover:text-white"
                >
                    <FaTimes size={20} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 no-scrollbar">
                {menuGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        <h3
                            className={`mb-3 ml-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 ${!showExpanded ? 'hidden' : 'block'}`}
                        >
                            {group.name}
                        </h3>

                        <ul className="space-y-1.5">
                            {group.items.map((item) => {
                                const isActive = location.pathname.includes(
                                    item.path
                                );
                                return (
                                    <li key={item.name}>
                                        <NavLink
                                            to={item.path}
                                            title={
                                                !showExpanded ? item.name : ''
                                            }
                                            className={`
                                                group relative flex items-center rounded-xl py-3 px-3.5 transition-all duration-200
                                                ${
                                                    isActive
                                                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                                                        : 'hover:bg-slate-800 hover:text-white'
                                                }
                                                ${!showExpanded && 'justify-center'}
                                            `}
                                        >
                                            <span
                                                className={`text-lg transition-transform group-hover:scale-110 ${!showExpanded && 'text-xl'}`}
                                            >
                                                {item.icon}
                                            </span>

                                            <span
                                                className={`ml-3 whitespace-nowrap font-medium transition-all duration-300 ${!showExpanded ? 'w-0 overflow-hidden opacity-0 hidden' : 'w-auto opacity-100'}`}
                                            >
                                                {item.name}
                                            </span>
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>

                        {!showExpanded &&
                            groupIndex < menuGroups.length - 1 && (
                                <div className="mx-auto mt-4 h-px w-8 bg-slate-800" />
                            )}
                    </div>
                ))}
            </nav>

            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={handleLogout}
                    className={`group flex w-full items-center rounded-xl border border-slate-700 bg-slate-800/50 p-3 transition-all hover:bg-red-500 hover:border-red-500 hover:text-white ${!showExpanded && 'justify-center'}`}
                >
                    <FaSignOutAlt
                        className={`text-lg ${!showExpanded ? 'text-xl' : ''}`}
                    />
                    <span
                        className={`ml-3 font-semibold text-slate-200 group-hover:text-white ${!showExpanded ? 'hidden' : 'block'}`}
                    >
                        Cerrar Sesión
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
