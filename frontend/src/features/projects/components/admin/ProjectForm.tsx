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
    const { data: categories = [] } = useGetCategoriesQuery();
    const [updateProjectImage] = useUpdateProjectImageMutation();

    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [location, setLocation] = useState('');

    const [status, setStatus] = useState<string>('');
    const [year, setYear] = useState<string>('');

    const [description, setDescription] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);

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
    const replaceServerImgRef = useRef<HTMLInputElement>(null);
    const replaceNewFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCategoryId(String(initialData.category));
            setLocation(initialData.location);
            setStatus(initialData.status || '');
            setDescription(initialData.description || '');
            setYear(initialData.year ? String(initialData.year) : '');
            setIsFeatured(initialData.is_featured);
            setServiceType(initialData.service_type || '');
            setLevels(initialData.levels || '');
            setArea(initialData.area || '');

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

    const blockInvalidChar = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
    };
    const getFileName = (url: string) => {
        try {
            return decodeURIComponent(url.split('/').pop() || 'Video');
        } catch {
            return 'Video';
        }
    };

    const handleAttributeChange = (
        index: number,
        field: 'key' | 'value',
        val: string
    ) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = val;
        setAttributes(newAttributes);
    };
    const addAttributeRow = () =>
        setAttributes([...attributes, { key: '', value: '' }]);
    const removeAttributeRow = (index: number) =>
        setAttributes(attributes.filter((_, i) => i !== index));

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
            setErrors((prev) => ({ ...prev, uploaded_images: '' }));
        } else {
            setNewVideos((p) => [...p, ...validFiles]);
            setVideoPreviews((p) => [...p, ...validPreviews]);
            setErrors((prev) => ({ ...prev, uploaded_videos: '' }));
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
    const removeNewFile = (idx: number, type: 'image' | 'video') => {
        if (type === 'image') {
            setNewImages((p) => p.filter((_, i) => i !== idx));
            setImagePreviews((p) => p.filter((_, i) => i !== idx));
        } else {
            setNewVideos((p) => p.filter((_, i) => i !== idx));
            setVideoPreviews((p) => p.filter((_, i) => i !== idx));
        }
    };
    const confirmDelete = () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'image') {
            setImagesToDelete((p) => [...p, itemToDelete.id]);
            setExistingImages((p) =>
                p.filter((img) => img.id !== itemToDelete.id)
            );
            toast.success('Imagen eliminada');
        } else {
            setVideosToDelete((p) => [...p, itemToDelete.id]);
            setExistingVideos((p) =>
                p.filter((vid) => vid.id !== itemToDelete.id)
            );
            toast.success('Video eliminado');
        }
        setItemToDelete(null);
    };
    const handleReplaceNewClick = (index: number, type: 'image' | 'video') => {
        setNewFileToReplace({ index, type });
        replaceNewFileRef.current?.click();
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
            toast.success('Reemplazado');
        }
        if (replaceNewFileRef.current) replaceNewFileRef.current.value = '';
        setNewFileToReplace(null);
    };
    const handleReplaceServerClick = (id: number) => {
        setImgToReplaceId(id);
        replaceServerImgRef.current?.click();
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
                toast.success('Actualizado', { id: toastId });
            } catch (error) {
                toast.error('Error al actualizar', { id: toastId });
            }
        }
        if (replaceServerImgRef.current) replaceServerImgRef.current.value = '';
        setImgToReplaceId(null);
    };

    const parseBackendErrors = (err: any) => {
        if (err?.data?.errors) {
            const apiErrors = err.data.errors;
            const newErrors: Record<string, string> = {};

            Object.keys(apiErrors).forEach((key) => {
                const errorContent = apiErrors[key];
                if (Array.isArray(errorContent)) {
                    newErrors[key] = errorContent[0];
                } else if (
                    typeof errorContent === 'object' &&
                    errorContent !== null
                ) {
                    const firstKey = Object.keys(errorContent)[0];
                    if (firstKey && Array.isArray(errorContent[firstKey])) {
                        newErrors[key] = errorContent[firstKey][0];
                    }
                }
            });

            setErrors(newErrors);
            toast.error(err.data.message || 'Error al guardar el proyecto');

            if (newErrors.uploaded_images || newErrors.uploaded_videos)
                setActiveTab('media');
            else if (
                newErrors.service_type ||
                newErrors.area ||
                newErrors.levels
            )
                setActiveTab('details');
            else setActiveTab('general');
        } else {
            toast.error('Ocurrió un error inesperado');
        }
    };

    const validateClientSide = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim())
            newErrors.name = 'El nombre del proyecto es obligatorio.';
        if (!categoryId)
            newErrors.category = 'Debes seleccionar una categoría.';
        if (!location.trim()) newErrors.location = 'La ubicación es requerida.';
        if (!status)
            newErrors.status = 'Debes seleccionar el estado del proyecto.';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setActiveTab('general');
            toast.error('Por favor completa los campos requeridos.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateClientSide()) return;
        setErrors({});

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', categoryId);
        formData.append('location', location);
        formData.append('status', status);
        formData.append('is_featured', isFeatured ? 'true' : 'false');
        formData.append('description', description);
        formData.append('service_type', serviceType);
        formData.append('levels', levels);
        formData.append('area', area);
        formData.append('year', year);

        if (attributes.length > 0) {
            const extraInfoObj = attributes.reduce(
                (acc, curr) => {
                    if (curr.key.trim())
                        acc[curr.key.trim()] = curr.value.trim();
                    return acc;
                },
                {} as Record<string, string>
            );
            if (Object.keys(extraInfoObj).length > 0)
                formData.append('extra_info', JSON.stringify(extraInfoObj));
        }

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
            console.error('Error form:', err);
            parseBackendErrors(err);
        }
    };

    const categoryOptions = categories.map((c) => ({
        value: c.id,
        label: c.name,
    }));
    const statusOptions = [
        { value: 'en_proceso', label: 'En Ejecución' },
        { value: 'entregado', label: 'Entregado' },
    ];

    const getInputClass = (errKey: string) => `
        w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all font-medium text-slate-700 placeholder-slate-400 text-sm focus:bg-white
        ${errors[errKey] ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30' : 'border-slate-200 focus:border-orange-500'}
    `;
    const labelClass =
        'block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1';

    const TabButton = ({
        tab,
        label,
        icon: Icon,
    }: {
        tab: TabType;
        label: string;
        icon: React.ElementType;
    }) => (
        <button
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative
                ${activeTab === tab ? 'text-orange-600 bg-orange-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
            <Icon
                className={
                    activeTab === tab ? 'text-orange-500' : 'text-slate-400'
                }
            />
            <span className="hidden sm:inline">{label}</span>
            {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full"></span>
            )}
            {tab === 'general' &&
                (errors.name ||
                    errors.category ||
                    errors.location ||
                    errors.status) && (
                    <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-md shadow-red-500/50"></span>
                )}
            {tab === 'media' &&
                (errors.uploaded_images || errors.uploaded_videos) && (
                    <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-md shadow-red-500/50"></span>
                )}
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in-up pb-10">
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
                    <TabButton tab="general" label="Esenciales" icon={FaPen} />
                    <TabButton
                        tab="details"
                        label="Detalles Técnicos"
                        icon={FaListUl}
                    />
                    <TabButton tab="media" label="Multimedia" icon={FaImage} />
                </div>

                <div className="p-6 md:p-8">
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-fade-in">
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                                    <FaExclamationCircle className="text-xl" />
                                    <div>
                                        <p>
                                            Se encontraron errores. Por favor
                                            revisa los campos marcados.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        Nombre Oficial del Proyecto{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (errors.name)
                                                setErrors({
                                                    ...errors,
                                                    name: '',
                                                });
                                        }}
                                        placeholder="Ej: Residencial Mirador de Yanahuara II"
                                        className={getInputClass('name')}
                                    />
                                    <FieldError msg={errors.name} />
                                </div>

                                <div className="relative z-20">
                                    <label className={labelClass}>
                                        Categoría del Proyecto{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        value={categoryId}
                                        onChange={(val) => {
                                            setCategoryId(val);
                                            if (errors.category)
                                                setErrors({
                                                    ...errors,
                                                    category: '',
                                                });
                                        }}
                                        options={categoryOptions}
                                        placeholder="Seleccione el tipo de proyecto..."
                                        icon={FaLayerGroup}
                                        className={`bg-slate-50 ${errors.category ? 'ring-1 ring-red-500 rounded-xl' : ''}`}
                                    />
                                    <FieldError msg={errors.category} />
                                </div>

                                <div className="relative z-10">
                                    <label className={labelClass}>
                                        Estado de Ejecución{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        value={status}
                                        onChange={(val) => {
                                            setStatus(val);
                                            if (errors.status)
                                                setErrors({
                                                    ...errors,
                                                    status: '',
                                                });
                                        }}
                                        options={statusOptions}
                                        placeholder="Seleccione el estado actual..."
                                        icon={FaCheckCircle}
                                        className={`bg-slate-50 ${errors.status ? 'ring-1 ring-red-500 rounded-xl' : ''}`}
                                    />
                                    <FieldError msg={errors.status} />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Ubicación Geográfica{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FaGlobeAmericas className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => {
                                                setLocation(e.target.value);
                                                if (errors.location)
                                                    setErrors({
                                                        ...errors,
                                                        location: '',
                                                    });
                                            }}
                                            className={`${getInputClass('location')} pl-10`}
                                            placeholder="Ej: Av. Ejército 123, Cayma, Arequipa"
                                        />
                                    </div>
                                    <FieldError msg={errors.location} />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Año de Finalización
                                    </label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            value={year}
                                            onChange={(e) =>
                                                setYear(e.target.value)
                                            }
                                            className={`${getInputClass('')} pl-10`}
                                            placeholder="Ej: 2025"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        Memoria Descriptiva / Resumen
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        rows={5}
                                        className={`${getInputClass('')} resize-y min-h-[120px] leading-relaxed`}
                                        placeholder="Escribe una descripción atractiva para la web. Incluye el concepto arquitectónico, materiales principales y propuesta de valor..."
                                    />
                                </div>

                                <div className="md:col-span-2 bg-orange-50/50 border border-orange-100 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${isFeatured ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                                        >
                                            <FaStar />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">
                                                Destacar Proyecto
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                Si se activa, el proyecto
                                                aparecerá en el carrusel
                                                principal del inicio.
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
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
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
                                        Tipología de Edificación
                                    </label>
                                    <div className="relative">
                                        <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={serviceType}
                                            onChange={(e) =>
                                                setServiceType(e.target.value)
                                            }
                                            placeholder="Ej: Edificio Multifamiliar"
                                            className={`${getInputClass('')} pl-10`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Área Techada Total (m²)
                                    </label>
                                    <div className="relative">
                                        <FaRulerCombined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            onKeyDown={blockInvalidChar}
                                            value={area}
                                            onChange={(e) =>
                                                setArea(e.target.value)
                                            }
                                            placeholder="Ej: 250.50"
                                            className={`${getInputClass('')} pl-10`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Número de Niveles / Pisos
                                    </label>
                                    <input
                                        type="text"
                                        value={levels}
                                        onChange={(e) =>
                                            setLevels(e.target.value)
                                        }
                                        placeholder="Ej: 5 Pisos + Azotea + Sótano"
                                        className={getInputClass('')}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                            <FaListUl className="text-slate-400" />{' '}
                                            Ficha Técnica Adicional
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            Agrega detalles técnicos específicos
                                            en formato clave-valor.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addAttributeRow}
                                        className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 rounded-lg hover:bg-slate-700 flex items-center gap-1 transition-colors"
                                    >
                                        <FaPlus /> Agregar Fila
                                    </button>
                                </div>

                                <div className="space-y-4 sm:space-y-3 bg-white p-4 rounded-xl border border-slate-100">
                                    {attributes.map((attr, idx) => (
                                        <div
                                            key={idx}
                                            className="relative flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 sm:p-0 bg-slate-50 sm:bg-transparent border sm:border-none border-slate-200 rounded-xl transition-all group"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeAttributeRow(idx)
                                                }
                                                className="absolute top-2 right-2 sm:static sm:order-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10"
                                                title="Eliminar fila"
                                            >
                                                <FaTimes size={14} />
                                            </button>

                                            <div className="w-full sm:flex-1">
                                                <label className="block sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                                                    Atributo
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Atributo (Ej: Arquitecto a Cargo)"
                                                    value={attr.key}
                                                    onChange={(e) =>
                                                        handleAttributeChange(
                                                            idx,
                                                            'key',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full text-sm px-4 py-3 bg-white sm:bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                                                />
                                            </div>

                                            <div className="w-full sm:flex-1">
                                                <label className="block sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                                                    Detalle
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Detalle (Ej: Arq. Juan Pérez)"
                                                    value={attr.value}
                                                    onChange={(e) =>
                                                        handleAttributeChange(
                                                            idx,
                                                            'value',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full text-sm px-4 py-3 bg-white sm:bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {attributes.length === 0 && (
                                        <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                                            <p className="text-sm text-slate-400 italic">
                                                No hay especificaciones
                                                adicionales.
                                            </p>
                                            <p className="text-xs text-slate-300 mt-1">
                                                Haz clic en "Agregar Fila" para
                                                comenzar.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="space-y-10 animate-fade-in">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        <FaImage className="text-orange-500" />{' '}
                                        Galería de Imágenes
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                                        <FaInfoCircle /> JPG, PNG, WEBP
                                    </div>
                                </div>
                                {errors.uploaded_images && (
                                    <div className="mb-4">
                                        <FieldError
                                            msg={errors.uploaded_images}
                                        />
                                    </div>
                                )}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    <div
                                        onClick={() =>
                                            imgInputRef.current?.click()
                                        }
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
                                        className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02] ${isDragActiveImg ? 'border-orange-500 bg-orange-50' : 'border-slate-300 hover:border-orange-400 hover:bg-slate-50'}`}
                                    >
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
                                        <div className="w-12 h-12 mb-2 rounded-full bg-white shadow-sm flex items-center justify-center">
                                            <FaCloudUploadAlt className="text-2xl text-orange-500" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">
                                            Subir Imágenes
                                        </span>
                                    </div>
                                    {imagePreviews.map((src, idx) => (
                                        <div
                                            key={`new-${idx}`}
                                            className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-green-500 shadow-sm"
                                        >
                                            <img
                                                src={src}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                                                NUEVA
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPreviewMedia({
                                                            type: 'image',
                                                            url: src,
                                                        })
                                                    }
                                                    className="p-2 bg-white rounded-full text-slate-700 hover:text-orange-500 shadow-lg hover:scale-110 transition-transform"
                                                    title="Ver"
                                                >
                                                    <FaExpand size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReplaceNewClick(
                                                            idx,
                                                            'image'
                                                        )
                                                    }
                                                    className="p-2 bg-white rounded-full text-blue-500 shadow-lg hover:scale-110 transition-transform"
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
                                                    className="p-2 bg-white rounded-full text-red-500 shadow-lg hover:scale-110 transition-transform"
                                                    title="Borrar"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {existingImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-200 shadow-sm"
                                        >
                                            <img
                                                src={img.image}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPreviewMedia({
                                                            type: 'image',
                                                            url: img.image,
                                                        })
                                                    }
                                                    className="p-2 bg-white rounded-full text-slate-700 hover:text-orange-500 shadow-lg hover:scale-110 transition-transform"
                                                    title="Ver"
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
                                                    className="p-2 bg-white rounded-full text-blue-500 shadow-lg hover:scale-110 transition-transform"
                                                    title="Reemplazar"
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
                                                    className="p-2 bg-white rounded-full text-red-500 shadow-lg hover:scale-110 transition-transform"
                                                    title="Borrar"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        <FaVideo className="text-blue-500" />{' '}
                                        Videos del Proyecto
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                                        <FaInfoCircle /> MP4 (Máx 50MB)
                                    </div>
                                </div>
                                {errors.uploaded_videos && (
                                    <div className="mb-4">
                                        <FieldError
                                            msg={errors.uploaded_videos}
                                        />
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div
                                        onClick={() =>
                                            vidInputRef.current?.click()
                                        }
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
                                        className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02] ${isDragActiveVid ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                                    >
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
                                        <div className="w-12 h-12 mb-2 rounded-full bg-white shadow-sm flex items-center justify-center">
                                            <FaCloudUploadAlt className="text-2xl text-blue-500" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">
                                            Subir Videos
                                        </span>
                                    </div>
                                    {videoPreviews.map((src, idx) => (
                                        <div
                                            key={idx}
                                            className="aspect-video bg-slate-900 rounded-2xl border-2 border-green-500 relative overflow-hidden group shadow-sm"
                                        >
                                            <video
                                                src={src}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                                                NUEVO
                                            </div>
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm z-20">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPreviewMedia({
                                                            type: 'video',
                                                            url: src,
                                                        })
                                                    }
                                                    className="p-2 bg-white rounded-full text-slate-700 hover:text-orange-500 shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <FaPlay
                                                        size={12}
                                                        className="ml-0.5"
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReplaceNewClick(
                                                            idx,
                                                            'video'
                                                        )
                                                    }
                                                    className="p-2 bg-white rounded-full text-blue-500 shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <FaExchangeAlt size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewFile(
                                                            idx,
                                                            'video'
                                                        )
                                                    }
                                                    className="p-2 bg-white rounded-full text-red-500 shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                            <FaFileVideo className="absolute bottom-3 left-3 text-white/50 text-xl z-0" />
                                        </div>
                                    ))}
                                    {existingVideos.map((vid) => (
                                        <div
                                            key={vid.id}
                                            className="aspect-video bg-slate-900 rounded-2xl border border-slate-200 relative overflow-hidden group shadow-sm"
                                        >
                                            <video
                                                src={vid.video}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm z-20">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPreviewMedia({
                                                            type: 'video',
                                                            url: vid.video,
                                                        })
                                                    }
                                                    className="p-2 bg-white rounded-full text-slate-700 hover:text-orange-500 shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <FaPlay
                                                        size={12}
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
                                                    className="p-2 bg-white rounded-full text-red-500 shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white flex items-center gap-2">
                                                <FaFileVideo className="text-white/70" />
                                                <span className="text-xs truncate">
                                                    {getFileName(vid.video)}
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

            <div className="mt-8 flex justify-end gap-4 border-t border-slate-100 pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-all disabled:opacity-50 text-sm"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold hover:from-orange-600 hover:to-orange-500 shadow-lg shadow-slate-900/10 hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none text-sm"
                >
                    {isLoading ? (
                        'Guardando...'
                    ) : (
                        <>
                            <FaSave /> Guardar Proyecto
                        </>
                    )}
                </button>
            </div>

            <ConfirmModal
                isOpen={!!itemToDelete}
                title="Confirmar eliminación"
                message="Este archivo se eliminará al guardar los cambios."
                confirmText="Eliminar"
                isDestructive={true}
                onConfirm={confirmDelete}
                onCancel={() => setItemToDelete(null)}
            />
            <MediaPreviewModal
                file={previewMedia}
                onClose={() => setPreviewMedia(null)}
            />
        </form>
    );
};
