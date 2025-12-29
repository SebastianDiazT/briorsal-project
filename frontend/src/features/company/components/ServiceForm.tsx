import React, { useState, useEffect, useRef } from 'react';
import {
    FaSave,
    FaCloudUploadAlt,
    FaTrash,
    FaImage,
    FaCheckCircle,
    FaUndo,
} from 'react-icons/fa';
import { Service } from '../../../types';

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
    // Campos de texto
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Campos de Imagen
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    // NUEVO: Bandera para saber si el usuario quiso borrar la imagen explícitamente
    const [isImageDeleted, setIsImageDeleted] = useState(false);

    // UI State
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cargar datos iniciales
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            // Si hay imagen guardada, la mostramos
            if (initialData.image) {
                setPreviewUrl(initialData.image);
                setIsImageDeleted(false);
            }
        }
    }, [initialData]);

    // --- MANEJO DE IMÁGENES ---

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Solo se permiten archivos de imagen.');
            return;
        }
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setIsImageDeleted(false); // Ya no está borrada, hay una nueva
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
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    // ACCIÓN: BORRAR IMAGEN
    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImage(null);
        setPreviewUrl('');
        setIsImageDeleted(true); // <--- Marcamos para borrar en backend
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ACCIÓN: RESTAURAR (Si el usuario se arrepiente y quiere la imagen original)
    const restoreOriginalImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (initialData?.image) {
            setPreviewUrl(initialData.image);
            setSelectedImage(null);
            setIsImageDeleted(false);
        }
    };

    // --- SUBMIT ---

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);

        // LÓGICA DE 3 ESTADOS PARA IMAGEN:
        if (selectedImage) {
            // 1. Si hay nueva imagen, la enviamos (Reemplazar)
            formData.append('image', selectedImage);
        } else if (isImageDeleted) {
            // 2. Si el usuario la borró explícitamente, enviamos cadena vacía (Borrar)
            formData.append('image', '');
        }
        // 3. Si no hay new image y no está borrada, NO enviamos el campo.
        // Django mantendrá la imagen que ya existe en base de datos.

        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
            {/* IZQUIERDA: FORMULARIO */}
            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* COLUMNA 1: INFO TEXTUAL */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800">
                                    Información General
                                </h3>
                                {initialData && (
                                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100 uppercase">
                                        Modo Edición
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                        Título{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        placeholder="Ej: Diseño de Interiores"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700"
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
                                        placeholder="Describe el servicio..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none leading-relaxed text-slate-600"
                                        required
                                    />
                                    <div className="text-right mt-1 text-xs text-slate-400 font-medium">
                                        {description.length} caracteres
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA 2: DRAG & DROP IMAGEN */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                            Icono / Imagen
                        </h3>

                        <div
                            className={`
                                relative w-full aspect-square rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group
                                ${isDragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}
                                ${previewUrl && !isDragActive ? 'border-solid border-slate-200' : ''}
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
                                    {/* VISTA PREVIA IMAGEN */}
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-contain p-4"
                                    />

                                    {/* OVERLAY HOVER */}
                                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <FaCloudUploadAlt className="text-white text-3xl mb-2" />
                                        <span className="text-white font-bold text-sm">
                                            Cambiar Imagen
                                        </span>
                                    </div>

                                    {/* INDICADOR NUEVA IMAGEN */}
                                    {selectedImage && (
                                        <div className="absolute bottom-4 left-4 z-20 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                            <FaCheckCircle /> NUEVA
                                        </div>
                                    )}

                                    {/* BOTÓN ELIMINAR */}
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all z-30 shadow-lg border border-slate-100"
                                        title="Eliminar imagen"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* ESTADO VACÍO O BORRADO */}
                                    <div className="text-center p-6 pointer-events-none">
                                        {isImageDeleted &&
                                        initialData?.image ? (
                                            <div className="pointer-events-auto">
                                                <p className="text-red-500 font-bold text-sm mb-2">
                                                    Imagen marcada para borrar
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={
                                                        restoreOriginalImage
                                                    }
                                                    className="text-xs flex items-center justify-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-full transition-colors mx-auto font-bold"
                                                >
                                                    <FaUndo size={10} />{' '}
                                                    Restaurar Original
                                                </button>
                                                <p className="text-slate-400 text-xs mt-4">
                                                    o sube una nueva
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div
                                                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}`}
                                                >
                                                    <FaImage className="text-2xl" />
                                                </div>
                                                <p className="font-bold text-slate-700 text-sm mb-1">
                                                    {isDragActive
                                                        ? '¡Suelta la imagen aquí!'
                                                        : 'Arrastra tu imagen aquí'}
                                                </p>
                                                <p className="text-slate-400 text-xs">
                                                    o haz click para buscar
                                                </p>
                                                <p className="text-[10px] text-slate-300 mt-4 uppercase font-bold tracking-wider">
                                                    PNG, JPG, SVG
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        'Guardando...'
                    ) : (
                        <>
                            <FaSave /> Guardar Cambios
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
