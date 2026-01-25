import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaBuilding,
    FaRulerCombined,
    FaLayerGroup,
    FaCalendarAlt,
    FaWhatsapp,
    FaRegEnvelope,
} from 'react-icons/fa';
import { Project } from '@/features/projects/types';
import { useGetCompanyInfoQuery } from '@/features/company/api/companyApi';

export const ProjectSpecs: React.FC<{ project: Project }> = ({ project }) => {
    const { data: companyResponse } = useGetCompanyInfoQuery();
    const companyInfo = companyResponse?.data;


    const phoneNumber = companyInfo?.whatsapp;
    const whatsappMessage = `Hola Briorsal, me interesa el proyecto *${project.name}* y quisiera más información.`;

    const whatsappLink = phoneNumber
        ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
        : null;

    return (
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 sticky top-24 shadow-sm">
            <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                <FaBuilding className="text-orange-500" /> Ficha Técnica
            </h3>

            <div className="space-y-4">
                <SpecRow
                    label="Tipo"
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
                    label="Año"
                    value={project.year}
                    icon={FaCalendarAlt}
                />

                <div className="h-px bg-slate-200 my-6"></div>

                {project.extra_info &&
                    Object.entries(project.extra_info).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex justify-between items-start text-sm py-1"
                        >
                            <span className="font-medium text-slate-500 capitalize">
                                {key}
                            </span>
                            <span className="font-bold text-slate-800 text-right max-w-[60%]">
                                {String(value)}
                            </span>
                        </div>
                    ))}

                {(!project.extra_info ||
                    Object.keys(project.extra_info).length === 0) && (
                    <p className="text-sm text-slate-400 italic text-center py-2">
                        No hay especificaciones extra.
                    </p>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-3">
                <h4 className="font-bold text-sm text-slate-900 text-center mb-2">
                    ¿Te interesa este proyecto?
                </h4>

                {whatsappLink && (
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 transform hover:-translate-y-0.5"
                    >
                        <FaWhatsapp className="text-xl" />
                        <span>Cotizar por WhatsApp</span>
                    </a>
                )}

                <Link
                    to="/contacto"
                    className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-slate-900 hover:shadow-lg hover:shadow-slate-800/20 transform hover:-translate-y-0.5"
                >
                    <FaRegEnvelope className="text-lg" />
                    <span>Ir a Contacto</span>
                </Link>

                <p className="text-center text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wide">
                    Respuesta inmediata
                </p>
            </div>
        </div>
    );
};

const SpecRow = ({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: any;
    icon: any;
}) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center text-sm group">
            <span className="font-medium text-slate-500 flex items-center gap-2 group-hover:text-slate-700 transition-colors">
                <Icon
                    className="text-slate-400 group-hover:text-orange-500 transition-colors"
                    size={12}
                />{' '}
                {label}
            </span>
            <span className="font-bold text-slate-800">{value}</span>
        </div>
    );
};
