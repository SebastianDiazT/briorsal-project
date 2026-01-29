import React, { useState, useEffect, useRef } from 'react';
import { FaSave, FaPen, FaListUl, FaImage, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { Project, ProjectImage, ProjectVideo } from '@/features/projects/types';
import {
    useUpdateProjectImageMutation,
    useGetProjectsQuery,
} from '@/features/projects/api/projectsApi';
import { useGetCategoriesQuery } from '@/features/categories/api/categoriesApi';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

import { GeneralTab } from './tabs/GeneralTab';
import { DetailsTab } from './tabs/DetailsTab';
import { MediaTab } from './tabs/MediaTab';
import { MediaPreviewModal } from './partials/MediaPreviewModal';
import { AttributeRow } from './partials/AttributeManager';
import {
    VALID_IMG_TYPES,
    VALID_VIDEO_TYPES,
    MAX_IMG_SIZE_MB,
    MAX_VIDEO_SIZE_MB,
} from './partials/FileLimitInfo';

type TabType = 'general' | 'details' | 'media';

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
    const { data: categoriesResponse } = useGetCategoriesQuery();
    const categories = categoriesResponse?.data || [];
    const { data: projectsResponse } = useGetProjectsQuery({ no_page: true });
    const allProjects = projectsResponse?.data || [];
    const availableRelatedProjects = initialData
        ? allProjects.filter((p) => p.id !== initialData.id)
        : allProjects;
    const [updateProjectImage] = useUpdateProjectImageMutation();

    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [name, setName] = useState('');
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [relatedProjectIds, setRelatedProjectIds] = useState<string[]>([]);
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

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>('');

    const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

    const [existingVideos, setExistingVideos] = useState<ProjectVideo[]>([]);
    const [newVideos, setNewVideos] = useState<File[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
    const [videosToDelete, setVideosToDelete] = useState<number[]>([]);

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
            setCategoryIds(
                initialData.categories?.map((c) => String(c.id)) || []
            );
            setRelatedProjectIds(
                initialData.related_projects?.map((p) => String(p.id)) || []
            );
            setLocation(initialData.location);
            setStatus(initialData.status || 'en_proceso');
            setDescription(initialData.description || '');
            setYear(initialData.year ? String(initialData.year) : '');
            setIsFeatured(initialData.is_featured);
            setServiceType(initialData.service_type || '');
            setLevels(initialData.levels || '');
            setArea(initialData.area || '');
            setCoverPreview(initialData.cover_image_url || '');
            setBannerPreview(initialData.banner_image_url || '');

            if (initialData.extra_info) {
                let parsedInfo: Record<string, any> = {};

                if (typeof initialData.extra_info === 'string') {
                    try {
                        parsedInfo = JSON.parse(initialData.extra_info);
                    } catch (e) {
                        console.error('Error al leer extra_info:', e);
                        parsedInfo = {};
                    }
                }
                else if (typeof initialData.extra_info === 'object') {
                    parsedInfo = initialData.extra_info;
                }

                const rows = Object.entries(parsedInfo).map(([key, value]) => ({
                    key,
                    value: String(value),
                }));

                if (rows.length > 0) {
                    setAttributes(rows);
                } else {
                    setAttributes([{ key: '', value: '' }]);
                }
            } else {
                setAttributes([{ key: '', value: '' }]);
            }

            setExistingImages(initialData.images || []);
            setExistingVideos(initialData.videos || []);
        }
    }, [initialData]);

    const validateFile = (file: File, type: 'image' | 'video'): boolean => {
        const allowedTypes =
            type === 'image' ? VALID_IMG_TYPES : VALID_VIDEO_TYPES;
        const maxBytes =
            (type === 'image' ? MAX_IMG_SIZE_MB : MAX_VIDEO_SIZE_MB) *
            1024 *
            1024;
        if (!allowedTypes.includes(file.type)) {
            toast.error('Formato incorrecto');
            return false;
        }
        if (file.size > maxBytes) {
            toast.error('Archivo muy pesado');
            return false;
        }
        return true;
    };

    const handleSingleFileChange = (file: File, type: 'cover' | 'banner') => {
        if (!validateFile(file, 'image')) return;
        const preview = URL.createObjectURL(file);
        if (type === 'cover') {
            setCoverImage(file);
            setCoverPreview(preview);
        } else {
            setBannerImage(file);
            setBannerPreview(preview);
        }
    };

    const handleSingleFileRemove = (type: 'cover' | 'banner') => {
        if (type === 'cover') {
            setCoverImage(null);
            setCoverPreview('');
        } else {
            setBannerImage(null);
            setBannerPreview('');
        }
    };

    const processFiles = (files: FileList, type: 'image' | 'video') => {
        const validFiles: File[] = [];
        const validPreviews: string[] = [];
        Array.from(files).forEach((f) => {
            if (validateFile(f, type)) {
                validFiles.push(f);
                validPreviews.push(URL.createObjectURL(f));
            }
        });
        if (validFiles.length > 0) {
            if (type === 'image') {
                setNewImages((p) => [...p, ...validFiles]);
                setImagePreviews((p) => [...p, ...validPreviews]);
            } else {
                setNewVideos((p) => [...p, ...validFiles]);
                setVideoPreviews((p) => [...p, ...validPreviews]);
            }
            toast.success(`${validFiles.length} archivos agregados`);
        }
    };

    const handleGalleryDrop = (e: React.DragEvent, type: 'image' | 'video') => {
        e.preventDefault();
        e.stopPropagation();
        type === 'image'
            ? setIsDragActiveImg(false)
            : setIsDragActiveVid(false);

        if (e.dataTransfer.files?.length) {
            processFiles(e.dataTransfer.files, type);
        }
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
            if (!validateFile(file, newFileToReplace.type)) return;
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
        if (replaceNewFileRef.current) replaceNewFileRef.current.value = '';
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
            if (!validateFile(file, 'image')) return;
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
            } catch {
                toast.error('Error', { id: toastId });
            }
        }
        setImgToReplaceId(null);
        if (replaceServerImgRef.current) replaceServerImgRef.current.value = '';
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

    const toggleCategory = (id: string) => {
        setCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
        if (errors.category_ids)
            setErrors((prev) => ({ ...prev, category_ids: '' }));
    };

    const toggleRelatedProject = (id: string) => {
        setRelatedProjectIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const validateClientSide = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'Requerido';
        if (categoryIds.length === 0) newErrors.category_ids = 'Requerido';
        if (!location.trim()) newErrors.location = 'Requerido';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setActiveTab('general');
            return false;
        }
        return true;
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
        if (year && year.trim() !== '') {
            formData.append('year', year);
        }

        if (categoryIds.length === 0) {
            formData.append('category_ids', '');
        } else {
            categoryIds.forEach((id) => formData.append('category_ids', id));
        }

        if (relatedProjectIds.length === 0) {
            formData.append('related_project_ids', '');
        } else {
            relatedProjectIds.forEach((id) =>
                formData.append('related_project_ids', id)
            );
        }

        if (coverImage) {
            formData.append('cover_image', coverImage);
        } else if (!coverPreview) {
            formData.append('cover_image', '');
        }

        if (bannerImage) {
            formData.append('banner_image', bannerImage);
        } else if (!bannerPreview) {
            formData.append('banner_image', '');
        }

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
            formData.append('delete_images', String(id))
        );
        videosToDelete.forEach((id) =>
            formData.append('delete_videos', String(id))
        );

        try {
            await onSubmit(formData);
        } catch (err: any) {
            if (err?.data?.errors) {
                const apiErrors = err.data.errors;
                const newErrors: Record<string, string> = {};
                Object.keys(apiErrors).forEach((key) => {
                    newErrors[key] = Array.isArray(apiErrors[key])
                        ? apiErrors[key][0]
                        : String(apiErrors[key]);
                });
                setErrors(newErrors);
                toast.error('Corrige los errores');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative pb-20">
            <input
                type="file"
                ref={imgInputRef}
                multiple
                hidden
                accept="image/*"
                onChange={(e) =>
                    e.target.files && processFiles(e.target.files, 'image')
                }
            />
            <input
                type="file"
                ref={vidInputRef}
                multiple
                hidden
                accept="video/*"
                onChange={(e) =>
                    e.target.files && processFiles(e.target.files, 'video')
                }
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
                <div className="flex border-b border-slate-100 bg-white">
                    {[
                        { id: 'general', label: 'Esenciales', icon: FaPen },
                        {
                            id: 'details',
                            label: 'Especificaciones',
                            icon: FaListUl,
                        },
                        { id: 'media', label: 'Multimedia', icon: FaImage },
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveTab(item.id as TabType)}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === item.id ? 'text-orange-600 bg-orange-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <item.icon size={14} />
                            <span className="hidden sm:inline">
                                {item.label}
                            </span>
                            {activeTab === item.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-6 md:p-8">
                    {activeTab === 'general' && (
                        <GeneralTab
                            name={name}
                            setName={setName}
                            categoryIds={categoryIds}
                            toggleCategory={toggleCategory}
                            categories={categories}
                            location={location}
                            setLocation={setLocation}
                            status={status}
                            setStatus={setStatus}
                            year={year}
                            setYear={setYear}
                            isFeatured={isFeatured}
                            setIsFeatured={setIsFeatured}
                            coverPreview={coverPreview}
                            coverImage={coverImage}
                            onCoverChange={(file) =>
                                handleSingleFileChange(file, 'cover')
                            }
                            onCoverRemove={() =>
                                handleSingleFileRemove('cover')
                            }
                            errors={errors}
                        />
                    )}

                    {activeTab === 'details' && (
                        <DetailsTab
                            description={description}
                            setDescription={setDescription}
                            serviceType={serviceType}
                            setServiceType={setServiceType}
                            levels={levels}
                            setLevels={setLevels}
                            area={area}
                            setArea={setArea}
                            attributes={attributes}
                            setAttributes={setAttributes}
                            bannerPreview={bannerPreview}
                            bannerImage={bannerImage}
                            onBannerChange={(file) =>
                                handleSingleFileChange(file, 'banner')
                            }
                            onBannerRemove={() =>
                                handleSingleFileRemove('banner')
                            }
                            availableRelatedProjects={availableRelatedProjects}
                            relatedProjectIds={relatedProjectIds}
                            toggleRelatedProject={toggleRelatedProject}
                        />
                    )}

                    {activeTab === 'media' && (
                        <MediaTab
                            imgInputRef={imgInputRef}
                            vidInputRef={vidInputRef}
                            imagePreviews={imagePreviews}
                            existingImages={existingImages}
                            videoPreviews={videoPreviews}
                            existingVideos={existingVideos}
                            isDragActiveImg={isDragActiveImg}
                            setIsDragActiveImg={setIsDragActiveImg}
                            isDragActiveVid={isDragActiveVid}
                            setIsDragActiveVid={setIsDragActiveVid}
                            onFileDrop={handleGalleryDrop}
                            onRemoveNew={removeNewFile}
                            onReplaceNewClick={handleReplaceNewClick}
                            onReplaceServerClick={handleReplaceServerClick}
                            onDeleteServerClick={(id, type) =>
                                setItemToDelete({ type, id })
                            }
                            onPreview={(url, type) =>
                                setPreviewMedia({ url, type })
                            }
                        />
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors text-sm border border-transparent hover:border-slate-200"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <FaSpinner className="animate-spin" />
                    ) : (
                        <FaSave />
                    )}
                    {isLoading ? 'Guardando...' : 'Guardar Proyecto'}
                </button>
            </div>

            <ConfirmModal
                isOpen={!!itemToDelete}
                title="Confirmar Eliminación"
                message="Este archivo se eliminará permanentemente al guardar."
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
