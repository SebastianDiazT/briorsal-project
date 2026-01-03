import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    FaPlay,
    FaImages,
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaTh,
} from 'react-icons/fa';
import { Project } from '@/features/projects/types';

interface MediaItem {
    id: number | string;
    type: 'image' | 'video';
    url: string;
}

export const ProjectGallery: React.FC<{ project: Project }> = ({ project }) => {
    const allMedia: MediaItem[] = [
        ...project.videos.map((v) => ({
            id: `v-${v.id}`,
            type: 'video' as const,
            url: v.video,
        })),
        ...project.images.map((i) => ({
            id: `i-${i.id}`,
            type: 'image' as const,
            url: i.image,
        })),
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    if (allMedia.length === 0) return null;

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    const nextSrc = () => {
        setPhotoIndex((prev) => (prev + 1) % allMedia.length);
    };

    const prevSrc = () => {
        setPhotoIndex((prev) => (prev + allMedia.length - 1) % allMedia.length);
    };

    const displayItems = allMedia.slice(0, 5);
    const remainingCount = allMedia.length - 5;

    return (
        <>
            <div className="animate-fade-in border-t border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-md">
                            <FaImages size={18} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">
                            Galería
                        </h3>
                    </div>
                    {allMedia.length > 5 && (
                        <button
                            onClick={() => openLightbox(0)}
                            className="text-sm font-bold text-slate-600 hover:text-orange-600 flex items-center gap-2 transition-colors"
                        >
                            <FaTh /> Ver todas las fotos
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer">
                    {displayItems.map((item, index) => {
                        let gridClass = 'md:col-span-1 md:row-span-1';

                        if (index === 0) {
                            gridClass = 'md:col-span-2 md:row-span-2';
                        }

                        return (
                            <div
                                key={item.id}
                                className={`relative group overflow-hidden bg-slate-100 ${gridClass} ${index > 0 ? 'hidden md:block' : 'block h-full'}`}
                                onClick={() => openLightbox(index)}
                            >
                                {item.type === 'video' ? (
                                    <div className="w-full h-full relative">
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover"
                                            muted
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                            <FaPlay className="text-white text-3xl drop-shadow-md" />
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={item.url}
                                        alt="Gallery"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                )}

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                                {index === 4 && remainingCount > 0 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] transition-colors hover:bg-black/50">
                                        <span className="text-white font-bold text-xl md:text-2xl flex flex-col items-center">
                                            +{remainingCount}
                                            <span className="text-xs font-normal opacity-80 mt-1">
                                                Ver más
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {isOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in touch-none">
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-[100000] cursor-pointer"
                            aria-label="Cerrar galería"
                        >
                            <FaTimes size={24} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevSrc();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-[100000] hidden md:block cursor-pointer"
                        >
                            <FaChevronLeft size={24} />
                        </button>

                        <div className="w-full h-full max-w-7xl max-h-screen p-4 md:p-10 flex flex-col items-center justify-center relative z-[99999]">
                            {allMedia[photoIndex].type === 'video' ? (
                                <video
                                    src={allMedia[photoIndex].url}
                                    className="max-w-full max-h-[85vh] rounded shadow-2xl outline-none"
                                    controls
                                    autoPlay
                                />
                            ) : (
                                <img
                                    src={allMedia[photoIndex].url}
                                    alt="Full view"
                                    className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl select-none"
                                />
                            )}

                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/50 px-4 py-1 rounded-full backdrop-blur-md select-none">
                                {photoIndex + 1} / {allMedia.length}
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextSrc();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-[100000] hidden md:block cursor-pointer"
                        >
                            <FaChevronRight size={24} />
                        </button>
                    </div>,
                    document.body
                )}
        </>
    );
};
