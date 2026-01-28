import React from 'react';
import {
    FaBuilding,
    FaLayerGroup,
    FaRulerCombined,
    FaRulerVertical,
} from 'react-icons/fa';
import { ProjectCard } from '@/features/projects/types';
import { RelatedProjectsManager } from '../partials/RelatedProjectsManager';
import { AttributeManager, AttributeRow } from '../partials/AttributeManager';
import { SingleFileUpload } from '../partials/SingleFileUpload';

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
}

export const DetailsTab: React.FC<DetailsTabProps> = (props) => {
    const inputClass =
        'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm placeholder:text-slate-400';
    const labelClass =
        'block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1';

    return (
        <div className="animate-fade-in space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-800">
                        Descripción y Banner
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Detalles que se muestran al abrir el proyecto.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7">
                        <label className={labelClass}>
                            Historia del Proyecto
                        </label>
                        <textarea
                            value={props.description}
                            onChange={(e) =>
                                props.setDescription(e.target.value)
                            }
                            rows={9}
                            className={`${inputClass} resize-none leading-relaxed`}
                            placeholder="Describe el concepto..."
                        />
                    </div>

                    <div className="lg:col-span-5">
                        <SingleFileUpload
                            label="Banner Panorámico"
                            subLabel="Formato horizontal amplio"
                            previewUrl={props.bannerPreview}
                            file={props.bannerImage}
                            onChange={props.onBannerChange}
                            onRemove={props.onBannerRemove}
                            aspectRatioClass="h-56"
                            isBanner={true}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6 border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <FaRulerCombined className="text-orange-500" /> Ficha
                        Técnica
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Datos estructurales.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className={labelClass}>Tipología</label>
                        <div className="relative">
                            <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={props.serviceType}
                                onChange={(e) =>
                                    props.setServiceType(e.target.value)
                                }
                                className={`${inputClass} pl-10`}
                                placeholder="Ej: Multifamiliar"
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Niveles</label>
                        <div className="relative">
                            <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={props.levels}
                                onChange={(e) =>
                                    props.setLevels(e.target.value)
                                }
                                className={`${inputClass} pl-10`}
                                placeholder="Ej: 15 Pisos"
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Área (m²)</label>
                        <div className="relative">
                            <FaRulerVertical className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={props.area}
                                onChange={(e) => props.setArea(e.target.value)}
                                className={`${inputClass} pl-10`}
                                placeholder="Ej: 1200"
                            />
                        </div>
                    </div>
                </div>
                <AttributeManager
                    attributes={props.attributes}
                    setAttributes={props.setAttributes}
                />
            </div>

            <RelatedProjectsManager
                availableProjects={props.availableRelatedProjects}
                selectedIds={props.relatedProjectIds}
                onToggle={props.toggleRelatedProject}
            />
        </div>
    );
};
