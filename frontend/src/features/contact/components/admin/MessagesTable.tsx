import React from 'react';
import { FaEye } from 'react-icons/fa';
import { ContactMessage } from '../../types';

interface MessagesTableProps {
    messages: ContactMessage[];
    isLoading: boolean;
    onView: (message: ContactMessage) => void;
    EmptyState: React.ComponentType;
}

export const MessagesTable: React.FC<MessagesTableProps> = ({
    messages,
    isLoading,
    onView,
    EmptyState,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                        <div className="flex-1 h-8 bg-slate-100 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="py-4 px-6 w-16 text-center"></th>
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                Remitente
                            </th>
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                Asunto
                            </th>
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                Fecha
                            </th>
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                                Detalle
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {messages.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <EmptyState />
                                </td>
                            </tr>
                        ) : (
                            messages.map((msg) => {
                                const isUnread = !msg.is_read;
                                return (
                                    <tr
                                        key={msg.id}
                                        className={`group transition-colors duration-150 ${isUnread ? 'bg-orange-50/30 hover:bg-orange-50/60' : 'hover:bg-slate-50'}`}
                                    >
                                        <td className="py-4 px-6 text-center align-middle">
                                            {isUnread ? (
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full bg-orange-500 mx-auto shadow-sm shadow-orange-500/50"
                                                    title="No leído"
                                                ></div>
                                            ) : (
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full bg-slate-200 mx-auto"
                                                    title="Leído"
                                                ></div>
                                            )}
                                        </td>

                                        <td className="py-4 px-6 align-middle">
                                            <div className="flex flex-col">
                                                <span
                                                    className={`text-sm ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}
                                                >
                                                    {msg.first_name}{' '}
                                                    {msg.last_name}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {msg.email}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6 align-middle">
                                            <span className="text-sm text-slate-600 font-medium line-clamp-1 max-w-[200px]">
                                                {msg.subject || 'Sin asunto'}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6 align-middle">
                                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                                {new Date(
                                                    msg.created_at
                                                ).toLocaleDateString()}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6 align-middle text-right">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => onView(msg)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all shadow-sm"
                                                    title="Ver Mensaje"
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
