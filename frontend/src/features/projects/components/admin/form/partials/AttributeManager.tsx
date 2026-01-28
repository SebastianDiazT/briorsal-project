import React from 'react';
import { FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';

export interface AttributeRow {
    key: string;
    value: string;
}

interface AttributeManagerProps {
    attributes: AttributeRow[];
    setAttributes: (attrs: AttributeRow[]) => void;
}

export const AttributeManager: React.FC<AttributeManagerProps> = ({
    attributes,
    setAttributes,
}) => {
    return (
        <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FaInfoCircle className="text-slate-400" /> Ficha Técnica
                    Adicional
                </h4>
                <button
                    type="button"
                    onClick={() =>
                        setAttributes([...attributes, { key: '', value: '' }])
                    }
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-slate-700 transition-colors"
                >
                    <FaPlus /> Agregar campo
                </button>
            </div>
            <div className="space-y-4">
                {attributes.map((attr, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-fade-in relative group"
                    >
                        <div className="flex-1">
                            <span className="md:hidden block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                Nombre del Atributo
                            </span>
                            <input
                                type="text"
                                value={attr.key}
                                onChange={(e) => {
                                    const n = [...attributes];
                                    n[idx].key = e.target.value;
                                    setAttributes(n);
                                }}
                                placeholder="Ej: Arquitecto"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none focus:border-orange-500"
                            />
                        </div>
                        <div className="flex-1">
                            <span className="md:hidden block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                Valor / Detalle
                            </span>
                            <input
                                type="text"
                                value={attr.value}
                                onChange={(e) => {
                                    const n = [...attributes];
                                    n[idx].value = e.target.value;
                                    setAttributes(n);
                                }}
                                placeholder="Ej: Juan Pérez"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none focus:border-orange-500"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setAttributes(
                                    attributes.filter((_, i) => i !== idx)
                                )
                            }
                            className="absolute -top-2 -right-2 md:static p-2 bg-red-50 text-red-500 rounded-full md:rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
