import React from 'react';
import { FaBars, FaIndent, FaOutdent } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleSidebar, toggleMobileSidebar } from '@store/slices/uiSlice';

const AdminHeader: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isExpanded } = useAppSelector((state) => state.ui);
    const { user } = useAppSelector((state) => state.auth);

    const getInitials = () => {
        if (!user) return 'AD';

        const firstName = user.first_name || '';
        const lastName = user.last_name || '';

        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        }

        if (user.email) {
            return user.email.substring(0, 2).toUpperCase();
        }

        return 'AD';
    };

    const displayName = user?.first_name
        ? `${user.first_name} ${user.last_name || ''}`
        : user?.email?.split('@')[0] || 'Admin';

    const userInitials = getInitials();

    return (
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between bg-white px-6 shadow-sm border-b border-slate-100">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => dispatch(toggleMobileSidebar())}
                    className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                    <FaBars size={20} />
                </button>

                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="hidden lg:flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    title={isExpanded ? 'Contraer menú' : 'Expandir menú'}
                >
                    {isExpanded ? (
                        <FaIndent size={22} />
                    ) : (
                        <FaOutdent size={22} />
                    )}
                </button>

                <div className="hidden md:block h-6 w-px bg-slate-200 mx-2"></div>

                <h2 className="hidden md:block text-lg font-bold text-slate-700 tracking-tight">
                    Panel Administrativo
                </h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-700 leading-tight">
                            {displayName}
                        </p>
                        <p className="text-xs font-medium text-slate-400">
                            {user?.is_staff ? 'Administrador' : 'Usuario'}
                        </p>
                    </div>

                    <div className="h-10 w-10 rounded-full bg-slate-200 ring-2 ring-white overflow-hidden shadow-sm">
                        <img
                            src={`https://ui-avatars.com/api/?name=${userInitials}&background=0f172a&color=fff&bold=true&length=2`}
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
