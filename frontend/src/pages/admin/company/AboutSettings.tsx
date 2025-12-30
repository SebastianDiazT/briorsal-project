import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    FaBookOpen,
    FaInfoCircle,
    FaExternalLinkAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAboutUs, updateAboutUs } from '@store/slices/companySlice';
import PageMeta from '@components/common/PageMeta';

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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400 font-medium animate-pulse">
                    Cargando información...
                </div>
            </div>
        );

    return (
        <>
            <PageMeta
                title="GESTIÓN NOSOTROS"
                description="Edita la historia, misión y visión de la empresa."
            />

            <div className="w-full animate-fade-in-up pb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-white text-brand-600 flex items-center justify-center border border-brand-100 shadow-sm shadow-brand-100/50">
                            <FaBookOpen size={28} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                Identidad Corporativa
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Define la historia, misión y visión que verán
                                tus clientes.
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 relative z-10">
                        <Link
                            to="/about"
                            target="_blank"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-xl font-bold hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 transition-all text-sm group shadow-sm"
                        >
                            <FaExternalLinkAlt
                                size={12}
                                className="group-hover:scale-110 transition-transform"
                            />
                            Ver en Web
                        </Link>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                    <FaHistory size={14} />
                                </span>
                                <h3 className="font-bold text-slate-800 text-lg">
                                    Reseña Histórica / Descripción
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={5}
                                    placeholder="Ej: Somos una empresa constructora con 10 años de experiencia, fundada con el objetivo de..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none text-slate-700 leading-relaxed placeholder-slate-400"
                                />
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                        {description.length} caracteres
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
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
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none text-slate-700 leading-relaxed placeholder-slate-400"
                                />
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
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
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all resize-none text-slate-700 leading-relaxed placeholder-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <FaImage className="text-brand-500" /> Imagen
                                Principal
                            </h3>

                            <div
                                className={`
                                    relative aspect-[4/3] w-full rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group bg-slate-50
                                    ${isDragActive ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-500/20' : 'border-slate-300 hover:border-brand-400 hover:bg-white'}
                                    ${previewUrl && !isDragActive ? 'border-solid border-slate-200 bg-white' : ''}
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

                                        <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm">
                                            <FaCloudUploadAlt className="text-white text-3xl mb-2" />
                                            <span className="text-white font-bold text-sm">
                                                Cambiar Imagen
                                            </span>
                                            <span className="text-white/70 text-xs mt-1">
                                                Click o arrastrar
                                            </span>
                                        </div>

                                        {selectedImage && (
                                            <div className="absolute top-3 left-3 z-20 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-green-500/30">
                                                <FaCheckCircle /> NUEVA
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 p-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all z-20 shadow-lg border border-slate-100"
                                            title="Eliminar imagen"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-6 w-full flex flex-col items-center justify-center">
                                        {isImageDeleted && aboutUs?.image ? (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-3">
                                                    <FaTrash />
                                                </div>
                                                <p className="text-red-500 font-bold text-sm mb-4">
                                                    Imagen eliminada
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={restoreOriginal}
                                                    className="text-xs flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-full font-bold shadow-sm w-full max-w-[160px] transition-all"
                                                >
                                                    <FaUndo size={10} />{' '}
                                                    Restaurar Original
                                                </button>
                                                <p className="text-slate-400 text-xs mt-3">
                                                    o sube una nueva
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${isDragActive ? 'bg-brand-100 text-brand-600 scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500'}`}
                                                >
                                                    <FaImage size={28} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700 mb-1">
                                                    {isDragActive
                                                        ? '¡Suelta aquí!'
                                                        : 'Subir foto'}
                                                </p>
                                                <p className="text-xs text-slate-400 px-4 leading-relaxed">
                                                    Arrastra o clic para buscar
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start">
                                <FaInfoCircle
                                    className="text-blue-500 mt-0.5 shrink-0"
                                    size={14}
                                />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Esta imagen se mostrará junto a la
                                    descripción en la página web.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-600 text-white font-bold shadow-xl shadow-brand-600/20 hover:bg-brand-700 hover:shadow-brand-600/30 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Guardando...
                                    </>
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
        </>
    );
};

export default AboutSettings;
