import React from 'react';
import {
    FaTimes,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaTag,
    FaCheckCircle,
} from 'react-icons/fa';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
    ContactMessage,
    ContactStatus,
    INQUIRY_LABELS,
    STATUS_LABELS,
} from '../../types';

interface MessageDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: ContactMessage | null;
    onStatusChange?: (id: number, status: ContactStatus) => void;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
    isOpen,
    onClose,
    message,
    onStatusChange,
}) => {
    if (!isOpen || !message) return null;

    const date = new Date(message.created_at).toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const statusOptions = Object.entries(STATUS_LABELS).map(
        ([value, label]) => ({
            value,
            label,
        })
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <FaEnvelope />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 leading-tight">
                                {INQUIRY_LABELS[message.inquiry_type]}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                                ID: #{message.id}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-blue-500" />
                            <span className="text-sm font-bold text-blue-800">
                                Estado Actual:
                            </span>
                            <span className="text-sm font-medium text-slate-700">
                                {STATUS_LABELS[message.status]}
                            </span>
                        </div>

                        {onStatusChange && (
                            <div className="w-full sm:w-64">
                                <CustomSelect
                                    value={message.status}
                                    onChange={(val) =>
                                        onStatusChange(
                                            message.id,
                                            val as ContactStatus
                                        )
                                    }
                                    options={statusOptions}
                                    placeholder="Cambiar Estado"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FaUser size={10} /> Remitente
                            </label>
                            <p className="text-slate-800 font-semibold text-lg">
                                {message.first_name} {message.last_name}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FaCalendarAlt size={10} /> Recibido
                            </label>
                            <p className="text-slate-600 text-sm capitalize">
                                {date}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FaEnvelope size={10} /> Email
                            </label>
                            <a
                                href={`mailto:${message.email}`}
                                className="text-orange-600 hover:underline font-medium break-all"
                            >
                                {message.email}
                            </a>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FaPhone size={10} /> Teléfono
                            </label>
                            <p className="text-slate-600 font-medium">
                                {message.phone || 'No especificado'}
                            </p>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FaTag size={10} /> Asunto
                            </label>
                            <p className="text-slate-800 font-bold text-lg break-words">
                                {message.subject || 'Sin Asunto'}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap break-words text-sm md:text-base">
                            {message.message}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end shrink-0 gap-3">
                    <a
                        href={`mailto:${message.email}?subject=RE: ${message.subject || 'Consulta'}`}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm"
                    >
                        Responder por Correo
                    </a>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-slate-900/10 text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
