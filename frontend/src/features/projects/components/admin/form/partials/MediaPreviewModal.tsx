import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface MediaPreviewModalProps {
    file: { type: 'image' | 'video'; url: string } | null;
    onClose: () => void;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
    file,
    onClose,
}) => {
    if (!file) return null;
    return (
        <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-50"
            >
                <FaTimes size={24} />
            </button>
            <div
                className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                {file.type === 'image' ? (
                    <img
                        src={file.url}
                        alt="Preview"
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    />
                ) : (
                    <video
                        src={file.url}
                        controls
                        autoPlay
                        className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                    />
                )}
            </div>
        </div>
    );
};
