import React, { useEffect, useState, useRef } from 'react';
import {
    FaSave,
    FaHistory,
    FaBullseye,
    FaEye,
    FaImage,
    FaCloudUploadAlt,
    FaTrash,
    FaUndo,
    FaCheckCircle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    fetchAboutUs,
    updateAboutUs,
} from '@store/slices/companySlice';

const AboutSettings: React.FC = () => {
    const dispatch = useAppDispatch();
    const { aboutUs, loading } = useAppSelector((state) => state.company);

    const [description, setDescription] = useState('');
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');

    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isImageDeleted, setIsImageDeleted] = useState(false);

    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dispatch(fetchAboutUs());
    }, [dispatch]);

    useEffect(() => {
        if (aboutUs) {
            setDescription(aboutUs.description || '');
            setMission(aboutUs.mission || '');
            setVision(aboutUs.vision || '');

            if (aboutUs.image) {
                setPreviewUrl(aboutUs.image);
                setIsImageDeleted(false);
            }
        }
    }, [aboutUs]);

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Solo archivos de imagen');
            return;
        }
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setIsImageDeleted(false);
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
        if (e.dataTransfer.files && e.dataTransfer.files[0])
            processFile(e.dataTransfer.files[0]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImage(null);
        setPreviewUrl('');
        setIsImageDeleted(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const restoreOriginal = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (aboutUs?.image) {
            setPreviewUrl(aboutUs.image);
            setSelectedImage(null);
            setIsImageDeleted(false);

            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('description', description);
        formData.append('mission', mission);
        formData.append('vision', vision);

        if (selectedImage) {
            formData.append('image', selectedImage);
        } else if (isImageDeleted) {
            formData.append('image', '');
        }

        const result = await dispatch(updateAboutUs(formData));

        if (updateAboutUs.fulfilled.match(result)) {
            toast.success('Información "Nosotros" actualizada');
            dispatch(fetchAboutUs());
        } else {
            toast.error('Error al guardar cambios');
        }
    };

    if (loading && !aboutUs)
        return (
            <div className="p-10 text-center text-slate-500">
                Cargando información...
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up pb-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/20">
                    <FaHistory size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Nosotros
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Gestiona la historia, misión y visión de la empresa.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FaHistory size={14} />
                            </span>
                            <h3 className="font-bold text-slate-800">
                                Reseña Histórica / Descripción
                            </h3>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Ej: Somos una empresa constructora con 10 años de experiencia..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none text-slate-700 leading-relaxed"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 grid gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <FaBullseye size={14} />
                                </span>
                                <h3 className="font-bold text-slate-800">
                                    Misión
                                </h3>
                            </div>
                            <textarea
                                value={mission}
                                onChange={(e) => setMission(e.target.value)}
                                rows={3}
                                placeholder="Nuestro propósito es..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none text-slate-700 leading-relaxed"
                            />
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <FaEye size={14} />
                                </span>
                                <h3 className="font-bold text-slate-800">
                                    Visión
                                </h3>
                            </div>
                            <textarea
                                value={vision}
                                onChange={(e) => setVision(e.target.value)}
                                rows={3}
                                placeholder="Queremos ser reconocidos como..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none text-slate-700 leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <FaImage className="text-brand-500" /> Imagen
                            Principal
                        </h3>

                        <div
                            className={`
                                relative aspect-[3/4] w-full rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group
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
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileInput}
                            />

                            {previewUrl ? (
                                <>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaCloudUploadAlt className="text-white text-3xl mb-2" />
                                        <span className="text-white font-bold text-sm">
                                            Cambiar Imagen
                                        </span>
                                    </div>

                                    {selectedImage && (
                                        <div className="absolute bottom-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                            <FaCheckCircle /> NUEVA
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all z-20 shadow-md"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    {isImageDeleted && aboutUs?.image ? (
                                        <>
                                            <p className="text-red-500 font-bold text-sm mb-2">
                                                Imagen eliminada
                                            </p>
                                            <button
                                                type="button"
                                                onClick={restoreOriginal}
                                                className="text-xs flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-full mx-auto font-bold"
                                            >
                                                <FaUndo /> Restaurar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                                <FaImage size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-600">
                                                Subir foto
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Arrastra o clic aquí
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-slate-400 mt-3 text-center leading-tight">
                            Esta imagen acompañará la sección de presentación en
                            la página web.
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-600 text-white font-bold shadow-xl shadow-brand-600/20 hover:bg-brand-700 active:scale-95 transition-all disabled:opacity-70"
                        >
                            {loading ? (
                                'Guardando...'
                            ) : (
                                <>
                                    <FaSave /> Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AboutSettings;
