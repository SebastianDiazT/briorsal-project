import React, { useState, useEffect, useRef } from 'react';
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
            url: v.video_url,
        })),
        ...project.images.map((i) => ({
            id: `i-${i.id}`,
            type: 'image' as const,
            url: i.image_url,
        })),
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            window.history.pushState({ lightboxOpen: true }, '');

            const handlePopState = () => {
                setIsOpen(false);
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [isOpen]);

    if (allMedia.length === 0) return null;

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setIsOpen(true);
    };

    const closeLightbox = () => {
        if (isOpen) {
            window.history.back();
            setIsOpen(false);
        }
    };

    const nextSrc = () => {
        setPhotoIndex((prev) => (prev + 1) % allMedia.length);
    };

    const prevSrc = () => {
        setPhotoIndex((prev) => (prev + allMedia.length - 1) % allMedia.length);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            nextSrc();
        } else if (distance < -minSwipeDistance) {
            prevSrc();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    const displayItems = allMedia.slice(0, 5);
    const remainingCount = allMedia.length - 5;

    return (
        <>
            <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <FaImages size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                            Galería ({allMedia.length})
                        </h3>
                    </div>
                    {allMedia.length > 5 && (
                        <button
                            onClick={() => openLightbox(0)}
                            className="text-sm font-bold text-slate-500 hover:text-orange-600 flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 hover:border-orange-200 shadow-sm"
                        >
                            <FaTh /> Ver todas
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[300px] md:h-[500px] rounded-3xl overflow-hidden">
                    {displayItems.map((item, index) => {
                        let gridClass = 'md:col-span-1 md:row-span-1';
                        if (index === 0)
                            gridClass = 'md:col-span-2 md:row-span-2';

                        return (
                            <div
                                key={item.id}
                                className={`relative group overflow-hidden bg-slate-200 cursor-pointer ${gridClass} ${index > 0 ? 'hidden md:block' : 'block h-full'}`}
                                onClick={() => openLightbox(index)}
                            >
                                {item.type === 'video' ? (
                                    <div className="w-full h-full relative">
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                            muted
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                                                <FaPlay className="ml-1" />
                                            </div>
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
                                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center backdrop-blur-[2px] transition-colors hover:bg-slate-900/50">
                                        <span className="text-white font-black text-3xl">
                                            +{remainingCount}
                                        </span>
                                        <span className="text-white/80 text-xs font-medium mt-1">
                                            Ver más fotos
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
                    <div
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in touch-none"
                        onClick={closeLightbox}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeLightbox();
                            }}
                            className="absolute top-4 right-4 md:top-6 md:right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-[10000] cursor-pointer backdrop-blur-md shadow-lg"
                            aria-label="Cerrar galería"
                        >
                            <FaTimes size={24} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevSrc();
                            }}
                            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/20 hover:bg-white/10 p-3 md:p-4 rounded-full transition-all z-[10000] cursor-pointer backdrop-blur-sm"
                            aria-label="Anterior"
                        >
                            <FaChevronLeft size={24} />
                        </button>

                        <div
                            className="w-full h-full p-2 md:p-10 flex flex-col items-center justify-center relative z-[9999]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {allMedia[photoIndex].type === 'video' ? (
                                <video
                                    src={allMedia[photoIndex].url}
                                    className="max-w-full max-h-[80vh] md:max-h-[85vh] rounded-lg shadow-2xl outline-none bg-black"
                                    controls
                                    autoPlay
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={allMedia[photoIndex].url}
                                    alt="Full view"
                                    className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                                    draggable={false}
                                />
                            )}

                            <div className="absolute bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 text-white/90 text-xs font-bold bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 select-none">
                                {photoIndex + 1} / {allMedia.length}
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextSrc();
                            }}
                            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/20 hover:bg-white/10 p-3 md:p-4 rounded-full transition-all z-[10000] cursor-pointer backdrop-blur-sm"
                            aria-label="Siguiente"
                        >
                            <FaChevronRight size={24} />
                        </button>
                    </div>,
                    document.body
                )}
        </>
    );
};
