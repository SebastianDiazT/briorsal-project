export const MAX_IMG_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_MB = 100;
export const VALID_IMG_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
];
export const VALID_VIDEO_TYPES = [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
];

export const FileLimitInfo = ({ type }: { type: 'image' | 'video' }) => (
    <div className="text-[10px] text-slate-400 mt-2 flex flex-col gap-0.5 bg-slate-50 p-2 rounded border border-slate-100">
        <span className="font-bold">Requisitos del sistema:</span>
        <span>
            • Máximo: {type === 'image' ? MAX_IMG_SIZE_MB : MAX_VIDEO_SIZE_MB}MB
        </span>
        <span>
            • Formatos: {type === 'image' ? 'JPG, PNG, WEBP' : 'MP4, MOV, AVI'}
        </span>
    </div>
);
