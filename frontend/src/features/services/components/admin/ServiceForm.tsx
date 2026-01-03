import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    FaSave,
    FaSpinner,
    FaCloudUploadAlt,
    FaTrash,
    FaImage,
    FaInfoCircle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Service } from '../../types';

interface ServiceFormProps {
    initialData?: Service;
    onSubmit: (data: FormData) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
    initialData,
    onSubmit,
    isLoading,
    onCancel,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setPreviewImage(initialData.image);
        }
    }, [initialData]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files?.length) processFile(e.dataTransfer.files[0]);
    }, []);

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/'))
            return toast.error(
                'Solo se permiten archivos de imagen (JPG, PNG, WEBP)'
            );
        setPreviewImage(URL.createObjectURL(file));
        setImageFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim())
            return toast.error('Nombre y descripción requeridos');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (imageFile) formData.append('image', imageFile);

        await onSubmit(formData);
    };

    const labelClass =
        'block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1';
    const inputClass =
        'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-medium';

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">
                                Información General
                            </h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Detalles básicos del servicio.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className={labelClass}>
                                        Nombre del Servicio{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="Ej: Consultoría Integral"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Descripción{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        rows={5}
                                        className={`${inputClass} resize-none leading-relaxed`}
                                        placeholder="Detalla en qué consiste el servicio..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                                    <FaImage className="text-orange-500" />{' '}
                                    Multimedia
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Imagen de portada para la tarjeta del
                                    servicio.
                                </p>
                            </div>
                            <div className="hidden sm:flex text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full gap-2 items-center">
                                <FaInfoCircle /> Recomendado: Horizontal
                            </div>
                        </div>

                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragActive(true);
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault();
                                setIsDragActive(false);
                            }}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative w-full aspect-video md:aspect-[21/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group
                                ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-slate-300 hover:border-orange-400 hover:bg-slate-50'}`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) =>
                                    e.target.files &&
                                    processFile(e.target.files[0])
                                }
                            />

                            {previewImage ? (
                                <>
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                        <span className="text-white font-bold bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md">
                                            Cambiar Imagen
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewImage(null);
                                                setImageFile(null);
                                                if (fileInputRef.current)
                                                    fileInputRef.current.value =
                                                        '';
                                            }}
                                            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                            title="Eliminar imagen"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <FaCloudUploadAlt className="text-3xl text-orange-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 block">
                                        Haz clic o arrastra una imagen aquí
                                    </span>
                                    <span className="text-xs text-slate-400 mt-1 block">
                                        Formatos: JPG, PNG, WEBP (Max 5MB)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-orange-600 shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />{' '}
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FaSave /> Guardar Servicio
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};
