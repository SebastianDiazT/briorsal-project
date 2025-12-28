import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaInfoCircle, FaImage, FaVideo, FaTrash } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    fetchCategories,
    Project,
    deleteProjectImage,
    deleteProjectVideo,
} from '@store/slices/projectSlice';
import { DynamicFileField } from './DynamicFileField';
import { ConfirmModal } from '@components/ui/ConfirmModal';
import toast from 'react-hot-toast';

interface ProjectFormProps {
    initialData?: Project | null;
    onSubmit: (data: FormData) => void;
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
    const { categories } = useAppSelector((state) => state.projects);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // Estados para archivos NUEVOS (los que vas a subir)
    const [newImages, setNewImages] = useState<
        { id: string; file: File | null }[]
    >([{ id: '1', file: null }]);
    const [newVideos, setNewVideos] = useState<
        { id: string; file: File | null }[]
    >([]);

    const [currentImages, setCurrentImages] = useState(
        initialData?.images || []
    );
    const [currentVideos, setCurrentVideos] = useState(
        initialData?.videos || []
    );

    // Estado para el modal de borrado de archivos
    const [mediaToDelete, setMediaToDelete] = useState<{
        type: 'image' | 'video';
        id: number;
    } | null>(null);

    useEffect(() => {
        if (categories.length === 0) dispatch(fetchCategories());
    }, [dispatch, categories.length]);

    // Cargar datos iniciales al formulario
    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name);
            setValue('category', initialData.category);
            setValue('location', initialData.location);
            setValue('service_type', initialData.service_type);
            setValue('levels', initialData.levels);
            setValue('area', initialData.area);
            setValue('status', initialData.status);
            setValue('extra_info', initialData.extra_info);
            setValue('is_featured', initialData.is_featured);
            setCurrentImages(initialData.images || []);
            setCurrentVideos(initialData.videos || []);
        }
    }, [initialData, setValue]);

    const addFileField = (type: 'image' | 'video') => {
        const newField = { id: Date.now().toString(), file: null };
        type === 'image'
            ? setNewImages([...newImages, newField])
            : setNewVideos([...newVideos, newField]);
    };
    const removeFileField = (type: 'image' | 'video', id: string) => {
        type === 'image'
            ? setNewImages(newImages.filter((f) => f.id !== id))
            : setNewVideos(newVideos.filter((f) => f.id !== id));
    };
    const updateFileField = (
        type: 'image' | 'video',
        id: string,
        file: File
    ) => {
        type === 'image'
            ? setNewImages(
                  newImages.map((f) => (f.id === id ? { ...f, file } : f))
              )
            : setNewVideos(
                  newVideos.map((f) => (f.id === id ? { ...f, file } : f))
              );
    };

    // Función al hacer click en borrar una foto/video existente
    const handleRequestDeleteMedia = (type: 'image' | 'video', id: number) => {
        setMediaToDelete({ type, id });
    };

    // Confirmar borrado
    const confirmDeleteMedia = async () => {
        if (!mediaToDelete) return;

        if (mediaToDelete.type === 'image') {
            await dispatch(deleteProjectImage(mediaToDelete.id));
            setCurrentImages((prev) =>
                prev.filter((img) => img.id !== mediaToDelete.id)
            );
            toast.success('Imagen eliminada');
        } else {
            await dispatch(deleteProjectVideo(mediaToDelete.id));
            setCurrentVideos((prev) =>
                prev.filter((vid) => vid.id !== mediaToDelete.id)
            );
            toast.success('Video eliminado');
        }
        setMediaToDelete(null); // Cerrar modal
    };

    const handleFormSubmit = (data: any) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] != null) formData.append(key, data[key]);
        });
        // Solo adjuntamos los archivos nuevos que el usuario seleccionó
        newImages.forEach((item) => {
            if (item.file) formData.append('uploaded_images', item.file);
        });
        newVideos.forEach((item) => {
            if (item.file) formData.append('uploaded_videos', item.file);
        });
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-6 pb-20"
        >
            {/* 1. INFORMACIÓN PRINCIPAL */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="bg-brand-100 text-brand-600 p-1.5 rounded-lg">
                        <FaInfoCircle />
                    </span>
                    Información del Proyecto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="form-label">
                            Nombre del Proyecto
                        </label>
                        <input
                            {...register('name', { required: 'Requerido' })}
                            className="form-input"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-xs mt-1">
                                Nombre obligatorio
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="form-label">Categoría</label>
                        <select
                            {...register('category', { required: true })}
                            className="form-select"
                        >
                            <option value="">Seleccionar...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Ubicación</label>
                        <input
                            {...register('location')}
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label className="form-label">Estado de Obra</label>
                        <select {...register('status')} className="form-select">
                            <option value="En Proceso">En Proceso</option>
                            <option value="Finalizado">Finalizado</option>
                            <option value="Diseño">Diseño</option>
                            <option value="Paralizado">Paralizado</option>
                        </select>
                    </div>
                    <div className="flex items-end pb-3">
                        <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-50 rounded-lg w-full transition-colors border border-transparent hover:border-slate-200">
                            <input
                                type="checkbox"
                                {...register('is_featured')}
                                className="h-5 w-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                            />
                            <span className="text-slate-700 font-medium text-sm">
                                Destacar en Inicio
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* 2. FICHA TÉCNICA */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                        <FaInfoCircle />
                    </span>
                    Ficha Técnica
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                        <label className="form-label">Edificación</label>
                        <input
                            {...register('service_type')}
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label className="form-label">Niveles</label>
                        <input {...register('levels')} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">Área Total</label>
                        <input {...register('area')} className="form-input" />
                    </div>
                    <div className="col-span-full">
                        <label className="form-label">Datos Extras</label>
                        <textarea
                            {...register('extra_info')}
                            className="form-input min-h-[100px]"
                        />
                    </div>
                </div>
            </div>

            {/* 3. MULTIMEDIA */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg">
                        <FaImage />
                    </span>
                    Multimedia
                </h3>

                {/* --- GALERÍA ACTUAL (VISUALIZADOR) --- */}
                {(currentImages.length > 0 || currentVideos.length > 0) && (
                    <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">
                            Archivos Actuales en Servidor
                        </h4>

                        {/* Imágenes Actuales */}
                        {currentImages.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                                    <FaImage /> Imágenes ({currentImages.length}
                                    )
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {currentImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className="relative group aspect-square bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                                        >
                                            <img
                                                src={img.image}
                                                alt="Proyecto"
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Botón para borrar imagen individual */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRequestDeleteMedia(
                                                        'image',
                                                        img.id
                                                    )
                                                }
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-md opacity-100 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-sm"
                                                title="Eliminar imagen"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Videos Actuales */}
                        {currentVideos.length > 0 && (
                            <div>
                                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                                    <FaVideo /> Videos ({currentVideos.length})
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {currentVideos.map((vid) => (
                                        <div
                                            key={vid.id}
                                            className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-200 group"
                                        >
                                            <video
                                                src={vid.video}
                                                className="w-full h-full object-cover opacity-60"
                                            />
                                            <FaVideo className="absolute inset-0 m-auto text-white text-2xl opacity-80" />
                                            {/* Botón para borrar video individual */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRequestDeleteMedia(
                                                        'video',
                                                        vid.id
                                                    )
                                                }
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-md opacity-100 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-sm z-10"
                                                title="Eliminar video"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- SUBIR NUEVOS ARCHIVOS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <DynamicFileField
                        label="Agregar Nuevas Fotos"
                        accept="image/*"
                        icon="image"
                        fields={newImages}
                        onAdd={() => addFileField('image')}
                        onRemove={(id) => removeFileField('image', id)}
                        onChange={(id, f) => updateFileField('image', id, f)}
                    />
                    <DynamicFileField
                        label="Agregar Nuevos Videos"
                        accept="video/*"
                        icon="video"
                        fields={newVideos}
                        onAdd={() => addFileField('video')}
                        onRemove={(id) => removeFileField('video', id)}
                        onChange={(id, f) => updateFileField('video', id, f)}
                    />
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-100"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-xl shadow-brand-500/30 disabled:opacity-70"
                >
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            {/* --- MODAL DE CONFIRMACIÓN AL FINAL --- */}
            <ConfirmModal
                isOpen={!!mediaToDelete}
                title="¿Eliminar archivo?"
                message="El archivo se eliminará permanentemente del servidor. No necesitas guardar el formulario para que esto aplique."
                confirmText="Sí, Eliminar"
                isDestructive={true}
                onConfirm={confirmDeleteMedia}
                onCancel={() => setMediaToDelete(null)}
            />
        </form>
    );
};
