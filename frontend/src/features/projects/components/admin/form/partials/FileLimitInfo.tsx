import { FaInfoCircle } from 'react-icons/fa';

export const MAX_IMG_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_MB = 100;

export const ALLOWED_IMG_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
export const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'webm'];

export const VALID_IMG_TYPES = ALLOWED_IMG_EXTENSIONS.map(
    (ext) => `image/${ext === 'jpg' ? 'jpeg' : ext}`
).join(',');

export const VALID_VIDEO_TYPES =
    'video/mp4,video/quicktime,video/x-msvideo,video/webm';

export const FileLimitInfo = ({ type }: { type: 'image' | 'video' }) => {
    const isImg = type === 'image';
    const extensions = isImg
        ? ALLOWED_IMG_EXTENSIONS
        : ALLOWED_VIDEO_EXTENSIONS;
    const maxSize = isImg ? MAX_IMG_SIZE_MB : MAX_VIDEO_SIZE_MB;

    return (
        <div className="mt-3 p-3 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start gap-2.5">
            <FaInfoCircle className="text-blue-400 mt-0.5 shrink-0" size={14} />

            <div className="flex flex-col gap-1 text-[11px] text-blue-600/90 leading-relaxed">
                <span className="font-bold text-blue-800 uppercase tracking-wide text-[10px] mb-0.5">
                    Requisitos del Sistema
                </span>

                <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1">
                        • Peso Máximo:{' '}
                        <strong className="text-blue-800 font-semibold">
                            {maxSize}MB
                        </strong>
                    </span>
                    <span className="flex items-start gap-1">
                        • Formatos:
                        <span className="uppercase font-medium text-blue-700 break-words">
                            {extensions.join(', ')}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};
