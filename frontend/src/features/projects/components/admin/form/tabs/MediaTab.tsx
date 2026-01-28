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
} from 'react-icons/fa';
import { ProjectImage, ProjectVideo } from '@/features/projects/types';
import { FileLimitInfo } from '../partials/FileLimitInfo';

interface MediaTabProps {
    imgInputRef: React.RefObject<HTMLInputElement | null>;
    vidInputRef: React.RefObject<HTMLInputElement | null>;

    onFileDrop: (e: React.DragEvent, type: 'image' | 'video') => void;
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
    return (
        <div className="animate-fade-in space-y-12">
            <div>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                                <FaImage size={16} />
                            </span>
                            Galería de Imágenes
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 ml-11">
                            Formatos: JPG, PNG, WEBP. Máx 5MB.
                        </p>
                    </div>
                    <FileLimitInfo type="image" />
                </div>

                <div
                    onClick={() => props.imgInputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        props.setIsDragActiveImg(true);
                    }}
                    onDragLeave={() => props.setIsDragActiveImg(false)}
                    onDrop={(e) => props.onFileDrop(e, 'image')}
                    className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mb-6 group
                        ${
                            props.isDragActiveImg
                                ? 'border-orange-500 bg-orange-50 scale-[1.01]'
                                : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-orange-400'
                        }`}
                >
                    <FaCloudUploadAlt
                        className={`text-3xl mb-2 transition-colors ${props.isDragActiveImg ? 'text-orange-600' : 'text-slate-400 group-hover:text-orange-500'}`}
                    />
                    <p className="text-sm font-bold text-slate-600 group-hover:text-slate-800">
                        Arrastra tus fotos aquí o{' '}
                        <span className="text-orange-600 underline">
                            haz clic para explorar
                        </span>
                    </p>
                </div>

                {(props.imagePreviews.length > 0 ||
                    props.existingImages.length > 0) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {props.imagePreviews.map((src, idx) => (
                            <div
                                key={`new-${idx}`}
                                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 hover:shadow-md transition-all"
                            >
                                <img
                                    src={src}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-sm z-10">
                                    NUEVA
                                </div>
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onReplaceNewClick(
                                                idx,
                                                'image'
                                            )
                                        }
                                        className="p-2 bg-white/10 text-white hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
                                        title="Reemplazar"
                                    >
                                        <FaExchangeAlt />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onRemoveNew(idx, 'image')
                                        }
                                        className="p-2 bg-white/10 text-white hover:bg-white hover:text-red-500 rounded-lg transition-colors"
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
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onPreview(
                                                img.image_url,
                                                'image'
                                            )
                                        }
                                        className="p-2 bg-white/10 text-white hover:bg-white hover:text-slate-800 rounded-lg transition-colors"
                                        title="Ver"
                                    >
                                        <FaExpand />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            props.onReplaceServerClick(img.id)
                                        }
                                        className="p-2 bg-white/10 text-white hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
                                        title="Cambiar"
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
                                        className="p-2 bg-white/10 text-white hover:bg-white hover:text-red-500 rounded-lg transition-colors"
                                        title="Borrar"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-slate-100 my-8"></div>

            <div>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                <FaVideo size={16} />
                            </span>
                            Videos y Recorridos
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 ml-11">
                            Formatos: MP4, WEBM. Máx 100MB.
                        </p>
                    </div>
                    <FileLimitInfo type="video" />
                </div>

                <div
                    onClick={() => props.vidInputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        props.setIsDragActiveVid(true);
                    }}
                    onDragLeave={() => props.setIsDragActiveVid(false)}
                    onDrop={(e) => props.onFileDrop(e, 'video')}
                    className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mb-6 group
                        ${
                            props.isDragActiveVid
                                ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                                : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-blue-400'
                        }`}
                >
                    <FaCloudUploadAlt
                        className={`text-3xl mb-2 transition-colors ${props.isDragActiveVid ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}
                    />
                    <p className="text-sm font-bold text-slate-600 group-hover:text-slate-800">
                        Arrastra tus videos aquí o{' '}
                        <span className="text-blue-600 underline">
                            haz clic para explorar
                        </span>
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {props.videoPreviews.map((src, idx) => (
                        <div
                            key={`new-vid-${idx}`}
                            className="group relative aspect-video rounded-xl overflow-hidden bg-slate-900 border-2 border-green-500 shadow-md"
                        >
                            <video
                                src={src}
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-md z-10">
                                NUEVO
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        props.onReplaceNewClick(idx, 'video')
                                    }
                                    className="p-3 bg-white/20 text-white hover:bg-white hover:text-blue-600 rounded-full transition-colors"
                                >
                                    <FaExchangeAlt />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        props.onRemoveNew(idx, 'video')
                                    }
                                    className="p-3 bg-white/20 text-white hover:bg-white hover:text-red-500 rounded-full transition-colors"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                    {props.existingVideos.map((vid) => (
                        <div
                            key={vid.id}
                            className="group relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm"
                        >
                            <video
                                src={vid.video_url}
                                className="w-full h-full object-cover opacity-50"
                            />
                            <FaPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 text-2xl drop-shadow-lg" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        props.onPreview(vid.video_url, 'video')
                                    }
                                    className="p-3 bg-white/20 text-white hover:bg-white hover:text-slate-800 rounded-full transition-colors"
                                >
                                    <FaPlay size={12} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        props.onDeleteServerClick(
                                            vid.id,
                                            'video'
                                        )
                                    }
                                    className="p-3 bg-white/20 text-white hover:bg-white hover:text-red-500 rounded-full transition-colors"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                <p className="text-white text-xs font-medium truncate">
                                    {vid.title || `Video ${vid.id}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
