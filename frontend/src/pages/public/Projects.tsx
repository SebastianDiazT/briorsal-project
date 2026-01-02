import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProjects } from '@store/slices/projectSlice';
import { fetchCategories } from '@store/slices/categorySlice';
import { PublicProjectCard } from '@features/projects/components/PublicProjectCard';
import { FaBuilding, FaFilter } from 'react-icons/fa';
import PageMeta from '@components/common/PageMeta';

const Projects = () => {
    const dispatch = useAppDispatch();
    const { projects, loading } = useAppSelector((state) => state.projects);
    const { categories } = useAppSelector((state) => state.categories);

    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>(
        'all'
    );

    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchCategories());
    }, [dispatch]);

    // Filtrado
    const filteredProjects =
        selectedCategory === 'all'
            ? projects
            : projects.filter((p) => p.category === selectedCategory);

    return (
        <>
            <PageMeta
                title="Nuestros Proyectos"
                description="Explora nuestro portafolio de construcción y diseño."
            />

            {/* --- HERO SECTION --- */}
            <div className="bg-slate-900 relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-brand-600/10 pattern-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-3 bg-brand-500/20 rounded-full mb-6 animate-fade-in-up">
                        <FaBuilding className="text-brand-400 text-2xl" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up delay-100">
                        Nuestro{' '}
                        <span className="text-brand-500">Portafolio</span>
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        Descubre la calidad y dedicación en cada uno de nuestros
                        proyectos. Desde diseños residenciales hasta grandes
                        edificaciones comerciales.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* --- FILTROS --- */}
                <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up delay-300">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                            selectedCategory === 'all'
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-2 ring-brand-600 ring-offset-2'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        Todos
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                                selectedCategory === cat.id
                                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-2 ring-brand-600 ring-offset-2'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* --- GRID DE PROYECTOS --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-96 bg-slate-100 rounded-2xl animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                        {filteredProjects.map((project) => (
                            <PublicProjectCard
                                key={project.id}
                                project={project}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                        <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
                            <FaFilter className="text-4xl text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">
                            No hay proyectos en esta categoría
                        </h3>
                        <p className="text-slate-500 mt-2">
                            Intenta seleccionar otra categoría o ver todos los
                            proyectos.
                        </p>
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className="mt-6 text-brand-600 font-bold hover:underline"
                        >
                            Ver todos los proyectos
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Projects;
