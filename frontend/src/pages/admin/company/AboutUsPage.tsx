import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
    FaSave,
    FaSpinner,
    FaInfoCircle,
    FaImage,
    FaUpload,
    FaAlignLeft,
    FaBullseye,
    FaLightbulb,
    FaTrash,
    FaCloudUploadAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import {
    useGetAboutUsQuery,
    useUpdateAboutUsMutation,
} from '@/features/company/api/companyApi';
import { AboutUs } from '@/features/company/types';

import PageMeta from '@components/common/PageMeta';
import { PageHeader } from '@components/ui/PageHeader';

interface AboutUsForm extends Omit<AboutUs, 'image'> {
    image?: FileList | string | null;
}

export const AboutUsPage = () => {
    const {
        data: response,
        isLoading: isLoadingData,
        isError,
    } = useGetAboutUsQuery();
    const [updateAboutUs, { isLoading: isUpdating }] =
        useUpdateAboutUsMutation();

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [deleteImageFlag, setDeleteImageFlag] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const { register, handleSubmit, reset, watch, setValue } =
        useForm<AboutUsForm>();
    const selectedFile = watch('image');

    useEffect(() => {
        if (response?.data) {
            reset({
                description: response.data.description || '',
                mission: response.data.mission || '',
                vision: response.data.vision || '',
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

    const onSubmit = async (data: AboutUsForm) => {
        try {
            const formData = new FormData();
            formData.append('description', data.description);
            formData.append('mission', data.mission);
            formData.append('vision', data.vision);

            if (deleteImageFlag) {
                formData.append('delete_image', 'true');
            } else if (
                data.image &&
                typeof data.image !== 'string' &&
                data.image.length > 0
            ) {
                formData.append('image', data.image[0]);
            }

            await updateAboutUs(formData).unwrap();
            toast.success('Sección "Nosotros" actualizada');
            setDeleteImageFlag(false);
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar');
        }
    };

    const TextAreaField = ({
        label,
        name,
        icon: Icon,
        placeholder,
        rows = 4,
        hint,
    }: any) => (
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 ml-1 flex items-center gap-2">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute top-3 left-0 pl-3 flex pointer-events-none text-orange-500/70 group-focus-within:text-orange-600 transition-colors">
                    <Icon />
                </div>
                <textarea
                    {...register(name)}
                    rows={rows}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-orange-50/30 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed shadow-sm"
                />
            </div>
            {hint && (
                <p className="text-xs text-slate-500 ml-1 italic flex items-center gap-1">
                    <FaInfoCircle size={10} className="text-blue-400" /> {hint}
                </p>
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
                Error al cargar datos.
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="NOSOTROS"
                description="Gestión de Misión y Visión"
            />

            <div className="w-full animate-fade-in-up pb-20">
                <PageHeader
                    title="Gestión: Nosotros"
                    breadcrumbs={[
                        'Administración',
                        'Contenido Web',
                        'Nosotros',
                    ]}
                    icon={FaInfoCircle}
                >
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isUpdating}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-orange-600 hover:shadow-orange-600/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isUpdating ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <FaSave size={14} />
                        )}
                        <span>Guardar Cambios</span>
                    </button>
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
                                <TextAreaField
                                    label="Historia / Quiénes Somos"
                                    name="description"
                                    icon={FaAlignLeft}
                                    placeholder="Ej: Somos una empresa constructora fundada en Arequipa..."
                                    rows={5}
                                    hint="Aparecerá en la sección principal de la página web."
                                />

                                <div className="grid grid-cols-1 gap-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                    <TextAreaField
                                        label="Nuestra Misión"
                                        name="mission"
                                        icon={FaBullseye}
                                        placeholder="Ej: Ofrecer soluciones inmobiliarias innovadoras..."
                                        rows={3}
                                        hint="El propósito fundamental de la empresa."
                                    />
                                    <TextAreaField
                                        label="Nuestra Visión"
                                        name="vision"
                                        icon={FaLightbulb}
                                        placeholder="Ej: Ser la constructora líder en el sur del país..."
                                        rows={3}
                                        hint="Hacia dónde se dirige la empresa en el futuro."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 border-t-4 border-t-blue-400 h-full flex flex-col">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4 flex items-center gap-3">
                                <span className="bg-blue-100 text-blue-600 p-2.5 rounded-xl shadow-sm">
                                    <FaImage size={18} />
                                </span>
                                Imagen de Portada
                            </h2>

                            <div className="flex flex-col gap-6 flex-grow">
                                <div className="relative w-full aspect-[3/4] md:aspect-square lg:aspect-[3/4]">
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
                                            Esta imagen aparecerá{' '}
                                            <span className="font-semibold">
                                                fija a la izquierda
                                            </span>{' '}
                                            en la sección "Nosotros".
                                        </p>
                                        <p className="opacity-80">
                                            Sugerido: Formato vertical
                                            (JPG/PNG).
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

export default AboutUsPage;
