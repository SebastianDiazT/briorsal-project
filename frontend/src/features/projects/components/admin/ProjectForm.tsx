import React, { useState, useEffect, useRef } from 'react';
import {
    FaSave,
    FaCloudUploadAlt,
    FaTrash,
    FaImage,
    FaVideo,
    FaPen,
    FaRulerCombined,
    FaLayerGroup,
    FaStar,
    FaExchangeAlt,
    FaCheckCircle,
    FaFileVideo,
    FaBuilding,
    FaCalendarAlt,
    FaPlus,
    FaTimes,
    FaExclamationCircle,
    FaListUl,
    FaGlobeAmericas,
    FaInfoCircle,
    FaExpand,
    FaPlay,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import { Project, ProjectImage, ProjectVideo } from '@/features/projects/types';
import { useUpdateProjectImageMutation } from '@/features/projects/api/projectsApi';
import { useGetCategoriesQuery } from '@/features/categories/api/categoriesApi';
import { ConfirmModal } from '@components/ui/ConfirmModal';
import { CustomSelect } from '@components/ui/CustomSelect';

interface ProjectFormProps {
    initialData?: Project | null;
    onSubmit: (formData: FormData) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

interface AttributeRow {
    key: string;
    value: string;
}
type TabType = 'general' | 'details' | 'media';

const FieldError = ({ msg }: { msg?: string }) => {
    if (!msg) return null;
    return (
        <div className="flex items-center gap-2 mt-2 text-red-500 text-xs font-bold animate-fade-in bg-red-50 p-2 rounded-lg border border-red-100">
            <FaExclamationCircle className="shrink-0 text-red-600" />
            <span>{msg}</span>
        </div>
    );
};

const MediaPreviewModal = ({
    file,
    onClose,
}: {
    file: { type: 'image' | 'video'; url: string } | null;
    onClose: () => void;
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

export const ProjectForm: React.FC<ProjectFormProps> = ({
    initialData,
    onSubmit,
    isLoading,
    onCancel,
}) => {
    const { data: categoriesResponse } = useGetCategoriesQuery({
        no_page: true,
    });
    const categories = categoriesResponse?.data || [];
    const [updateProjectImage] = useUpdateProjectImageMutation();

    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [name, setName] = useState('');
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [description, setDescription] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    const [isDragOverCover, setIsDragOverCover] = useState(false);

    const [serviceType, setServiceType] = useState('');
    const [levels, setLevels] = useState('');
    const [area, setArea] = useState('');
    const [attributes, setAttributes] = useState<AttributeRow[]>([
        { key: '', value: '' },
    ]);

    const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
    const [existingVideos, setExistingVideos] = useState<ProjectVideo[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [videosToDelete, setVideosToDelete] = useState<number[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [newVideos, setNewVideos] = useState<File[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

    const [isDragActiveImg, setIsDragActiveImg] = useState(false);
    const [isDragActiveVid, setIsDragActiveVid] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{
        type: 'image' | 'video';
        id: number;
    } | null>(null);
    const [previewMedia, setPreviewMedia] = useState<{
        type: 'image' | 'video';
        url: string;
    } | null>(null);
    const [imgToReplaceId, setImgToReplaceId] = useState<number | null>(null);
    const [newFileToReplace, setNewFileToReplace] = useState<{
        index: number;
        type: 'image' | 'video';
    } | null>(null);

    const imgInputRef = useRef<HTMLInputElement>(null);
    const vidInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const replaceServerImgRef = useRef<HTMLInputElement>(null);
    const replaceNewFileRef = useRef<HTMLInputElement>(null);

    const statusOptions = [
        { value: 'en_proceso', label: 'En Ejecución' },
        { value: 'entregado', label: 'Entregado' },
    ];

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCategoryIds(
                initialData.categories?.map((c: any) => String(c.id || c)) || []
            );
            setLocation(initialData.location);
            setStatus(initialData.status || '');
            setDescription(initialData.description || '');
            setYear(initialData.year ? String(initialData.year) : '');
            setIsFeatured(initialData.is_featured);
            setServiceType(initialData.service_type || '');
            setLevels(initialData.levels || '');
            setArea(initialData.area || '');
            setCoverPreview(initialData.cover_image || '');

            if (
                initialData.extra_info &&
                typeof initialData.extra_info === 'object'
            ) {
                const rows = Object.entries(initialData.extra_info).map(
                    ([key, value]) => ({
                        key,
                        value: String(value),
                    })
                );
                if (rows.length > 0) setAttributes(rows);
            }
            setExistingImages(initialData.images || []);
            setExistingVideos(initialData.videos || []);
        }
    }, [initialData]);

    const processCoverFile = (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor sube un archivo de imagen válido.');
            return;
        }
        setCoverImage(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        processCoverFile(file);
    };

    const handleCoverDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOverCover(false);
        const file = e.dataTransfer.files?.[0];
        processCoverFile(file);
    };

    const toggleCategory = (id: string) => {
        setCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
        if (errors.category_ids)
            setErrors((prev) => ({ ...prev, category_ids: '' }));
    };

    const removeNewFile = (idx: number, type: 'image' | 'video') => {
        if (type === 'image') {
            setNewImages((p) => p.filter((_, i) => i !== idx));
            setImagePreviews((p) => p.filter((_, i) => i !== idx));
        } else {
            setNewVideos((p) => p.filter((_, i) => i !== idx));
            setVideoPreviews((p) => p.filter((_, i) => i !== idx));
        }
    };

    const handleReplaceNewClick = (index: number, type: 'image' | 'video') => {
        setNewFileToReplace({ index, type });
        setTimeout(() => replaceNewFileRef.current?.click(), 100);
    };

    const handleReplaceNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && newFileToReplace) {
            const { index, type } = newFileToReplace;
            const preview = URL.createObjectURL(file);
            if (type === 'image') {
                const files = [...newImages];
                files[index] = file;
                setNewImages(files);
                const previews = [...imagePreviews];
                previews[index] = preview;
                setImagePreviews(previews);
            } else {
                const files = [...newVideos];
                files[index] = file;
                setNewVideos(files);
                const previews = [...videoPreviews];
                previews[index] = preview;
                setVideoPreviews(previews);
            }
        }
        setNewFileToReplace(null);
    };

    const handleReplaceServerClick = (id: number) => {
        setImgToReplaceId(id);
        setTimeout(() => replaceServerImgRef.current?.click(), 100);
    };

    const handleReplaceServerChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file && imgToReplaceId) {
            const toastId = toast.loading('Actualizando...');
            try {
                const result = await updateProjectImage({
                    id: imgToReplaceId,
                    file,
                }).unwrap();
                setExistingImages((p) =>
                    p.map((img) => (img.id === imgToReplaceId ? result : img))
                );
                toast.success('Actualizado con éxito', { id: toastId });
            } catch {
                toast.error('Error al actualizar', { id: toastId });
            }
        }
        setImgToReplaceId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateClientSide()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('location', location);
        formData.append('status', status);
        formData.append('is_featured', String(isFeatured));
        formData.append('description', description);
        formData.append('service_type', serviceType);
        formData.append('levels', levels);
        formData.append('area', area);
        formData.append('year', year);

        categoryIds.forEach((id) => formData.append('category_ids', id));
        if (coverImage) formData.append('cover_image', coverImage);

        const extraInfoObj = attributes.reduce(
            (acc, curr) => {
                if (curr.key.trim()) acc[curr.key.trim()] = curr.value.trim();
                return acc;
            },
            {} as Record<string, string>
        );
        formData.append('extra_info', JSON.stringify(extraInfoObj));

        newImages.forEach((img) => formData.append('uploaded_images', img));
        newVideos.forEach((vid) => formData.append('uploaded_videos', vid));
        imagesToDelete.forEach((id) =>
            formData.append('delete_images', id.toString())
        );
        videosToDelete.forEach((id) =>
            formData.append('delete_videos', id.toString())
        );

        try {
            await onSubmit(formData);
        } catch (err: any) {
            parseBackendErrors(err);
        }
    };

    const validateClientSide = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
        if (categoryIds.length === 0)
            newErrors.category_ids = 'Selecciona al menos una categoría.';
        if (!location.trim()) newErrors.location = 'La ubicación es requerida.';
        if (!status) newErrors.status = 'El estado es obligatorio.';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setActiveTab('general');
            return false;
        }
        return true;
    };

    const parseBackendErrors = (err: any) => {
        if (err?.data?.errors) {
            const apiErrors = err.data.errors;
            const newErrors: Record<string, string> = {};
            Object.keys(apiErrors).forEach((key) => {
                newErrors[key] = Array.isArray(apiErrors[key])
                    ? apiErrors[key][0]
                    : String(apiErrors[key]);
            });
            setErrors(newErrors);
            toast.error(err.data.message || 'Error al guardar el proyecto');
        }
    };

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
            setNewImages((p) => [...p, ...validFiles]);
            setImagePreviews((p) => [...p, ...validPreviews]);
        } else {
            setNewVideos((p) => [...p, ...validFiles]);
            setVideoPreviews((p) => [...p, ...validPreviews]);
        }
    };

    const handleDrop = (e: React.DragEvent, type: 'image' | 'video') => {
        e.preventDefault();
        type === 'image'
            ? setIsDragActiveImg(false)
            : setIsDragActiveVid(false);
        if (e.dataTransfer.files?.length)
            processFiles(e.dataTransfer.files, type);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'image') {
            setImagesToDelete((p) => [...p, itemToDelete.id]);
            setExistingImages((p) =>
                p.filter((img) => img.id !== itemToDelete.id)
            );
        } else {
            setVideosToDelete((p) => [...p, itemToDelete.id]);
            setExistingVideos((p) =>
                p.filter((vid) => vid.id !== itemToDelete.id)
            );
        }
        setItemToDelete(null);
    };

    const getInputClass = (errKey: string) => `
        w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-medium text-slate-700 placeholder-slate-400 text-sm focus:bg-white
        ${errors[errKey] ? 'border-red-300 focus:border-red-500 bg-red-50/30' : 'border-slate-200 focus:border-orange-500'}
    `;

    const labelClass =
        'block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1';

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in-up pb-10">
            {/* Inputs Ocultos */}
            <input
                type="file"
                ref={coverInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleCoverChange}
            />
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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="flex border-b border-slate-100 bg-white sticky top-0 z-20">
                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === 'general' ? 'text-orange-600 bg-orange-50/50' : 'text-slate-500'}`}
                    >
                        <FaPen size={14} />{' '}
                        <span className="hidden sm:inline">Esenciales</span>
                        {activeTab === 'general' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full"></span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === 'details' ? 'text-orange-600 bg-orange-50/50' : 'text-slate-500'}`}
                    >
                        <FaListUl size={14} />{' '}
                        <span className="hidden sm:inline">
                            Detalles Técnicos
                        </span>
                        {activeTab === 'details' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full"></span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('media')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === 'media' ? 'text-orange-600 bg-orange-50/50' : 'text-slate-500'}`}
                    >
                        <FaImage size={14} />{' '}
                        <span className="hidden sm:inline">Multimedia</span>
                        {activeTab === 'media' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full"></span>
                        )}
                    </button>
                </div>

                <div className="p-4 md:p-8">
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* PORTADA CON DRAG & DROP */}
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragOverCover(true);
                                }}
                                onDragLeave={() => setIsDragOverCover(false)}
                                onDrop={handleCoverDrop}
                                className={`flex flex-col md:flex-row gap-6 items-center p-6 rounded-2xl border-2 border-dashed transition-all ${isDragOverCover ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-slate-50'}`}
                            >
                                <div className="relative w-40 h-52 bg-white rounded-xl overflow-hidden border shadow-sm shrink-0">
                                    {coverPreview ? (
                                        <img
                                            src={coverPreview}
                                            className="w-full h-full object-cover"
                                            alt="Portada"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                                            <FaCloudUploadAlt
                                                size={32}
                                                className="mb-2 opacity-50"
                                            />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">
                                                Arrastrar Portada
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3 text-center md:text-left">
                                    <h4 className="font-bold text-slate-800">
                                        Imagen de Portada Principal
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        Imagen destacada del catálogo. Puedes
                                        arrastrar un archivo aquí.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            coverInputRef.current?.click()
                                        }
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                                    >
                                        <FaPlus className="text-orange-500" />{' '}
                                        {coverPreview
                                            ? 'Cambiar Imagen'
                                            : 'Subir Portada'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        Nombre Oficial{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Ej: Residencial Mirador"
                                        className={getInputClass('name')}
                                    />
                                    <FieldError msg={errors.name} />
                                </div>

                                <div className="md:col-span-2">
                                    <label
                                        className={`${labelClass} flex items-center gap-2`}
                                    >
                                        <FaLayerGroup className="text-slate-400" />{' '}
                                        Categorías{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        {categories.map((cat) => {
                                            const isActive =
                                                categoryIds.includes(
                                                    String(cat.id)
                                                );
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleCategory(
                                                            String(cat.id)
                                                        )
                                                    }
                                                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all group ${isActive ? 'bg-orange-500 border-orange-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'}`}
                                                >
                                                    <div
                                                        className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isActive ? 'bg-white border-white text-orange-600' : 'bg-slate-50 border-slate-300 group-hover:border-orange-200'}`}
                                                    >
                                                        {isActive && (
                                                            <FaCheckCircle
                                                                size={12}
                                                            />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-bold truncate">
                                                        {cat.name}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <FieldError msg={errors.category_ids} />
                                </div>

                                <div className="relative z-10">
                                    <label className={labelClass}>
                                        Estado de Obra{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        value={status}
                                        onChange={setStatus}
                                        options={statusOptions}
                                        placeholder="Seleccione..."
                                        icon={FaCheckCircle}
                                    />
                                    <FieldError msg={errors.status} />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Ubicación{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FaGlobeAmericas className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) =>
                                                setLocation(e.target.value)
                                            }
                                            className={`${getInputClass('location')} pl-10`}
                                            placeholder="Ciudad, Distrito"
                                        />
                                    </div>
                                    <FieldError msg={errors.location} />
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        Resumen del Proyecto
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        rows={4}
                                        className={`${getInputClass('')} resize-none`}
                                        placeholder="Describe el concepto arquitectónico..."
                                    />
                                </div>

                                <div className="md:col-span-2 bg-orange-50/50 p-4 rounded-xl flex items-center justify-between border border-orange-100">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${isFeatured ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                                        >
                                            <FaStar />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">
                                                Destacar Proyecto
                                            </h4>
                                            <p className="text-[10px] text-slate-500">
                                                Se mostrará con prioridad en el
                                                inicio.
                                            </p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isFeatured}
                                            onChange={() =>
                                                setIsFeatured(!isFeatured)
                                            }
                                        />
                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full shadow-inner"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className={labelClass}>
                                        Tipología
                                    </label>
                                    <div className="relative">
                                        <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={serviceType}
                                            onChange={(e) =>
                                                setServiceType(e.target.value)
                                            }
                                            placeholder="Ej: Multifamiliar"
                                            className={`${getInputClass('')} pl-10`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Área (m²)
                                    </label>
                                    <div className="relative">
                                        <FaRulerCombined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={area}
                                            onChange={(e) =>
                                                setArea(e.target.value)
                                            }
                                            placeholder="Ej: 500"
                                            className={`${getInputClass('')} pl-10`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Año / Niveles
                                    </label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={year}
                                                onChange={(e) =>
                                                    setYear(e.target.value)
                                                }
                                                placeholder="Año"
                                                className={`${getInputClass('')} pl-10 w-24 shrink-0`}
                                            />
                                            <input
                                                type="text"
                                                value={levels}
                                                onChange={(e) =>
                                                    setLevels(e.target.value)
                                                }
                                                placeholder="Pisos"
                                                className={getInputClass('')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        <FaInfoCircle className="text-slate-400" />{' '}
                                        Ficha Técnica Adicional
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAttributes([
                                                ...attributes,
                                                { key: '', value: '' },
                                            ])
                                        }
                                        className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-slate-700 transition-colors"
                                    >
                                        <FaPlus /> Agregar campo
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {attributes.map((attr, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-fade-in relative group"
                                        >
                                            <div className="flex-1">
                                                <span className="md:hidden block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                                    Nombre del Atributo
                                                </span>
                                                <input
                                                    type="text"
                                                    value={attr.key}
                                                    onChange={(e) => {
                                                        const n = [
                                                            ...attributes,
                                                        ];
                                                        n[idx].key =
                                                            e.target.value;
                                                        setAttributes(n);
                                                    }}
                                                    placeholder="Ej: Arquitecto"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none focus:border-orange-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <span className="md:hidden block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                                    Valor / Detalle
                                                </span>
                                                <input
                                                    type="text"
                                                    value={attr.value}
                                                    onChange={(e) => {
                                                        const n = [
                                                            ...attributes,
                                                        ];
                                                        n[idx].value =
                                                            e.target.value;
                                                        setAttributes(n);
                                                    }}
                                                    placeholder="Ej: Juan Pérez"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none focus:border-orange-500"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setAttributes(
                                                        attributes.filter(
                                                            (_, i) => i !== idx
                                                        )
                                                    )
                                                }
                                                className="absolute -top-2 -right-2 md:static p-2 bg-red-50 text-red-500 rounded-full md:rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="space-y-10 animate-fade-in">
                            <div>
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <FaImage className="text-orange-500" />{' '}
                                    Galería de Imágenes
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    <div
                                        onClick={() =>
                                            imgInputRef.current?.click()
                                        }
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragActiveImg(true);
                                        }}
                                        onDragLeave={() =>
                                            setIsDragActiveImg(false)
                                        }
                                        onDrop={(e) => handleDrop(e, 'image')}
                                        className={`aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActiveImg ? 'border-orange-500 bg-orange-50' : 'border-slate-300 hover:border-orange-400 hover:bg-slate-50'}`}
                                    >
                                        <FaCloudUploadAlt className="text-2xl text-orange-500 mb-1" />
                                        <span className="text-[10px] font-bold text-slate-500 text-center px-2 uppercase tracking-tighter">
                                            Subir Fotos
                                        </span>
                                        <input
                                            ref={imgInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                e.target.files &&
                                                processFiles(
                                                    e.target.files,
                                                    'image'
                                                )
                                            }
                                        />
                                    </div>
                                    {imagePreviews.map((src, idx) => (
                                        <div
                                            key={`new-img-${idx}`}
                                            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-green-500 group shadow-md animate-fade-in"
                                        >
                                            <img
                                                src={src}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                NUEVA
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-[2px]">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReplaceNewClick(
                                                            idx,
                                                            'image'
                                                        )
                                                    }
                                                    className="p-2 bg-white rounded-full text-blue-500 shadow-xl hover:scale-110 active:scale-95 transition-transform"
                                                    title="Reemplazar"
                                                >
                                                    <FaExchangeAlt size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewFile(
                                                            idx,
                                                            'image'
                                                        )
                                                    }
                                                    className="p-2 bg-white rounded-full text-red-500 shadow-xl hover:scale-110 active:scale-95 transition-transform"
                                                    title="Eliminar"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {existingImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group shadow-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <img
                                                src={img.image}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-[2px]">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPreviewMedia({
                                                            type: 'image',
                                                            url: img.image,
                                                        })
                                                    }
                                                    className="p-2 bg-white rounded-full text-slate-700 hover:scale-110 active:scale-95 transition-transform"
                                                >
                                                    <FaExpand size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReplaceServerClick(
                                                            img.id
                                                        )
                                                    }
                                                    className="p-2 bg-white rounded-full text-blue-500 hover:scale-110 active:scale-95 transition-transform"
                                                >
                                                    <FaExchangeAlt size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setItemToDelete({
                                                            type: 'image',
                                                            id: img.id,
                                                        })
                                                    }
                                                    className="p-2 bg-white rounded-full text-red-500 hover:scale-110 active:scale-95 transition-transform"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <FaVideo className="text-blue-500" /> Videos
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div
                                        onClick={() =>
                                            vidInputRef.current?.click()
                                        }
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragActiveVid(true);
                                        }}
                                        onDragLeave={() =>
                                            setIsDragActiveVid(false)
                                        }
                                        onDrop={(e) => handleDrop(e, 'video')}
                                        className={`aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActiveVid ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                                    >
                                        <FaCloudUploadAlt className="text-2xl text-blue-500 mb-1" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            Subir Recorrido
                                        </span>
                                        <input
                                            ref={vidInputRef}
                                            type="file"
                                            multiple
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                e.target.files &&
                                                processFiles(
                                                    e.target.files,
                                                    'video'
                                                )
                                            }
                                        />
                                    </div>
                                    {videoPreviews.map((src, idx) => (
                                        <div
                                            key={`new-vid-${idx}`}
                                            className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-green-500 group shadow-lg animate-fade-in"
                                        >
                                            <video
                                                src={src}
                                                className="w-full h-full object-cover opacity-60"
                                            />
                                            <div className="absolute top-3 left-3 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-lg z-10 shadow-sm">
                                                NUEVO
                                            </div>
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-300 backdrop-blur-sm">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReplaceNewClick(
                                                            idx,
                                                            'video'
                                                        )
                                                    }
                                                    className="p-3 bg-white rounded-full text-blue-500 hover:scale-110 active:scale-95 transition-transform"
                                                >
                                                    <FaExchangeAlt size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewFile(
                                                            idx,
                                                            'video'
                                                        )
                                                    }
                                                    className="p-3 bg-white rounded-full text-red-500 hover:scale-110 active:scale-95 transition-transform"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {existingVideos.map((vid) => (
                                        <div
                                            key={vid.id}
                                            className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 group shadow-lg border border-slate-200 transition-all duration-300"
                                        >
                                            <video
                                                src={vid.video}
                                                className="w-full h-full object-cover opacity-50"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-300 backdrop-blur-[1px]">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPreviewMedia({
                                                            type: 'video',
                                                            url: vid.video,
                                                        })
                                                    }
                                                    className="p-3 bg-white rounded-full text-slate-700 hover:scale-110 active:scale-95 transition-transform"
                                                >
                                                    <FaPlay
                                                        size={16}
                                                        className="ml-0.5"
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setItemToDelete({
                                                            type: 'video',
                                                            id: vid.id,
                                                        })
                                                    }
                                                    className="p-3 bg-white rounded-full text-red-500 hover:scale-110 active:scale-95 transition-transform"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-2">
                                                <FaFileVideo className="text-white/70" />
                                                <span className="text-[10px] text-white font-medium truncate shrink-0 max-w-[150px]">
                                                    Media {vid.id}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? (
                        <FaPlus className="animate-spin" />
                    ) : (
                        <FaSave />
                    )}{' '}
                    {isLoading ? 'Guardando...' : 'Guardar Proyecto'}
                </button>
            </div>

            <ConfirmModal
                isOpen={!!itemToDelete}
                title="Confirmar Eliminación"
                message="Este archivo se eliminará permanentemente al guardar los cambios."
                onConfirm={confirmDelete}
                onCancel={() => setItemToDelete(null)}
                isDestructive
            />
            <MediaPreviewModal
                file={previewMedia}
                onClose={() => setPreviewMedia(null)}
            />
        </form>
    );
};
