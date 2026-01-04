import React, { useState, useEffect } from 'react';
import { FaSave, FaSpinner, FaTag } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Category } from '../../types';

interface CategoryFormProps {
    initialData?: Category;
    onSubmit: (data: { name: string }) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    onSubmit,
    isLoading,
    onCancel,
}) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('El nombre es obligatorio');
        await onSubmit({ name: name.trim().toLocaleUpperCase() });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="animate-fade-in-up max-w-7xl mx-auto"
        >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                            <FaTag />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">
                                {initialData
                                    ? 'Editar Categoría'
                                    : 'Nueva Categoría'}
                            </h3>
                            <p className="text-xs text-slate-500">
                                Clasificación para tus proyectos.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-medium"
                            placeholder="Ej: Residencial, Comercial..."
                            autoFocus
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-orange-600 shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70"
                    >
                        {isLoading ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <FaSave />
                        )}
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    );
};
