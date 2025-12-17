import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageMeta from '@components/common/PageMeta';
import FadeIn from '@components/common/FadeIn';
import ProjectModal from '@components/ui/ProjectModal';
import { projectsData, Project } from '@data/projectsData';

// Categorías actualizadas según tus CSVs
const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'vivienda', label: 'Viviendas' },
    { id: 'departamento', label: 'Departamentos' },
    { id: 'comercio', label: 'Comercios' },
    { id: 'estructura', label: 'Estructuras' },
    { id: 'interiores', label: 'Interiores' }, // Nueva categoría
];

const Projects = () => {
    const [activeCategory, setActiveCategory] = useState('todos');
    // Estado para controlar qué proyecto está seleccionado (si es null, el modal está cerrado)
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );

    const filteredProjects = projectsData.filter((project) =>
        activeCategory === 'todos' ? true : project.category === activeCategory
    );

    return (
        <>
            <PageMeta title="PROYECTOS – BRIORSAL" description="Portafolio" />

            <div className="min-h-screen bg-brand-dark-900 text-white pb-20">
                {/* Header ... (Igual que antes) ... */}
                <div className="bg-brand-dark-800 pt-32 pb-16 px-4 text-center border-b border-brand-dark-600">
                    <FadeIn direction="down">
                        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-4">
                            Nuestros{' '}
                            <span className="text-brand-400">Proyectos</span>
                        </h1>
                    </FadeIn>
                </div>

                {/* Filtros ... (Igual que antes) ... */}
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-5 py-2 rounded-full border text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ${
                                    activeCategory === cat.id
                                        ? 'bg-brand-400 border-brand-400 text-white'
                                        : 'border-brand-dark-600 text-brand-dark-200 hover:border-brand-400'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={project.id}
                                    className="group cursor-pointer"
                                    onClick={() => setSelectedProject(project)} // <--- ABRIR MODAL
                                >
                                    <div className="relative h-72 w-full overflow-hidden rounded-lg bg-gray-800 shadow-xl">
                                        {/* Mostramos la primera imagen como portada */}
                                        <img
                                            src={project.images[0]}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                        <div className="absolute bottom-0 left-0 p-6 w-full">
                                            <span className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-1 block">
                                                {
                                                    categories.find(
                                                        (c) =>
                                                            c.id ===
                                                            project.category
                                                    )?.label
                                                }
                                            </span>
                                            <h3 className="text-white text-xl font-bold uppercase group-hover:text-brand-400 transition-colors">
                                                {project.title}
                                            </h3>

                                            {/* Indicador de fotos múltiples */}
                                            {project.images.length > 1 && (
                                                <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    Ver {project.images.length}{' '}
                                                    fotos
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* --- MODAL (Renderizado Condicional) --- */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Projects;
