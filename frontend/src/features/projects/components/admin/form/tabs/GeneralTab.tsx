import React from 'react';
import {
    FaGlobeAmericas,
    FaCheckCircle,
    FaCalendarAlt,
    FaLayerGroup,
    FaStar,
    FaExclamationCircle,
    FaImage,
    FaPen,
    FaCheck,
    FaTag,
} from 'react-icons/fa';
import { Category } from '@/features/categories/types';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { SingleFileUpload } from '../partials/SingleFileUpload';
import { FileLimitInfo } from '../partials/FileLimitInfo';

interface GeneralTabProps {
    name: string;
    setName: (v: string) => void;
    location: string;
    setLocation: (v: string) => void;
    status: string;
    setStatus: (v: string) => void;
    year: string;
    setYear: (v: string) => void;
    isFeatured: boolean;
    setIsFeatured: (v: boolean) => void;
    categoryIds: string[];
    toggleCategory: (id: string) => void;
    categories: Category[];

    coverImage: File | null;
    coverPreview: string;
    onCoverChange: (file: File) => void;
    onCoverRemove: () => void;

    errors: Record<string, string>;
}

const FormField = ({
    label,
    required,
    icon: Icon,
    children,
    description,
    error,
}: {
    label: string;
    required?: boolean;
    icon?: React.ElementType;
    children: React.ReactNode;
    description?: string;
    error?: string;
}) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
            {Icon && <Icon className="text-slate-400" />}
            {label}
            {required && <span className="text-orange-500">*</span>}
        </label>
        {children}
        {error && (
            <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold animate-fade-in bg-red-50 p-2 rounded-lg border border-red-100">
                <FaExclamationCircle className="shrink-0" />
                <span>{error}</span>
            </div>
        )}
        {description && (
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed ml-1">
                {description}
            </p>
        )}
    </div>
);

export const GeneralTab: React.FC<GeneralTabProps> = (props) => {
    const statusOptions = [
        { value: 'en_proceso', label: 'En Ejecución (Obra en curso)' },
        { value: 'entregado', label: 'Entregado (Finalizado)' },
    ];

    const inputClass = (errKey?: string) => `
        w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all font-medium text-slate-700 placeholder-slate-400 text-sm focus:bg-white shadow-sm 
        ${errKey && props.errors[errKey] ? 'border-red-300 focus:border-red-500 bg-red-50/30' : 'border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'}
    `;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="mb-8 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <FaPen className="text-orange-500 text-lg" />
                    Ficha de Identidad
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Define la información esencial que identificará al proyecto
                    en todo el sistema.
                </p>
            </div>
            <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 flex flex-col gap-6">
                    <FormField
                        label="Nombre Oficial del Proyecto"
                        required
                        error={props.errors.name}
                        description="Este nombre se utilizará para generar el enlace permanente (slug)."
                    >
                        <input
                            type="text"
                            value={props.name}
                            onChange={(e) => props.setName(e.target.value)}
                            className={inputClass('name')}
                            placeholder="Ej: Residencial Mirador III"
                        />
                    </FormField>
                    <FormField
                        label="Ubicación Geográfica"
                        required
                        icon={FaGlobeAmericas}
                        error={props.errors.location}
                        description="Indica la Ciudad y el Distrito."
                    >
                        <input
                            type="text"
                            value={props.location}
                            onChange={(e) => props.setLocation(e.target.value)}
                            className={inputClass('location')}
                            placeholder="Ej: Yanahuara, Arequipa"
                        />
                    </FormField>

                    <FormField
                        label="Año de Ejecución"
                        icon={FaCalendarAlt}
                        description="Año de inicio o entrega."
                        error={props.errors.year}
                    >
                        <input
                            type="number"
                            value={props.year}
                            onChange={(e) => props.setYear(e.target.value)}
                            className={inputClass('year')}
                            placeholder="Ej: 2025"
                        />
                    </FormField>

                    <FormField
                        label="Estado Actual"
                        required
                        icon={FaCheckCircle}
                        error={props.errors.status}
                        description="Estado comercial."
                    >
                        <CustomSelect
                            value={props.status}
                            onChange={props.setStatus}
                            options={statusOptions}
                            placeholder="Seleccionar..."
                        />
                    </FormField>

                    <FormField
                        label="Categorías y Clasificación"
                        required
                        icon={FaLayerGroup}
                        error={props.errors.category_ids}
                        description="Selecciona una o más etiquetas."
                    >
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            {props.categories.length === 0 ? (
                                <div className="text-center py-4 text-slate-400 text-sm italic">
                                    No hay categorías disponibles. Crea una
                                    primero.
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {props.categories.map((cat) => {
                                        const isActive =
                                            props.categoryIds.includes(
                                                String(cat.id)
                                            );
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() =>
                                                    props.toggleCategory(
                                                        String(cat.id)
                                                    )
                                                }
                                                className={`
                                                    relative group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 select-none
                                                    ${
                                                        isActive
                                                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105'
                                                            : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-600 hover:bg-white hover:shadow-md'
                                                    }
                                                `}
                                            >
                                                <div
                                                    className={`
                                                    w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300
                                                    ${isActive ? 'bg-white text-orange-600' : 'bg-slate-100 text-slate-300 group-hover:bg-orange-100 group-hover:text-orange-500'}
                                                `}
                                                >
                                                    {isActive ? (
                                                        <FaCheck size={8} />
                                                    ) : (
                                                        <FaTag size={8} />
                                                    )}
                                                </div>
                                                {cat.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </FormField>

                    <div
                        className={`p-6 rounded-2xl border flex items-center justify-between cursor-pointer transition-all shadow-sm group ${props.isFeatured ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        onClick={() => props.setIsFeatured(!props.isFeatured)}
                    >
                        <div className="flex items-center gap-5">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors shadow-sm ${props.isFeatured ? 'bg-orange-500 text-white shadow-orange-500/30' : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'}`}
                            >
                                <FaStar />
                            </div>
                            <div>
                                <h4
                                    className={`font-bold text-base ${props.isFeatured ? 'text-orange-800' : 'text-slate-800'}`}
                                >
                                    Destacar Proyecto en Inicio
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Aparecerá en el carrusel principal ganando
                                    mayor visibilidad.
                                </p>
                            </div>
                        </div>

                        <div
                            className={`w-14 h-8 rounded-full relative transition-colors border shrink-0 ${props.isFeatured ? 'bg-orange-500 border-orange-500' : 'bg-slate-200 border-slate-200'}`}
                        >
                            <div
                                className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-sm transition-transform duration-300 ${props.isFeatured ? 'translate-x-6' : ''}`}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-5 h-full">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
                        <div className="mb-5">
                            <label className="flex items-center gap-3 text-sm font-bold text-slate-800 mb-2">
                                <span className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                                    <FaImage size={18} />
                                </span>
                                Imagen de Portada
                            </label>
                            <p className="text-xs text-slate-500 leading-relaxed pl-1">
                                Esta imagen es la que se mostrará en los{' '}
                                <strong>listados de proyectos</strong> y
                                tarjetas principales.
                            </p>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <SingleFileUpload
                                label=""
                                subLabel="Formato Vertical 3:4"
                                previewUrl={props.coverPreview}
                                file={props.coverImage}
                                onChange={props.onCoverChange}
                                onRemove={props.onCoverRemove}
                                aspectRatioClass="aspect-[3/4]"
                                error={props.errors.cover_image}
                            />
                        </div>

                        <div className="mt-4">
                            <FileLimitInfo type="image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
