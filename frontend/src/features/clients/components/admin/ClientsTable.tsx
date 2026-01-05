import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Client } from '../../types';

interface ClientsTableProps {
    clients: Client[];
    isLoading: boolean;
    onEdit: (client: Client) => void;
    onDelete: (id: number) => void;
    EmptyState: React.ComponentType;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
    clients,
    isLoading,
    onEdit,
    onDelete,
    EmptyState,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 animate-pulse"
                    >
                        <div className="w-16 h-16 bg-slate-100 rounded-lg"></div>
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
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-32 text-center">
                                Logo
                            </th>
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                Nombre
                            </th>
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                Fecha Registro
                            </th>
                            <th className="py-4 px-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={4}>
                                    <EmptyState />
                                </td>
                            </tr>
                        ) : (
                            clients.map((client) => (
                                <tr
                                    key={client.id}
                                    className="hover:bg-slate-50 transition-colors group"
                                >
                                    <td className="py-4 px-6 text-center align-middle">
                                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-lg p-2 flex items-center justify-center mx-auto shadow-sm">
                                            <img
                                                src={client.image}
                                                alt={client.name}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <span className="font-bold text-slate-700 text-lg">
                                            {client.name}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 align-middle">
                                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                            {new Date(
                                                client.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(client)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-500 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition-all shadow-sm"
                                                title="Editar"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDelete(client.id)
                                                }
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all shadow-sm"
                                                title="Eliminar"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
