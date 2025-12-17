import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    IoClose,
    IoChevronBack,
    IoChevronForward,
    IoLocationSharp,
    IoBusiness,
    IoLayers,
    IoResize,
    IoConstruct,
} from 'react-icons/io5';
import { Project } from '@data/projectsData';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === project.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? project.images.length - 1 : prev - 1
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white transition-colors z-50 p-2 bg-black/50 rounded-full"
            >
                <IoClose size={30} />
            </button>

            {/* CONTENEDOR PRINCIPAL: Grid Responsive */}
            <div
                className="bg-brand-dark-900 w-full max-w-6xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- COLUMNA 1: GALERÍA DE IMÁGENES (65% del ancho en PC) --- */}
                <div className="relative w-full lg:w-[65%] h-[40vh] lg:h-auto bg-black flex flex-col justify-center">
                    {/* Imagen Principal */}
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        <motion.img
                            key={currentImageIndex}
                            src={project.images[currentImageIndex]}
                            alt={project.title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-cover"
                        />

                        {/* Flechas de Navegación */}
                        {project.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-400 text-white p-2 rounded-full transition-all"
                                >
                                    <IoChevronBack size={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-400 text-white p-2 rounded-full transition-all"
                                >
                                    <IoChevronForward size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Miniaturas (Puntos o fotos pequeñas abajo) */}
                    {project.images.length > 1 && (
                        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 px-4">
                            {project.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        currentImageIndex === idx
                                            ? 'bg-brand-400 w-6'
                                            : 'bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* --- COLUMNA 2: FICHA TÉCNICA (35% del ancho en PC) --- */}
                <div className="w-full lg:w-[35%] p-8 overflow-y-auto bg-brand-dark-800 border-l border-brand-dark-700">
                    <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-2">
                        {project.title}
                    </h2>

                    <div className="w-16 h-1 bg-brand-400 mb-6"></div>

                    {/* Lista de Detalles */}
                    <div className="space-y-6">
                        <DetailItem
                            icon={<IoLocationSharp />}
                            label="Ubicación"
                            value={project.location}
                        />

                        <DetailItem
                            icon={<IoBusiness />}
                            label="Edificación"
                            value={project.buildingType}
                        />

                        {project.levels && (
                            <DetailItem
                                icon={<IoLayers />}
                                label="Niveles"
                                value={project.levels}
                            />
                        )}

                        {project.area && (
                            <DetailItem
                                icon={<IoResize />}
                                label="Área Construida"
                                value={project.area}
                            />
                        )}

                        {project.status && (
                            <DetailItem
                                icon={<IoConstruct />}
                                label="Estado de Obra"
                                value={project.status}
                                highlight // Opción para resaltar el estado
                            />
                        )}

                        {/* Datos Extras (Descripción) */}
                        {project.extraInfo && (
                            <div className="pt-4 border-t border-brand-dark-600 mt-4">
                                <h4 className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-2">
                                    Datos Extras
                                </h4>
                                <p className="text-brand-dark-200 text-sm leading-relaxed font-light">
                                    {project.extraInfo}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Componente auxiliar para cada fila de detalle (para no repetir código)
const DetailItem = ({ icon, label, value, highlight = false }: any) => (
    <div className="flex items-start gap-4">
        <div className="text-brand-400 text-xl mt-1">{icon}</div>
        <div>
            <h4 className="text-brand-dark-400 text-xs font-bold uppercase tracking-widest mb-0.5">
                {label}
            </h4>
            <p
                className={`text-sm font-medium ${highlight ? 'text-brand-400' : 'text-white'}`}
            >
                {value}
            </p>
        </div>
    </div>
);

export default ProjectModal;
