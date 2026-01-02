import React, { useState, useEffect, useRef } from 'react';
import {
    FaSave,
    FaCloudUploadAlt,
    FaTrash,
    FaImage,
    FaVideo,
    FaInfoCircle,
    FaPen,
    FaBuilding,
    FaMapMarkerAlt,
    FaRulerCombined,
    FaLayerGroup,
    FaStar,
    FaExchangeAlt,
    FaCheckCircle,
    FaFileVideo,
} from 'react-icons/fa';
import { Project, ProjectImage, ProjectVideo } from '@/types';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchCategories } from '@store/slices/categorySlice';
import {
    updateProjectImage,
} from '@store/slices/projectSlice';
import toast from 'react-hot-toast';
import { ConfirmModal } from '@components/ui/ConfirmModal';

interface ProjectFormProps {
    initialData?: Project | null;
    onSubmit: (formData: FormData) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
    initialData,
    onSubmit,
    isLoading,
    onCancel,
}) => {
    const dispatch = useAppDispatch();
    const { categories } = useAppSelector((state) => state.categories);

    // --- Estados del Formulario ---
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<number | string>('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState<'In Progress' | 'Delivered'>(
        'Delivered'
    );
    const [extraInfo, setExtraInfo] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);

    // Campos opcionales
    const [serviceType, setServiceType] = useState('');
    const [levels, setLevels] = useState('');
    const [area, setArea] = useState('');

    // --- Archivos EXISTENTES (Servidor) ---
    const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
    const [existingVideos, setExistingVideos] = useState<ProjectVideo[]>([]);

    // --- Listas de ELIMINACIÓN DIFERIDA ---
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [videosToDelete, setVideosToDelete] = useState<number[]>([]);

    // --- Archivos NUEVOS (Local) ---
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [newVideos, setNewVideos] = useState<File[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

    // --- UI State ---
    const [isDragActiveImg, setIsDragActiveImg] = useState(false);
    const [isDragActiveVid, setIsDragActiveVid] = useState(false);

    const [itemToDelete, setItemToDelete] = useState<{
        type: 'image' | 'video';
        id: number;
    } | null>(null);
    const [imgToReplaceId, setImgToReplaceId] = useState<number | null>(null);
    const [newFileToReplace, setNewFileToReplace] = useState<{
        index: number;
        type: 'image' | 'video';
    } | null>(null);

    // --- Referencias ---
    const imgInputRef = useRef<HTMLInputElement>(null);
    const vidInputRef = useRef<HTMLInputElement>(null);
    const replaceServerImgRef = useRef<HTMLInputElement>(null);
    const replaceNewFileRef = useRef<HTMLInputElement>(null);

    // Cargar datos
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCategoryId(initialData.category);
            setLocation(initialData.location);
            setStatus(initialData.status);
            setExtraInfo(initialData.extra_info || '');
            setIsFeatured(initialData.is_featured);
            setServiceType(initialData.service_type || '');
            setLevels(initialData.levels || '');
            setArea(initialData.area || '');
            setExistingImages(initialData.images || []);
            setExistingVideos(initialData.videos || []);

            setImagesToDelete([]);
            setVideosToDelete([]);
        }
    }, [initialData]);

    const blockInvalidChar = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
    };

    // --- HELPER: Obtener nombre de archivo desde URL ---
    const getFileName = (url: string) => {
        try {
            // Decodifica la URL (elimina %20, etc) y obtiene la última parte después de /
            return decodeURIComponent(
                url.split('/').pop() || 'Video sin nombre'
            );
        } catch (e) {
            return 'Video';
        }
    };

    // --- LÓGICA: ELIMINAR DIFERIDA ---
    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'image') {
            setImagesToDelete((prev) => [...prev, itemToDelete.id]);
            setExistingImages((prev) =>
                prev.filter((img) => img.id !== itemToDelete.id)
            );
            toast.success('Imagen marcada para eliminar');
        } else {
            setVideosToDelete((prev) => [...prev, itemToDelete.id]);
            setExistingVideos((prev) =>
                prev.filter((vid) => vid.id !== itemToDelete.id)
            );
            toast.success('Video marcado para eliminar');
        }
        setItemToDelete(null);
    };

    // --- LÓGICA: REEMPLAZAR (SERVIDOR) ---
    const handleReplaceServerClick = (id: number) => {
        setImgToReplaceId(id);
        replaceServerImgRef.current?.click();
    };

    const handleReplaceServerChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file && imgToReplaceId) {
            const toastId = toast.loading('Actualizando imagen...');
            const result = await dispatch(
                updateProjectImage({ id: imgToReplaceId, file })
            );

            if (updateProjectImage.fulfilled.match(result)) {
                const updatedObj = result.payload as ProjectImage;
                setExistingImages((prev) =>
                    prev.map((img) =>
                        img.id === imgToReplaceId ? updatedObj : img
                    )
                );
                toast.success('Imagen actualizada', { id: toastId });
            } else {
                toast.error('Error al actualizar', { id: toastId });
            }
        }
        if (replaceServerImgRef.current) replaceServerImgRef.current.value = '';
        setImgToReplaceId(null);
    };

    // --- GESTIÓN ARCHIVOS NUEVOS ---
    const processFiles = (files: FileList, type: 'image' | 'video') => {
        const validFiles: File[] = [];
        const validPreviews: string[] = [];
        Array.from(files).forEach((file) => {
            if (file.type.startsWith(`${type}/`)) {
                validFiles.push(file);
                validPreviews.push(URL.createObjectURL(file));
            }
        });
        if (type === 'image') {
            setNewImages((prev) => [...prev, ...validFiles]);
            setImagePreviews((prev) => [...prev, ...validPreviews]);
        } else {
            setNewVideos((prev) => [...prev, ...validFiles]);
            setVideoPreviews((prev) => [...prev, ...validPreviews]);
        }
    };

    const handleDrop = (e: React.DragEvent, type: 'image' | 'video') => {
        e.preventDefault();
        e.stopPropagation();
        type === 'image'
            ? setIsDragActiveImg(false)
            : setIsDragActiveVid(false);
        if (e.dataTransfer.files?.length)
            processFiles(e.dataTransfer.files, type);
    };

    const removeNewFile = (index: number, type: 'image' | 'video') => {
        if (type === 'image') {
            setNewImages((prev) => prev.filter((_, i) => i !== index));
            setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        } else {
            setNewVideos((prev) => prev.filter((_, i) => i !== index));
            setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleReplaceNewClick = (index: number, type: 'image' | 'video') => {
        setNewFileToReplace({ index, type });
        replaceNewFileRef.current?.click();
    };

    const handleReplaceNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && newFileToReplace) {
            const { index, type } = newFileToReplace;
            const newPreview = URL.createObjectURL(file);
            if (type === 'image') {
                const updatedFiles = [...newImages];
                updatedFiles[index] = file;
                setNewImages(updatedFiles);
                const updatedPreviews = [...imagePreviews];
                updatedPreviews[index] = newPreview;
                setImagePreviews(updatedPreviews);
            } else {
                const updatedFiles = [...newVideos];
                updatedFiles[index] = file;
                setNewVideos(updatedFiles);
                const updatedPreviews = [...videoPreviews];
                updatedPreviews[index] = newPreview;
                setVideoPreviews(updatedPreviews);
            }
            toast.success('Archivo reemplazado');
        }
        if (replaceNewFileRef.current) replaceNewFileRef.current.value = '';
        setNewFileToReplace(null);
    };

    // --- SUBMIT ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('name', name);
        formData.append('category', String(categoryId));
        formData.append('location', location);
        formData.append('status', status);
        formData.append('is_featured', isFeatured ? 'true' : 'false');

        if (extraInfo) formData.append('extra_info', extraInfo);
        if (serviceType) formData.append('service_type', serviceType);
        if (levels) formData.append('levels', levels.toString());
        if (area) formData.append('area', area.toString());

        newImages.forEach((img) => formData.append('uploaded_images', img));
        newVideos.forEach((vid) => formData.append('uploaded_videos', vid));

        imagesToDelete.forEach((id) =>
            formData.append('deleted_images', id.toString())
        );
        videosToDelete.forEach((id) =>
            formData.append('deleted_videos', id.toString())
        );

        onSubmit(formData);
    };

    const inputClass =
        'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400';
    const labelClass =
        'block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1';

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
            <input
                type="file"
                ref={replaceServerImgRef}
                className="hidden"
                accept="image/*"
                onChange={handleReplaceServerChange}
            />
            <input
                type="file"
                ref={replaceNewFileRef}
                className="hidden"
                accept={
                    newFileToReplace?.type === 'image' ? 'image/*' : 'video/*'
                }
                onChange={handleReplaceNewChange}
            />

            <div className="p-8 space-y-8">
                {/* 1. INFO GENERAL */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <FaPen className="text-brand-500" size={14} />
                            <h3 className="text-lg font-bold text-slate-800">
                                Información General
                            </h3>
                        </div>
                        {initialData && (
                            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100 uppercase tracking-wide">
                                Modo Edición
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group md:col-span-2">
                            <label className={labelClass}>
                                Nombre del Proyecto{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej: Residencial Los Álamos"
                                className={inputClass}
                                required
                            />
                        </div>
                        <div className="group">
                            <label className={labelClass}>
                                Categoría{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={categoryId}
                                    onChange={(e) =>
                                        setCategoryId(e.target.value)
                                    }
                                    className={`${inputClass} pl-10 appearance-none`}
                                    required
                                >
                                    <option value="">
                                        Seleccionar Categoría...
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="group">
                            <label className={labelClass}>
                                Estado <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as any)
                                }
                                className={inputClass}
                            >
                                <option value="Delivered">Entregado</option>
                                <option value="In Progress">
                                    En Ejecución
                                </option>
                            </select>
                        </div>
                        <div className="group">
                            <label className={labelClass}>
                                Ubicación{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    placeholder="Ej: Arequipa, Perú"
                                    className={`${inputClass} pl-10`}
                                    required
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className={labelClass}>Área (m²)</label>
                            <div className="relative">
                                <FaRulerCombined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    onKeyDown={blockInvalidChar}
                                    placeholder="Ej: 120"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className={labelClass}>Niveles</label>
                            <div className="relative">
                                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="0"
                                    value={levels}
                                    onChange={(e) => setLevels(e.target.value)}
                                    onKeyDown={blockInvalidChar}
                                    placeholder="Ej: 2"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className={labelClass}>Edificación</label>
                            <input
                                type="text"
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                                placeholder="Ej: Residencial"
                                className={inputClass}
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className={labelClass}>Descripción</label>
                        <textarea
                            value={extraInfo}
                            onChange={(e) => setExtraInfo(e.target.value)}
                            rows={4}
                            className={`${inputClass} resize-none`}
                            placeholder="Detalles adicionales..."
                        />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div
                            className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${isFeatured ? 'bg-orange-500' : 'bg-slate-300'}`}
                            onClick={() => setIsFeatured(!isFeatured)}
                        >
                            <div
                                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`}
                            ></div>
                        </div>
                        <label
                            className="text-sm font-bold text-slate-700 cursor-pointer flex items-center gap-2"
                            onClick={() => setIsFeatured(!isFeatured)}
                        >
                            <FaStar
                                className={
                                    isFeatured
                                        ? 'text-orange-500'
                                        : 'text-slate-400'
                                }
                            />{' '}
                            Destacar en Inicio
                        </label>
                    </div>
                </div>

                {/* 2. IMÁGENES */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 pb-2">
                        <FaImage className="text-brand-500" size={14} />
                        <h3 className="text-lg font-bold text-slate-800">
                            Galería de Imágenes
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-4">
                            <div
                                className={`relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group bg-slate-50 ${isDragActiveImg ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-500/20' : 'border-slate-300 hover:border-brand-400 hover:bg-white'}`}
                                onDragEnter={(e) => {
                                    e.preventDefault();
                                    setIsDragActiveImg(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    setIsDragActiveImg(false);
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragActiveImg(true);
                                }}
                                onDrop={(e) => handleDrop(e, 'image')}
                                onClick={() => imgInputRef.current?.click()}
                            >
                                <input
                                    ref={imgInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        e.target.files &&
                                        processFiles(e.target.files, 'image')
                                    }
                                />
                                <div className="text-center p-6">
                                    <div
                                        className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-colors ${isDragActiveImg ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500'}`}
                                    >
                                        <FaCloudUploadAlt className="text-2xl" />
                                    </div>
                                    <p className="font-bold text-slate-700 text-xs">
                                        Subir Imágenes
                                    </p>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start">
                                <FaInfoCircle
                                    className="text-blue-500 mt-0.5 shrink-0"
                                    size={14}
                                />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Formatos: JPG, PNG. Se recomienda 4:3.
                                </p>
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            {imagePreviews.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                                        <FaCheckCircle /> Nuevas (
                                        {imagePreviews.length})
                                    </p>
                                    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                                        {imagePreviews.map((src, idx) => (
                                            <div
                                                key={idx}
                                                className="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden border-2 border-green-400 group bg-slate-100 shadow-sm"
                                            >
                                                <img
                                                    src={src}
                                                    className="w-full h-full object-cover"
                                                    alt="New"
                                                />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReplaceNewClick(
                                                                idx,
                                                                'image'
                                                            )
                                                        }
                                                        className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 shadow-lg"
                                                    >
                                                        <FaExchangeAlt
                                                            size={14}
                                                        />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeNewFile(
                                                                idx,
                                                                'image'
                                                            )
                                                        }
                                                        className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 shadow-lg"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {existingImages.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400">
                                        Guardadas en el servidor:
                                    </p>
                                    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                                        {existingImages.map((img) => (
                                            <div
                                                key={img.id}
                                                className="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden border border-slate-200 group bg-slate-100"
                                            >
                                                <img
                                                    src={img.image}
                                                    className="w-full h-full object-cover"
                                                    alt="Server"
                                                />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReplaceServerClick(
                                                                img.id
                                                            )
                                                        }
                                                        className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 shadow-lg"
                                                    >
                                                        <FaExchangeAlt
                                                            size={14}
                                                        />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setItemToDelete({
                                                                type: 'image',
                                                                id: img.id,
                                                            })
                                                        }
                                                        className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 shadow-lg"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. VIDEOS */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 pb-2">
                        <FaVideo className="text-blue-500" size={14} />
                        <h3 className="text-lg font-bold text-slate-800">
                            Videos
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-4">
                            <div
                                className={`relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group bg-slate-50 ${isDragActiveVid ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/20' : 'border-slate-300 hover:border-blue-400 hover:bg-white'}`}
                                onDragEnter={(e) => {
                                    e.preventDefault();
                                    setIsDragActiveVid(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    setIsDragActiveVid(false);
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragActiveVid(true);
                                }}
                                onDrop={(e) => handleDrop(e, 'video')}
                                onClick={() => vidInputRef.current?.click()}
                            >
                                <input
                                    ref={vidInputRef}
                                    type="file"
                                    multiple
                                    accept="video/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        e.target.files &&
                                        processFiles(e.target.files, 'video')
                                    }
                                />
                                <div className="text-center p-6">
                                    <div
                                        className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-colors ${isDragActiveVid ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}
                                    >
                                        <FaCloudUploadAlt className="text-2xl" />
                                    </div>
                                    <p className="font-bold text-slate-700 text-xs">
                                        Subir Videos
                                    </p>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start">
                                <FaInfoCircle
                                    className="text-blue-500 mt-0.5 shrink-0"
                                    size={14}
                                />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Formatos: MP4, AVI. Máx: 50MB.
                                </p>
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            {videoPreviews.length > 0 && (
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                                        <FaCheckCircle /> Nuevos (
                                        {videoPreviews.length})
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {videoPreviews.map((src, idx) => (
                                            <div
                                                key={idx}
                                                className="relative group bg-slate-50 border-2 border-green-400 rounded-xl overflow-hidden shadow-sm"
                                            >
                                                <div className="aspect-video bg-black relative">
                                                    <video
                                                        src={src}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="p-2 flex items-center justify-between bg-white border-t border-slate-100">
                                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                                                        Nuevo
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleReplaceNewClick(
                                                                    idx,
                                                                    'video'
                                                                )
                                                            }
                                                            className="text-blue-400 hover:text-blue-600"
                                                        >
                                                            <FaExchangeAlt
                                                                size={14}
                                                            />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeNewFile(
                                                                    idx,
                                                                    'video'
                                                                )
                                                            }
                                                            className="text-red-400 hover:text-red-600"
                                                        >
                                                            <FaTrash
                                                                size={14}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* VIDEOS SERVIDOR ACTUALIZADOS */}
                            {existingVideos.length > 0 && (
                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-slate-400">
                                        Guardados en el servidor:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {existingVideos.map((vid) => (
                                            <div
                                                key={vid.id}
                                                className="relative group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                                            >
                                                <div className="aspect-video bg-black">
                                                    <video
                                                        src={vid.video}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="p-3 flex items-center justify-between bg-white border-t border-slate-100">
                                                    {/* NOMBRE DEL ARCHIVO EN LUGAR DEL ID */}
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <FaFileVideo className="text-slate-400 shrink-0" />
                                                        <span
                                                            className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate"
                                                            title={getFileName(
                                                                vid.video
                                                            )}
                                                        >
                                                            {getFileName(
                                                                vid.video
                                                            )}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setItemToDelete({
                                                                type: 'video',
                                                                id: vid.id,
                                                            })
                                                        }
                                                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                                                        title="Eliminar del servidor"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 hover:text-slate-800 transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all disabled:opacity-70"
                >
                    {isLoading ? (
                        'Guardando...'
                    ) : (
                        <>
                            <FaSave />{' '}
                            {initialData ? 'Guardar Cambios' : 'Crear Proyecto'}
                        </>
                    )}
                </button>
            </div>

            <ConfirmModal
                isOpen={!!itemToDelete}
                title={`¿Eliminar ${itemToDelete?.type === 'image' ? 'imagen' : 'video'}?`}
                message="El archivo se eliminará al guardar los cambios."
                confirmText="Marcar para eliminar"
                isDestructive={true}
                onConfirm={confirmDelete}
                onCancel={() => setItemToDelete(null)}
            />
        </form>
    );
};
