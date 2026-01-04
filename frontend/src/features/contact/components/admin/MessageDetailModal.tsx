import React from 'react';
import {
    FaTimes,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaPaperPlane,
} from 'react-icons/fa';
import { ContactMessage } from '../../types';

interface MessageDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: ContactMessage | null;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
    isOpen,
    onClose,
    message,
}) => {
    if (!isOpen || !message) return null;

    const date = new Date(message.created_at).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FaPaperPlane className="text-orange-500" />
                        Detalle del Mensaje
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
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
                                <FaCalendarAlt size={10} /> Fecha
                            </label>
                            <p className="text-slate-600">{date}</p>
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
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Asunto
                            </label>
                            <p className="text-slate-800 font-bold text-xl break-words">
                                {message.subject || 'Sin Asunto'}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                            {message.message}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-slate-900/10"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
