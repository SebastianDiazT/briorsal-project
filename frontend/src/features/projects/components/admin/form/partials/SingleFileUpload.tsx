import React, { useRef, useState } from 'react';
import {
    FaCloudUploadAlt,
    FaTrash,
    FaExchangeAlt,
    FaImage,
    FaExclamationTriangle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { MAX_IMG_SIZE_MB, ALLOWED_IMG_EXTENSIONS } from './FileLimitInfo';

interface SingleFileUploadProps {
    label: string;
    subLabel?: string;
    previewUrl: string;
    file: File | null;
    onChange: (file: File) => void;
    onRemove: () => void;
    aspectRatioClass?: string;
    error?: string;
}

export const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
    label,
    subLabel,
    previewUrl,
    onChange,
    onRemove,
    aspectRatioClass = 'aspect-video',
    error,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const validateAndUpload = (file: File) => {
        const fileSizeMB = file.size / 1024 / 1024;
        if (fileSizeMB > MAX_IMG_SIZE_MB) {
            toast.error(
                `El archivo excede el límite de ${MAX_IMG_SIZE_MB}MB. Tu archivo pesa ${fileSizeMB.toFixed(2)}MB.`,
                { duration: 4000 }
            );
            return;
        }

        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!fileExt || !ALLOWED_IMG_EXTENSIONS.includes(fileExt)) {
            toast.error(
                `Tipo de archivo no válido (.${fileExt}). Solo se permiten: ${ALLOWED_IMG_EXTENSIONS.join(', ').toUpperCase()}.`
            );
            return;
        }

        onChange(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            validateAndUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            validateAndUpload(e.target.files[0]);
        }
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-baseline mb-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <FaImage className="text-orange-500" />
                        {label}
                    </label>
                    {previewUrl && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="text-xs text-red-500 font-bold hover:text-red-600 hover:underline flex items-center gap-1 transition-colors"
                        >
                            <FaTrash size={10} /> Eliminar imagen
                        </button>
                    )}
                </div>
            )}

            <div
                onClick={() => !previewUrl && inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!previewUrl) setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={!previewUrl ? handleDrop : undefined}
                className={`
                    relative w-full ${aspectRatioClass} rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group
                    ${error ? 'border-red-300 bg-red-50/20' : ''}
                    ${
                        previewUrl
                            ? 'border-slate-200 shadow-sm'
                            : 'cursor-pointer hover:border-orange-400 hover:bg-slate-50'
                    }
                    ${isDragOver ? 'border-orange-500 bg-orange-50 scale-[1.01] shadow-xl shadow-orange-500/10' : 'border-slate-300 bg-slate-50'}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleChange}
                />

                {previewUrl ? (
                    <>
                        <img
                            src={previewUrl}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                            <p className="text-white text-xs font-bold uppercase tracking-wider translate-y-2 group-hover:translate-y-0 transition-transform">
                                Opciones de Imagen
                            </p>
                            <div className="flex gap-3 translate-y-2 group-hover:translate-y-0 transition-transform delay-75">
                                <button
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    className="px-4 py-2 bg-white hover:bg-orange-50 text-slate-900 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 hover:scale-105"
                                >
                                    <FaExchangeAlt /> Cambiar
                                </button>
                                <button
                                    type="button"
                                    onClick={onRemove}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 hover:scale-105"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none">
                        <div
                            className={`
                                w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors 
                                ${isDragOver ? 'bg-orange-200 text-orange-600' : 'bg-white shadow-sm text-slate-400 group-hover:text-orange-500'}
                            `}
                        >
                            <FaCloudUploadAlt size={24} />
                        </div>

                        <h4
                            className={`font-bold text-sm mb-1 ${isDragOver ? 'text-orange-700' : 'text-slate-700'}`}
                        >
                            {isDragOver
                                ? '¡Suelta la imagen para subirla!'
                                : 'Haz clic o arrastra tu imagen aquí'}
                        </h4>

                        <p className="text-xs text-slate-400 px-4 leading-relaxed">
                            Soporta archivos{' '}
                            <span className="font-semibold text-slate-500">
                                JPG, PNG y WEBP
                            </span>{' '}
                            hasta 5MB.
                        </p>

                        {subLabel && (
                            <span className="mt-3 inline-block px-2 py-1 bg-white/60 border border-slate-200 rounded text-[10px] font-medium text-slate-500">
                                {subLabel}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-start gap-2 mt-2 text-red-500 text-xs animate-fade-in">
                    <FaExclamationTriangle className="mt-0.5 shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            )}
        </div>
    );
};
