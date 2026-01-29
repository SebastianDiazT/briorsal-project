import React from 'react';
import {
    FaBuilding,
    FaLayerGroup,
    FaRulerCombined,
    FaRulerVertical,
    FaAlignLeft,
    FaImage,
    FaExclamationCircle,
    FaListUl,
    FaProjectDiagram,
    FaBookOpen,
    FaInfoCircle,
} from 'react-icons/fa';
import { ProjectCard } from '@/features/projects/types';
import { RelatedProjectsManager } from '../partials/RelatedProjectsManager';
import { AttributeManager, AttributeRow } from '../partials/AttributeManager';
import { SingleFileUpload } from '../partials/SingleFileUpload';
import { FileLimitInfo } from '../partials/FileLimitInfo';

interface DetailsTabProps {
    description: string;
    setDescription: (v: string) => void;
    serviceType: string;
    setServiceType: (v: string) => void;
    levels: string;
    setLevels: (v: string) => void;
    area: string;
    setArea: (v: string) => void;
    attributes: AttributeRow[];
    setAttributes: (v: AttributeRow[]) => void;

    bannerImage: File | null;
    bannerPreview: string;
    onBannerChange: (file: File) => void;
    onBannerRemove: () => void;

    availableRelatedProjects: ProjectCard[];
    relatedProjectIds: string[];
    toggleRelatedProject: (id: string) => void;

    errors?: Record<string, string>;
}

const FormField = ({
    label,
    icon: Icon,
    children,
    error,
    description,
}: any) => (
    <div className="space-y-1.5 group h-full flex flex-col">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-orange-600 transition-colors mb-1">
            {Icon && (
                <Icon className="text-slate-400 group-focus-within:text-orange-500" />
            )}
            {label}
        </label>

        <div className="relative flex-1">{children}</div>

        {description && !error && (
            <p className="text-[10px] text-slate-400 ml-1 mt-1 leading-relaxed">
                {description}
            </p>
        )}

        {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-fade-in-up mt-1">
                <FaExclamationCircle /> {error}
            </div>
        )}
    </div>
);

export const DetailsTab: React.FC<DetailsTabProps> = (props) => {
    const inputClass = (hasError?: boolean) => `
        w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all duration-200 font-medium text-slate-700 placeholder-slate-400 text-sm
        ${
            hasError
                ? 'border-red-300 focus:border-red-500 bg-red-50/20'
                : 'border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-slate-300 shadow-sm'
        }
    `;

    const handleViewProject = (slug: string) => {
        window.open(`/proyectos/${slug}`, '_blank');
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-8 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <FaBookOpen className="text-orange-500 text-lg" />
                        Detalles del Proyecto
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Información narrativa y especificaciones técnicas
                        básicas.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-7 h-full flex flex-col">
                        <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-50">
                            <FaAlignLeft className="text-slate-400" />
                            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                                Historia y Concepto
                            </h4>
                        </div>

                        <FormField
                            label=""
                            icon={null}
                            error={props.errors?.description}
                            description="Redacta una narrativa atractiva. Menciona la inspiración, el entorno y el valor único del proyecto."
                        >
                            <textarea
                                value={props.description}
                                onChange={(e) =>
                                    props.setDescription(e.target.value)
                                }
                                rows={14}
                                className={`${inputClass(!!props.errors?.description)} resize-none leading-relaxed h-full min-h-[300px]`}
                                placeholder="Ej: Ubicado en el corazón financiero, este proyecto nace de la necesidad de conectar naturaleza y modernidad..."
                            />
                        </FormField>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-50">
                            <FaRulerCombined className="text-slate-400" />
                            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                                Ficha Técnica Rápida
                            </h4>
                        </div>

                        <div className="space-y-5">
                            <FormField
                                label="Tipología"
                                icon={FaBuilding}
                                error={props.errors?.service_type}
                                description="Ej: Multifamiliar, Oficinas, Comercial."
                            >
                                <input
                                    type="text"
                                    value={props.serviceType}
                                    onChange={(e) =>
                                        props.setServiceType(e.target.value)
                                    }
                                    className={inputClass(
                                        !!props.errors?.service_type
                                    )}
                                    placeholder="Ingresa el tipo..."
                                />
                            </FormField>

                            <FormField
                                label="Niveles / Pisos"
                                icon={FaLayerGroup}
                                error={props.errors?.levels}
                                description="Ej: 15 Pisos + 3 Sótanos + Azotea."
                            >
                                <input
                                    type="text"
                                    value={props.levels}
                                    onChange={(e) =>
                                        props.setLevels(e.target.value)
                                    }
                                    className={inputClass(
                                        !!props.errors?.levels
                                    )}
                                    placeholder="Ingresa los niveles..."
                                />
                            </FormField>

                            <FormField
                                label="Área Construida"
                                icon={FaRulerVertical}
                                error={props.errors?.area}
                                description="Superficie total en metros cuadrados."
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={props.area}
                                        onChange={(e) =>
                                            props.setArea(e.target.value)
                                        }
                                        className={`${inputClass(!!props.errors?.area)} pr-10`}
                                        placeholder="Ej: 1250.50"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                        m²
                                    </span>
                                </div>
                            </FormField>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <FaListUl className="text-orange-500 text-lg" />
                        Especificaciones Adicionales
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Agrega detalles personalizados (Ej: "Cocheras: 2",
                        "Acabados: Mármol", "Entrega: Inmediata").
                    </p>
                </div>

                <AttributeManager
                    attributes={props.attributes}
                    setAttributes={props.setAttributes}
                />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <FaImage className="text-orange-500 text-lg" />
                        Banner Panorámico
                    </h3>

                    <div className="mt-2 text-xs text-slate-500 space-y-2">
                        <p>
                            Esta imagen se utilizará como{' '}
                            <strong>cabecera inmersiva</strong> en la página de
                            detalle del proyecto.
                        </p>
                        <p className="flex items-center gap-2 text-orange-700 bg-orange-50 w-fit px-3 py-1.5 rounded-lg border border-orange-100">
                            <FaInfoCircle size={12} className="shrink-0" />
                            <span>
                                Si no subes una imagen aquí, se usará la{' '}
                                <strong>Imagen de Portada</strong>{' '}
                                automáticamente.
                            </span>
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <div className="mb-4">
                        <SingleFileUpload
                            label=""
                            subLabel="Formato Horizontal Amplio (Recomendado 1920x600px)"
                            previewUrl={props.bannerPreview}
                            file={props.bannerImage}
                            onChange={props.onBannerChange}
                            onRemove={props.onBannerRemove}
                            aspectRatioClass="h-64"
                            error={props.errors?.banner_image}
                        />
                    </div>
                    <FileLimitInfo type="image" />
                </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <FaProjectDiagram className="text-orange-500 text-lg" />
                        Proyectos Relacionados
                    </h3>

                    <div className="mt-2 space-y-3">
                        <p className="text-xs text-slate-500">
                            Selecciona otros registros para sugerir al final de
                            la página.
                        </p>

                        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                            <FaInfoCircle
                                className="text-blue-500 shrink-0 mt-0.5"
                                size={14}
                            />
                            <p className="text-[11px] text-blue-800 leading-relaxed">
                                <strong>Caso de uso:</strong> Si tienes este
                                mismo proyecto registrado en dos categorías
                                diferentes (ej: una ficha para <em>Vivienda</em>{' '}
                                y otra para <em>Diseño de Interiores</em> con
                                fotos distintas), vincúlalos aquí para que el
                                visitante pueda navegar fácilmente entre ambas
                                versiones.
                            </p>
                        </div>
                    </div>
                </div>

                <RelatedProjectsManager
                    availableProjects={props.availableRelatedProjects}
                    selectedIds={props.relatedProjectIds}
                    onToggle={props.toggleRelatedProject}
                    onView={handleViewProject}
                />
            </div>
        </div>
    );
};
