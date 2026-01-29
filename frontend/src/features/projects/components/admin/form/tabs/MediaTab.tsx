import React from 'react';
import {
    FaImage,
    FaVideo,
    FaCloudUploadAlt,
    FaTimes,
    FaExchangeAlt,
    FaExpand,
    FaTrash,
    FaPlay,
    FaExclamationTriangle,
} from 'react-icons/fa';
import { ProjectImage, ProjectVideo } from '@/features/projects/types';
import {
    FileLimitInfo,
    MAX_IMG_SIZE_MB,
    MAX_VIDEO_SIZE_MB,
    ALLOWED_IMG_EXTENSIONS,
    ALLOWED_VIDEO_EXTENSIONS,
} from '../partials/FileLimitInfo';
import toast from 'react-hot-toast';

interface MediaTabProps {
    imgInputRef: React.RefObject<HTMLInputElement | null>;
    vidInputRef: React.RefObject<HTMLInputElement | null>;

    onFilesAdded: (files: File[], type: 'image' | 'video') => void;

    onRemoveNew: (index: number, type: 'image' | 'video') => void;
    onReplaceNewClick: (index: number, type: 'image' | 'video') => void;
    onReplaceServerClick: (id: number) => void;
    onDeleteServerClick: (id: number, type: 'image' | 'video') => void;
    onPreview: (url: string, type: 'image' | 'video') => void;

    imagePreviews: string[];
    existingImages: ProjectImage[];
    videoPreviews: string[];
    existingVideos: ProjectVideo[];

    isDragActiveImg: boolean;
    setIsDragActiveImg: (v: boolean) => void;
    isDragActiveVid: boolean;
    setIsDragActiveVid: (v: boolean) => void;
}

export const MediaTab: React.FC<MediaTabProps> = (props) => {
    const processFiles = (
        fileList: FileList | null,
        type: 'image' | 'video'
    ) => {
        if (!fileList || fileList.length === 0) return;

        const files = Array.from(fileList);
        const validFiles: File[] = [];
        const errors: string[] = [];

        const maxSize = type === 'image' ? MAX_IMG_SIZE_MB : MAX_VIDEO_SIZE_MB;
        const allowedExts =
            type === 'image'
                ? ALLOWED_IMG_EXTENSIONS
                : ALLOWED_VIDEO_EXTENSIONS;

        files.forEach((file) => {
            const fileSizeMB = file.size / 1024 / 1024;
            const fileExt = file.name.split('.').pop()?.toLowerCase();

            let errorMsg = null;

            if (fileSizeMB > maxSize) {
                errorMsg = `Peso excedido (${fileSizeMB.toFixed(1)}MB > ${maxSize}MB)`;
            }
            else if (!fileExt || !allowedExts.includes(fileExt)) {
                errorMsg = `Formato no válido (.${fileExt})`;
            }

            if (errorMsg) {
                errors.push(`${file.name}: ${errorMsg}`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            toast.custom(
                (t) => (
                    <div
                        className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-red-500`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-bold text-gray-900">
                                        Algunos archivos no se subieron
                                    </p>
                                    <ul className="mt-1 text-xs text-gray-500 list-disc list-inside">
                                        {errors.map((err, i) => (
                                            <li key={i} className="truncate">
                                                {err}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                ),
                { duration: 5000 }
            );
        }

        if (validFiles.length > 0) {
            props.onFilesAdded(validFiles, type);
            if (errors.length === 0 && validFiles.length > 0) {
                toast.success(
                    `${validFiles.length} archivo(s) agregado(s) correctamente.`
                );
            }
        }
    };

    const handleDrop = (e: React.DragEvent, type: 'image' | 'video') => {
        e.preventDefault();
        e.stopPropagation();

        if (type === 'image') props.setIsDragActiveImg(false);
        else props.setIsDragActiveVid(false);

        processFiles(e.dataTransfer.files, type);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'image' | 'video'
    ) => {
        processFiles(e.target.files, type);
        e.target.value = '';
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                <FaImage size={16} />
                            </span>
                            Galería de Imágenes
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 ml-10">
                            Arrastra múltiples imágenes para la galería.
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <FileLimitInfo type="image" />
                    </div>
                </div>

                <input
                    type="file"
                    ref={props.imgInputRef}
                    className="hidden"
                    multiple
                    accept={ALLOWED_IMG_EXTENSIONS.map((e) => `.${e}`).join(
                        ','
                    )}
                    onChange={(e) => handleInputChange(e, 'image')}
                />

                <div
                    onClick={() => props.imgInputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        props.setIsDragActiveImg(true);
                    }}
                    onDragLeave={() => props.setIsDragActiveImg(false)}
                    onDrop={(e) => handleDrop(e, 'image')}
                    className={`
                        w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mb-8 group relative overflow-hidden
                        ${
                            props.isDragActiveImg
                                ? 'border-orange-500 bg-orange-50 scale-[1.01] shadow-lg shadow-orange-500/10'
                                : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-orange-400'
                        }
                    `}
                >
                    <div
                        className={`
                        w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors z-10
                        ${props.isDragActiveImg ? 'bg-orange-200 text-orange-600' : 'bg-white shadow-sm text-slate-400 group-hover:text-orange-500'}
                    `}
                    >
                        <FaCloudUploadAlt size={28} />
                    </div>

                    <div className="text-center z-10">
                        <p
                            className={`text-sm font-bold transition-colors ${props.isDragActiveImg ? 'text-orange-800' : 'text-slate-600 group-hover:text-slate-800'}`}
                        >
                            {props.isDragActiveImg
                                ? '¡Suelta las imágenes aquí!'
                                : 'Arrastra tus fotos aquí'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Soporta carga múltiple •{' '}
                            <span className="text-orange-600 underline font-medium">
                                explorar archivos
                            </span>
                        </p>
                    </div>
                </div>

                {props.imagePreviews.length > 0 ||
                props.existingImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {props.imagePreviews.map((src, idx) => (
                            <div
                                key={`new-${idx}`}
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 hover:shadow-md transition-all"
                            >
                                <img
                                    src={src}
                                    className="w-full h-full object-cover"
                                    alt="Nueva"
                                />
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-sm z-10 uppercase tracking-wide">
                                    Nueva
                                </div>
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onReplaceNewClick(
                                                idx,
                                                'image'
                                            )
                                        }
                                        className="p-2 bg-white/20 text-white hover:bg-white hover:text-blue-600 rounded-lg transition-colors backdrop-blur-sm"
                                        title="Reemplazar"
                                    >
                                        <FaExchangeAlt />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onRemoveNew(idx, 'image')
                                        }
                                        className="p-2 bg-white/20 text-white hover:bg-white hover:text-red-500 rounded-lg transition-colors backdrop-blur-sm"
                                        title="Eliminar"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {props.existingImages.map((img) => (
                            <div
                                key={img.id}
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 hover:shadow-md transition-all"
                            >
                                <img
                                    src={img.image_url}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onPreview(
                                                img.image_url,
                                                'image'
                                            )
                                        }
                                        className="p-2 bg-white/20 text-white hover:bg-white hover:text-slate-800 rounded-lg transition-colors backdrop-blur-sm"
                                    >
                                        <FaExpand />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onReplaceServerClick(img.id)
                                        }
                                        className="p-2 bg-white/20 text-white hover:bg-white hover:text-blue-600 rounded-lg transition-colors backdrop-blur-sm"
                                    >
                                        <FaExchangeAlt />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onDeleteServerClick(
                                                img.id,
                                                'image'
                                            )
                                        }
                                        className="p-2 bg-white/20 text-white hover:bg-white hover:text-red-500 rounded-lg transition-colors backdrop-blur-sm"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-slate-400 text-sm italic">
                            No hay imágenes en la galería.
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FaVideo size={16} />
                            </span>
                            Videos y Recorridos
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 ml-10">
                            Arrastra videos promocionales (MP4, WEBM).
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <FileLimitInfo type="video" />
                    </div>
                </div>

                <input
                    type="file"
                    ref={props.vidInputRef}
                    className="hidden"
                    multiple
                    accept={ALLOWED_VIDEO_EXTENSIONS.map((e) => `.${e}`).join(
                        ','
                    )}
                    onChange={(e) => handleInputChange(e, 'video')}
                />

                <div
                    onClick={() => props.vidInputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        props.setIsDragActiveVid(true);
                    }}
                    onDragLeave={() => props.setIsDragActiveVid(false)}
                    onDrop={(e) => handleDrop(e, 'video')}
                    className={`
                        w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mb-8 group relative overflow-hidden
                        ${
                            props.isDragActiveVid
                                ? 'border-blue-500 bg-blue-50 scale-[1.01] shadow-lg shadow-blue-500/10'
                                : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-blue-400'
                        }
                    `}
                >
                    <div
                        className={`
                        w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors z-10
                        ${props.isDragActiveVid ? 'bg-blue-200 text-blue-600' : 'bg-white shadow-sm text-slate-400 group-hover:text-blue-500'}
                    `}
                    >
                        <FaCloudUploadAlt size={28} />
                    </div>

                    <div className="text-center z-10">
                        <p
                            className={`text-sm font-bold transition-colors ${props.isDragActiveVid ? 'text-blue-800' : 'text-slate-600 group-hover:text-slate-800'}`}
                        >
                            {props.isDragActiveVid
                                ? '¡Suelta los videos aquí!'
                                : 'Arrastra tus videos aquí'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Soporta carga múltiple •{' '}
                            <span className="text-blue-600 underline font-medium">
                                explorar archivos
                            </span>
                        </p>
                    </div>
                </div>

                {props.videoPreviews.length > 0 ||
                props.existingVideos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {props.videoPreviews.map((src, idx) => (
                            <div
                                key={`new-vid-${idx}`}
                                className="group relative aspect-video rounded-xl overflow-hidden bg-slate-900 border-2 border-green-500 shadow-md"
                            >
                                <video
                                    src={src}
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-md z-10 uppercase tracking-wide">
                                    Nuevo
                                </div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onReplaceNewClick(
                                                idx,
                                                'video'
                                            )
                                        }
                                        className="p-3 bg-white/20 text-white hover:bg-white hover:text-blue-600 rounded-full transition-colors backdrop-blur-sm"
                                    >
                                        <FaExchangeAlt />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onRemoveNew(idx, 'video')
                                        }
                                        className="p-3 bg-white/20 text-white hover:bg-white hover:text-red-500 rounded-full transition-colors backdrop-blur-sm"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {props.existingVideos.map((vid) => (
                            <div
                                key={vid.id}
                                className="group relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-lg transition-all"
                            >
                                <video
                                    src={vid.video_url}
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
                                />
                                <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/90 text-3xl drop-shadow-lg group-hover:scale-110 transition-transform" />

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onPreview(
                                                vid.video_url,
                                                'video'
                                            )
                                        }
                                        className="p-3 bg-white/20 text-white hover:bg-white hover:text-slate-800 rounded-full transition-colors backdrop-blur-sm"
                                        title="Reproducir"
                                    >
                                        <FaPlay size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onDeleteServerClick(
                                                vid.id,
                                                'video'
                                            )
                                        }
                                        className="p-3 bg-white/20 text-white hover:bg-white hover:text-red-500 rounded-full transition-colors backdrop-blur-sm"
                                        title="Eliminar"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                                    <p className="text-white text-xs font-medium truncate">
                                        {vid.title || `Video #${vid.id}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-slate-400 text-sm italic">
                            No hay videos subidos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
