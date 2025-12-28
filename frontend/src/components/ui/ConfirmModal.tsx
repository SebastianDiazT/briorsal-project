import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean; // Para poner el botón rojo
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    isDestructive = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 animate-scale-in border border-slate-100">
                <div className="flex flex-col items-center text-center">
                    <div
                        className={`h-14 w-14 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}
                    >
                        <FaExclamationTriangle size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95 ${
                                isDestructive
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30'
                                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/30'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
