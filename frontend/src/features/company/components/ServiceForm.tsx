import React, { useState, useEffect, useRef } from 'react';
import {
    FaSave,
    FaCloudUploadAlt,
    FaTrash,
    FaImage,
    FaCheckCircle,
    FaUndo,
    FaInfoCircle,
    FaPen,
} from 'react-icons/fa';
import { Service } from '@/types';

interface ServiceFormProps {
    initialData?: Service | null;
    onSubmit: (formData: FormData) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
    initialData,
    onSubmit,
    isLoading,
    onCancel,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isImageDeleted, setIsImageDeleted] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            if (initialData.image) {
                setPreviewUrl(initialData.image);
                setIsImageDeleted(false);
            }
        }
    }, [initialData]);

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Solo se permiten archivos de imagen.');
            return;
        }
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setIsImageDeleted(false);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover')
            setIsDragActive(true);
        else if (e.type === 'dragleave') setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImage(null);
        setPreviewUrl('');
        setIsImageDeleted(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const restoreOriginalImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (initialData?.image) {
            setPreviewUrl(initialData.image);
            setSelectedImage(null);
            setIsImageDeleted(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);

        if (selectedImage) {
            formData.append('image', selectedImage);
        } else if (isImageDeleted) {
            formData.append('image', '');
        }

        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <FaPen className="text-brand-500" size={14} />
                                <h3 className="text-lg font-bold text-slate-800">
                                    Información General
                                </h3>
                            </div>
                            {initialData && (
                                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100 uppercase tracking-wide">
                                    Modo Edición
                                </span>
                            )}
                        </div>

                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Título del Servicio{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej: Diseño de Interiores"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Descripción{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={6}
                                    placeholder="Describe en qué consiste este servicio, beneficios y detalles..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none leading-relaxed text-slate-600 placeholder-slate-400"
                                    required
                                />
                                <div className="flex justify-end mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {description.length} caracteres
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                            <FaImage className="text-brand-500" size={14} />
                            <h3 className="text-lg font-bold text-slate-800">
                                Imagen Principal
                            </h3>
                        </div>

                        <div
                            className={`
                                relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group bg-slate-50
                                ${
                                    isDragActive
                                        ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-500/20'
                                        : 'border-slate-300 hover:border-brand-400 hover:bg-white'
                                }
                                ${previewUrl && !isDragActive ? 'border-solid border-slate-200 bg-white' : ''}
                            `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileInput}
                            />

                            {previewUrl ? (
                                <>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm">
                                        <FaCloudUploadAlt className="text-white text-3xl mb-2" />
                                        <span className="text-white font-bold text-sm">
                                            Cambiar Imagen
                                        </span>
                                        <span className="text-white/70 text-xs mt-1">
                                            Click o arrastrar
                                        </span>
                                    </div>

                                    {selectedImage && (
                                        <div className="absolute top-3 left-3 z-20 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-green-500/30">
                                            <FaCheckCircle /> NUEVA
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all z-30 shadow-lg border border-slate-100"
                                        title="Eliminar imagen"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    {isImageDeleted && initialData?.image ? (
                                        <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center bg-red-50/50">
                                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-3">
                                                <FaTrash />
                                            </div>
                                            <p className="text-red-500 font-bold text-sm mb-4">
                                                Imagen eliminada
                                            </p>

                                            <button
                                                type="button"
                                                onClick={restoreOriginalImage}
                                                className="text-xs flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl transition-all shadow-sm border border-slate-200 font-bold w-full max-w-[160px]"
                                            >
                                                <FaUndo size={10} /> Restaurar
                                            </button>

                                            <div className="my-3 w-full flex items-center gap-2 text-slate-300 text-[10px] font-bold uppercase">
                                                <span className="h-px bg-slate-200 flex-1"></span>{' '}
                                                O{' '}
                                                <span className="h-px bg-slate-200 flex-1"></span>
                                            </div>

                                            <span className="text-xs text-slate-400 font-medium">
                                                Sube una nueva
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-center p-6">
                                            <div
                                                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${isDragActive ? 'bg-brand-100 text-brand-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500'}`}
                                            >
                                                <FaCloudUploadAlt className="text-3xl" />
                                            </div>
                                            <p className="font-bold text-slate-700 text-sm mb-1">
                                                {isDragActive
                                                    ? '¡Suelta la imagen aquí!'
                                                    : 'Sube tu imagen'}
                                            </p>
                                            <p className="text-slate-400 text-xs px-4 leading-relaxed">
                                                Arrastra y suelta o haz clic
                                                para buscar en tus archivos
                                            </p>
                                            <div className="mt-4 inline-block bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-1 rounded border border-slate-200">
                                                JPG, PNG, WEBP
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start">
                            <FaInfoCircle
                                className="text-blue-500 mt-0.5 shrink-0"
                                size={14}
                            />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Se recomienda usar imágenes de alta calidad con
                                relación de aspecto <strong>4:3</strong> o{' '}
                                <strong>16:9</strong> para mejor visualización.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 hover:text-slate-800 transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <FaSave />{' '}
                            {initialData ? 'Guardar Cambios' : 'Crear Servicio'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
