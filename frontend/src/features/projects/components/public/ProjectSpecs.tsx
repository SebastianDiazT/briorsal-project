import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaBuilding,
    FaRulerCombined,
    FaLayerGroup,
    FaCalendarAlt,
} from 'react-icons/fa';
import { Project } from '@features/projects/types';

export const ProjectSpecs: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 sticky top-24">
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

                <div className="h-px bg-slate-200 my-4"></div>

                {project.extra_info &&
                    Object.entries(project.extra_info).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex justify-between items-start text-sm"
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

            <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-3 text-center">
                    ¿Te interesa un proyecto así?
                </h4>
                <Link
                    to="/contacto"
                    className="block w-full py-3.5 bg-slate-900 text-white text-center font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-600/30 transform hover:-translate-y-1"
                >
                    Contáctanos
                </Link>
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
        <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-500 flex items-center gap-2">
                <Icon className="text-slate-400" size={12} /> {label}
            </span>
            <span className="font-bold text-slate-800">{value}</span>
        </div>
    );
};
