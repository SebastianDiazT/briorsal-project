import React, { useRef } from 'react';
import {
    FaCloudUploadAlt,
    FaTrash,
    FaExchangeAlt,
    FaImage,
} from 'react-icons/fa';
import { FileLimitInfo } from './FileLimitInfo';

interface SingleFileUploadProps {
    label: string;
    subLabel?: string;
    previewUrl: string;
    file: File | null;
    onChange: (file: File) => void;
    onRemove: () => void;
    accept?: string;
    aspectRatioClass?: string;
    isBanner?: boolean;
}

export const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
    label,
    subLabel,
    previewUrl,
    onChange,
    onRemove,
    accept = 'image/*',
    aspectRatioClass = 'aspect-video',
    isBanner = false,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = React.useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            onChange(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onChange(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-baseline mb-2">
                <label className="text-sm font-bold text-slate-700">
                    {label}
                </label>
                {previewUrl && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
                    >
                        <FaTrash size={10} /> Eliminar imagen
                    </button>
                )}
            </div>

            <div
                onClick={() => !previewUrl && inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`
                    relative w-full ${aspectRatioClass} rounded-2xl border-2 border-dashed transition-all overflow-hidden group
                    ${previewUrl ? 'border-slate-200' : 'cursor-pointer'}
                    ${isDragOver ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleChange}
                />

                {previewUrl ? (
                    <>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                            <p className="text-white text-xs font-medium">
                                Acciones
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    className="px-4 py-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg text-xs font-bold backdrop-blur-md transition-all flex items-center gap-2"
                                >
                                    <FaExchangeAlt /> Cambiar
                                </button>
                                <button
                                    type="button"
                                    onClick={onRemove}
                                    className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg text-xs font-bold backdrop-blur-md transition-all flex items-center gap-2"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <div
                            className={`p-4 rounded-full bg-white shadow-sm mb-3 ${isDragOver ? 'text-orange-500' : 'text-slate-400'}`}
                        >
                            {isBanner ? (
                                <FaImage size={24} />
                            ) : (
                                <FaCloudUploadAlt size={24} />
                            )}
                        </div>
                        <p className="text-sm font-bold text-slate-600">
                            Haz clic o arrastra aquí
                        </p>
                        {subLabel && (
                            <p className="text-xs text-slate-400 mt-1">
                                {subLabel}
                            </p>
                        )}
                    </div>
                )}
            </div>
            {!previewUrl && <FileLimitInfo type="image" />}
        </div>
    );
};
