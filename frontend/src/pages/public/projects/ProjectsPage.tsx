import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaArrowLeft,
    FaArrowRight,
    FaBuilding,
    FaMagnifyingGlass,
    FaFilter,
    FaHouse,
} from 'react-icons/fa6';

import { useGetProjectsQuery } from '@/features/projects/api/projectsApi';
import { useGetCategoriesQuery } from '@/features/categories/api/categoriesApi';

import PageMeta from '@/components/common/PageMeta';
import FadeIn from '@/components/common/FadeIn';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Project } from '@/features/projects/types';

import heroBgImg from '@/assets/projects/hero.png';

const PortfolioCard = ({
    project,
    delay,
}: {
    project: Project;
    delay: number;
}) => {
    const mainImage =
        project.images && project.images.length > 0
            ? project.images[0].image
            : null;

    return (
        <FadeIn delay={delay} direction="up">
            <Link
                to={`/proyectos/${project.slug}`}
                className="group relative block w-full overflow-hidden rounded-3xl bg-slate-900 shadow-lg aspect-[4/5] md:aspect-[3/4] hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
            >
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={project.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-600">
                        <FaBuilding size={40} />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-orange-600 rounded-full shadow-lg shadow-orange-600/20">
                        {project.category_name || 'General'}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1 leading-tight line-clamp-2">
                        {project.name}
                    </h3>
                    <p className="text-slate-300 text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 mt-2">
                        <FaBuilding className="text-orange-500" />{' '}
                        {project.location || 'Ubicación no especificada'}
                    </p>
                </div>
            </Link>
        </FadeIn>
    );
};

const ProjectSkeleton = () => (
    <div className="rounded-3xl aspect-[4/5] md:aspect-[3/4] bg-slate-100 animate-pulse relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full p-8 space-y-3">
            <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
            <div className="w-3/4 h-8 bg-slate-200 rounded-lg"></div>
        </div>
    </div>
);

const ProjectsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 9;

    const { data: categoriesResponse } = useGetCategoriesQuery({
        no_page: true,
    });
    const categoryOptions = [
        { value: '', label: 'Todas las Categorías' },
        ...(categoriesResponse?.data || []).map((cat: any) => ({
            value: cat.id,
            label: cat.name,
        })),
    ];

    const {
        data: response,
        isLoading,
        isFetching,
    } = useGetProjectsQuery({
        page,
        pageSize: PAGE_SIZE,
        category: selectedCategory,
        search,
    });

    const projects = response?.data || [];
    const meta = response?.meta;

    useEffect(() => {
        setPage(1);
    }, [selectedCategory, search]);

    const scrollToGrid = () => {
        const gridElement = document.getElementById('projects-grid');
        if (gridElement) {
            const yCoordinate =
                gridElement.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: yCoordinate, behavior: 'smooth' });
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        scrollToGrid();
    };

    const showPagination = meta && projects.length > 0 && meta.total_pages > 1;

    return (
        <>
            <PageMeta
                title="PORTAFOLIO – BRIORSAL CONSTRUCTORA"
                description="Explora nuestra colección de obras arquitectónicas y proyectos civiles."
            />

            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-40"
                        style={{ backgroundImage: `url(${heroBgImg})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-50"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn direction="down">
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">
                            <Link
                                to="/"
                                className="hover:text-white transition-colors flex items-center gap-1"
                            >
                                <FaHouse size={12} /> Inicio
                            </Link>
                            <span className="text-orange-500">/</span>
                            <span className="text-white">Portafolio</span>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.2}>
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight">
                            Nuestros <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                Proyectos.
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.4}>
                        <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                            Una muestra de nuestra capacidad técnica y visión
                            arquitectónica. Cada obra refleja nuestro compromiso
                            con la calidad.
                        </p>
                    </FadeIn>
                </div>
            </section>

            <section
                id="projects-grid"
                className="bg-slate-50 pb-24 min-h-screen -mt-20 relative z-20"
            >
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-16 transform -translate-y-8 relative z-30">
                        <div className="flex flex-col lg:flex-row gap-6 items-center">
                            <div className="w-full lg:flex-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaMagnifyingGlass className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, ubicación..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 h-[42px] bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all placeholder-slate-400"
                                />
                            </div>

                            <div className="w-full lg:w-1/3">
                                <CustomSelect
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    options={categoryOptions}
                                    placeholder="Filtrar por Categoría"
                                    icon={FaFilter}
                                />
                            </div>
                        </div>
                    </div>

                    {isLoading || isFetching ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <ProjectSkeleton key={i} />
                            ))}
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project, index) => (
                                <PortfolioCard
                                    key={project.id}
                                    project={project}
                                    delay={0.05 * index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 border-dashed">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaBuilding className="text-4xl text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                Sin resultados
                            </h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                No encontramos proyectos que coincidan con tu
                                búsqueda.
                            </p>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSelectedCategory('');
                                }}
                                className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-all"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}

                    {showPagination && meta && (
                        <div className="flex flex-col md:flex-row items-center justify-between mt-16 pt-8 border-t border-slate-200 gap-6">
                            <span className="text-sm text-slate-500 font-medium order-2 md:order-1">
                                Página{' '}
                                <span className="text-slate-900 font-bold">
                                    {page}
                                </span>{' '}
                                de{' '}
                                <span className="text-slate-900 font-bold">
                                    {meta.total_pages}
                                </span>
                            </span>

                            <div className="flex items-center gap-2 order-1 md:order-2">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm transition-all hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200"
                                >
                                    <FaArrowLeft /> Anterior
                                </button>

                                <div className="hidden md:flex gap-2 mx-2">
                                    {Array.from(
                                        { length: meta.total_pages },
                                        (_, i) => i + 1
                                    ).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => handlePageChange(p)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                                                page === p
                                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= meta.total_pages}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm transition-all hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-600 disabled:hover:border-slate-200"
                                >
                                    Siguiente <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default ProjectsPage;
