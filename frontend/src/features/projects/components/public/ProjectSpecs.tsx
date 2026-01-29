import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    FaBuilding,
    FaRulerCombined,
    FaLayerGroup,
    FaCalendarAlt,
    FaWhatsapp,
    FaRegEnvelope,
    FaCheckCircle,
    FaInfoCircle,
} from 'react-icons/fa';
import { Project } from '@/features/projects/types';
import { useGetCompanyInfoQuery } from '@/features/company/api/companyApi';

export const ProjectSpecs: React.FC<{ project: Project }> = ({ project }) => {
    const { data: companyResponse } = useGetCompanyInfoQuery();
    const companyInfo = companyResponse?.data;
    const whatsappLink = companyInfo?.whatsapp;

    const extraSpecs = useMemo(() => {
        if (!project.extra_info) return {};

        if (typeof project.extra_info === 'object') {
            return project.extra_info;
        }

        if (typeof project.extra_info === 'string') {
            try {
                return JSON.parse(project.extra_info);
            } catch (error) {
                console.error('Error al leer extra_info:', error);
                return {};
            }
        }
        return {};
    }, [project.extra_info]);

    const hasExtraSpecs = Object.keys(extraSpecs).length > 0;

    return (
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 sticky top-24 shadow-sm animate-fade-in">
            <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-3">
                <span className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <FaInfoCircle size={18} />
                </span>
                Ficha Técnica
            </h3>

            <div className="space-y-4">
                <SpecRow
                    label="Tipo de Proyecto"
                    value={project.service_type}
                    icon={FaBuilding}
                />
                <SpecRow
                    label="Área"
                    value={project.area ? `${project.area} m²` : null}
                    icon={FaRulerCombined}
                />
                <SpecRow
                    label="Niveles"
                    value={project.levels}
                    icon={FaLayerGroup}
                />
                <SpecRow
                    label="Año de Ejecución"
                    value={project.year}
                    icon={FaCalendarAlt}
                />

                {hasExtraSpecs && (
                    <div className="h-px bg-slate-200 my-6"></div>
                )}

                {hasExtraSpecs && (
                    <div className="space-y-4">
                        {Object.entries(extraSpecs).map(([key, value]) => (
                            <SpecRow
                                key={key}
                                label={key.replace(/_/g, ' ')}
                                value={value}
                                icon={FaCheckCircle}
                                isExtra={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 text-center mb-2">
                    ¿Te interesa este proyecto?
                </h4>

                {whatsappLink && (
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 transform hover:-translate-y-0.5 group"
                    >
                        <FaWhatsapp className="text-xl group-hover:scale-110 transition-transform" />
                        <span>Cotizar por WhatsApp</span>
                    </a>
                )}

                <Link
                    to="/contacto"
                    className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-800/20 transform hover:-translate-y-0.5 group"
                >
                    <FaRegEnvelope className="text-lg group-hover:scale-110 transition-transform" />
                    <span>Contactar Formalmente</span>
                </Link>
            </div>
        </div>
    );
};

const SpecRow = ({
    label,
    value,
    icon: Icon,
    isExtra = false,
}: {
    label: string;
    value: any;
    icon: any;
    isExtra?: boolean;
}) => {
    if (!value || value === 'null' || value === 'undefined') return null;

    return (
        <div className="flex justify-between items-start text-sm group">
            <span
                className={`font-medium flex items-center gap-2.5 transition-colors ${isExtra ? 'text-slate-600' : 'text-slate-500'}`}
            >
                <Icon
                    className={`${isExtra ? 'text-orange-400' : 'text-slate-400'} group-hover:text-orange-500 transition-colors mt-0.5`}
                    size={isExtra ? 10 : 14}
                />
                <span className="capitalize">{label}</span>
            </span>
            <span className="font-bold text-slate-900 text-right max-w-[50%] leading-tight">
                {String(value)}
            </span>
        </div>
    );
};
