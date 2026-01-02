import React from 'react';
import { IconType } from 'react-icons';
import { FaChartPie } from 'react-icons/fa';

interface PageHeaderProps {
    title: string;
    breadcrumbs: string[];
    icon: IconType;
    totalRecords?: number;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    breadcrumbs,
    icon: Icon,
    totalRecords,
    children,
}) => {
    return (
        <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-l-orange-500 animate-fade-in-down overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-30 pointer-events-none">
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <pattern
                        id="dot-pattern"
                        x="0"
                        y="0"
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle
                            cx="1"
                            cy="1"
                            r="1"
                            className="text-orange-300"
                            fill="currentColor"
                        />
                    </pattern>
                    <rect width="64" height="64" fill="url(#dot-pattern)" />
                </svg>
            </div>

            <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shrink-0 shadow-sm">
                    <Icon size={22} />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-none mb-1.5">
                        {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                <span
                                    className={
                                        index === breadcrumbs.length - 1
                                            ? 'font-bold text-slate-600'
                                            : 'text-slate-400 font-medium'
                                    }
                                >
                                    {crumb}
                                </span>
                                {index < breadcrumbs.length - 1 && (
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                )}
                            </React.Fragment>
                        ))}

                        {totalRecords !== undefined && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                                <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 text-xs flex items-center gap-1">
                                    <FaChartPie size={10} /> {totalRecords}{' '}
                                    Registros
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0">
                <div className="hidden md:block h-10 w-px bg-slate-100 border-r border-slate-200/50"></div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
