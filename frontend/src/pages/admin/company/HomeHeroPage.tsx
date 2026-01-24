import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
    FaSave,
    FaSpinner,
    FaInfoCircle,
    FaImage,
    FaUpload,
    FaAlignLeft,
    FaHeading,
    FaHighlighter,
    FaTrash,
    FaCloudUploadAlt,
    FaExclamationCircle,
    FaExternalLinkAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import {
    useGetHomeHeroQuery,
    useUpdateHomeHeroMutation,
} from '@/features/company/api/companyApi';
import { HomeHero } from '@/features/company/types';

import PageMeta from '@/components/common/PageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Link } from 'react-router';

interface HomeHeroForm extends Omit<HomeHero, 'image' | 'id'> {
    image?: FileList | string | null;
}

export const HomeHeroPage = () => {
    const {
        data: response,
        isLoading: isLoadingData,
        isError,
    } = useGetHomeHeroQuery();
    const [updateHero, { isLoading: isUpdating }] = useUpdateHomeHeroMutation();

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [deleteImageFlag, setDeleteImageFlag] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<HomeHeroForm>();

    const selectedFile = watch('image');

    useEffect(() => {
        if (response?.data) {
            reset({
                badge: response.data.badge || '',
                title: response.data.title || '',
                highlight: response.data.highlight || '',
                description: response.data.description || '',
            });
            setPreviewImage(response.data.image);
            setDeleteImageFlag(false);
        }
    }, [response, reset]);

    useEffect(() => {
        if (
            selectedFile &&
            typeof selectedFile !== 'string' &&
            selectedFile.length > 0
        ) {
            const file = selectedFile[0];
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
            setDeleteImageFlag(false);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [selectedFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (!file.type.startsWith('image/')) {
                    toast.error('Solo puedes subir archivos de imagen');
                    return;
                }
                setValue('image', files, { shouldValidate: true });
                const objectUrl = URL.createObjectURL(file);
                setPreviewImage(objectUrl);
                setDeleteImageFlag(false);
            }
        },
        [setValue]
    );

    const handleDeleteImageBtn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewImage(null);
        setDeleteImageFlag(true);
        setValue('image', null);
        toast('Imagen marcada para eliminar', { icon: '🗑️' });
    };

    const onSubmit = async (data: HomeHeroForm) => {
        try {
            const formData = new FormData();
            formData.append('badge', data.badge);
            formData.append('title', data.title);
            formData.append('highlight', data.highlight);
            formData.append('description', data.description);

            if (deleteImageFlag) {
                formData.append('delete_image', 'true');
            } else if (
                data.image &&
                typeof data.image !== 'string' &&
                data.image.length > 0
            ) {
                formData.append('image', data.image[0]);
            }

            await updateHero(formData).unwrap();
            toast.success('Portada actualizada correctamente');
            setDeleteImageFlag(false);
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar la portada');
        }
    };

    const InputField = ({
        label,
        name,
        icon: Icon,
        placeholder,
        hint,
        className,
        register,
        required = false,
        error,
        ...rest
    }: any) => (
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 ml-1 flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
                <div
                    className={`absolute top-1/2 -translate-y-1/2 left-0 pl-3 flex pointer-events-none transition-colors ${
                        error
                            ? 'text-red-400'
                            : 'text-orange-500/70 group-focus-within:text-orange-600'
                    }`}
                >
                    <Icon />
                </div>
                <input
                    type="text"
                    {...register}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 shadow-sm
                    ${
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/30'
                            : 'border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 focus:bg-orange-50/30'
                    }
                    ${className}`}
                    {...rest}
                />
            </div>
            {error ? (
                <p className="text-xs text-red-500 ml-1 flex items-center gap-1 font-medium animate-fade-in">
                    <FaExclamationCircle /> {error.message}
                </p>
            ) : (
                hint && (
                    <p className="text-xs text-slate-500 ml-1 italic flex items-center gap-1">
                        <FaInfoCircle size={10} className="text-blue-400" />{' '}
                        {hint}
                    </p>
                )
            )}
        </div>
    );

    const TextAreaField = ({
        label,
        name,
        icon: Icon,
        placeholder,
        rows = 4,
        hint,
        register,
        required = false,
        error,
        ...rest
    }: any) => (
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 ml-1 flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
                <div
                    className={`absolute top-3 left-0 pl-3 flex pointer-events-none transition-colors ${
                        error
                            ? 'text-red-400'
                            : 'text-orange-500/70 group-focus-within:text-orange-600'
                    }`}
                >
                    <Icon />
                </div>
                <textarea
                    {...register}
                    rows={rows}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed shadow-sm
                    ${
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/30'
                            : 'border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 focus:bg-orange-50/30'
                    }`}
                    {...rest}
                />
            </div>
            {error ? (
                <p className="text-xs text-red-500 ml-1 flex items-center gap-1 font-medium animate-fade-in">
                    <FaExclamationCircle /> {error.message}
                </p>
            ) : (
                hint && (
                    <p className="text-xs text-slate-500 ml-1 italic flex items-center gap-1">
                        <FaInfoCircle size={10} className="text-blue-400" />{' '}
                        {hint}
                    </p>
                )
            )}
        </div>
    );

    if (isLoadingData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-orange-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-10 text-center text-red-500">
                Error al cargar datos. Por favor recarga la página.
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="PORTADA INICIO"
                description="Gestión del Hero (Banner Principal)"
            />

            <div className="w-full animate-fade-in-up pb-20">
                <PageHeader
                    title="Gestión: Portada Inicio"
                    breadcrumbs={['Administración', 'Empresa', 'Portada']}
                    icon={FaImage}
                >
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold shadow-sm hover:bg-slate-50 hover:text-orange-600 hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-300"
                            title="Ver página de inicio en nueva pestaña"
                        >
                            <FaExternalLinkAlt size={14} />
                            <span className="hidden sm:inline">Ver en Web</span>
                        </Link>

                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isUpdating}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-orange-600 hover:shadow-orange-600/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaSave size={14} />
                            )}
                            <span>Guardar Cambios</span>
                        </button>
                    </div>
                </PageHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 border-t-4 border-t-orange-400">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4 flex items-center gap-3">
                                <span className="bg-orange-100 text-orange-600 p-2.5 rounded-xl shadow-sm">
                                    <FaAlignLeft size={18} />
                                </span>
                                Textos Principales
                            </h2>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Etiqueta Superior (Badge)"
                                        icon={FaHighlighter}
                                        placeholder="Ej: Innovación y Solidez"
                                        hint="Texto pequeño encima del título."
                                        register={register('badge', {
                                            required:
                                                'La etiqueta es obligatoria',
                                        })}
                                        error={errors.badge}
                                        required
                                    />
                                    <InputField
                                        label="Título Principal"
                                        icon={FaHeading}
                                        placeholder="Ej: Construimos"
                                        hint="Primera línea del título grande."
                                        register={register('title', {
                                            required:
                                                'El título es obligatorio',
                                        })}
                                        error={errors.title}
                                        required
                                    />
                                </div>

                                <InputField
                                    label="Texto Destacado (Gradiente)"
                                    icon={FaHighlighter}
                                    placeholder="Ej: El Futuro."
                                    className="font-bold text-orange-600"
                                    hint="Segunda línea con efecto de color degradado."
                                    register={register('highlight', {
                                        required:
                                            'El texto destacado es obligatorio',
                                    })}
                                    error={errors.highlight}
                                    required
                                />

                                <TextAreaField
                                    label="Descripción Corta"
                                    icon={FaAlignLeft}
                                    placeholder="Ej: Transformamos visiones en estructuras tangibles..."
                                    rows={4}
                                    hint="Párrafo explicativo debajo del título."
                                    register={register('description', {
                                        required:
                                            'La descripción es obligatoria',
                                    })}
                                    error={errors.description}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 border-t-4 border-t-blue-400 h-full flex flex-col">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4 flex items-center gap-3">
                                <span className="bg-blue-100 text-blue-600 p-2.5 rounded-xl shadow-sm">
                                    <FaImage size={18} />
                                </span>
                                Imagen de Fondo
                            </h2>

                            <div className="flex flex-col gap-6 flex-grow">
                                <div className="relative w-full aspect-video md:aspect-square lg:aspect-video">
                                    {previewImage && !deleteImageFlag && (
                                        <button
                                            type="button"
                                            onClick={handleDeleteImageBtn}
                                            className="absolute top-3 right-3 z-30 bg-white text-red-500 p-2.5 rounded-xl shadow-lg border border-red-50 hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all duration-200"
                                            title="Eliminar imagen"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    )}

                                    <label
                                        htmlFor="image-upload"
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`
                                            w-full h-full rounded-2xl overflow-hidden border-2 border-dashed
                                            flex flex-col items-center justify-center cursor-pointer relative transition-all duration-300
                                            ${
                                                isDragging
                                                    ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-xl'
                                                    : 'border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-slate-100'
                                            }
                                        `}
                                    >
                                        {previewImage && !deleteImageFlag ? (
                                            <>
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover pointer-events-none"
                                                />
                                                <div
                                                    className={`
                                                        absolute inset-0 bg-black/50 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center
                                                        ${isDragging ? 'opacity-100' : 'opacity-0 hover:opacity-100'}
                                                    `}
                                                >
                                                    {isDragging ? (
                                                        <>
                                                            <FaCloudUploadAlt
                                                                size={48}
                                                                className="animate-bounce mb-2"
                                                            />
                                                            <span className="font-bold text-lg">
                                                                ¡Suelta aquí!
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaUpload
                                                                size={32}
                                                                className="mb-2"
                                                            />
                                                            <span className="text-xs font-bold">
                                                                Clic o arrastra
                                                                para cambiar
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center pointer-events-none">
                                                {isDragging ? (
                                                    <>
                                                        <FaCloudUploadAlt
                                                            size={60}
                                                            className="text-blue-500 animate-bounce mb-4"
                                                        />
                                                        <span className="text-blue-600 font-bold text-lg">
                                                            Suelta la imagen
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaImage
                                                            size={40}
                                                            className={`mb-3 ${deleteImageFlag ? 'text-red-300' : 'opacity-30'}`}
                                                        />
                                                        <span className="text-sm font-medium text-slate-600">
                                                            {deleteImageFlag
                                                                ? 'Marcada para eliminar'
                                                                : 'Arrastra tu imagen aquí'}
                                                        </span>
                                                        <span className="text-xs text-slate-400 mt-2">
                                                            o haz clic para
                                                            buscar
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </label>

                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...register('image')}
                                    />
                                </div>

                                <div className="mt-auto bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                                    <FaInfoCircle
                                        className="text-blue-500 mt-1 flex-shrink-0"
                                        size={18}
                                    />
                                    <div className="text-xs text-blue-800 leading-relaxed space-y-1">
                                        <p className="font-bold">
                                            Información de visualización:
                                        </p>
                                        <p>
                                            Esta imagen ocupará todo el fondo de
                                            la pantalla de inicio.
                                        </p>
                                        <p className="opacity-80">
                                            Recomendado: 1920x1080px (Alta
                                            calidad).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default HomeHeroPage;
