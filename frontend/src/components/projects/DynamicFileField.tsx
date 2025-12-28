import React from 'react';
import { FaPlus, FaTrash, FaFileImage, FaFileVideo } from 'react-icons/fa';

interface DynamicFileFieldProps {
    label: string;
    accept: string;
    icon: 'image' | 'video';
    fields: { id: string; file: File | null }[];
    onAdd: () => void;
    onRemove: (id: string) => void;
    onChange: (id: string, file: File) => void;
}

export const DynamicFileField: React.FC<DynamicFileFieldProps> = ({
    label,
    accept,
    icon,
    fields,
    onAdd,
    onRemove,
    onChange,
}) => {
    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                {label}
            </label>

            <div className="space-y-3">
                {fields.map((field) => (
                    <div
                        key={field.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 animate-fade-in-up"
                    >
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                {icon === 'image' ? (
                                    <FaFileImage />
                                ) : (
                                    <FaFileVideo />
                                )}
                            </div>
                            <input
                                type="file"
                                accept={accept}
                                onChange={(e) =>
                                    e.target.files?.[0] &&
                                    onChange(field.id, e.target.files[0])
                                }
                                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-xs file:font-semibold
                                    file:bg-white file:text-brand-600
                                    hover:file:bg-brand-50
                                    border border-slate-300 rounded-lg pl-10 cursor-pointer bg-white"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => onRemove(field.id)}
                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto flex justify-center"
                            title="Eliminar campo"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={onAdd}
                className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline uppercase"
            >
                <FaPlus /> Agregar {icon === 'image' ? 'Imagen' : 'Video'}
            </button>
        </div>
    );
};
