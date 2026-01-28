import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaArrowLeft,
    FaArrowRight,
    FaBuilding,
    FaLayerGroup,
    FaMapMarkerAlt,
    FaCalendarAlt,
} from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';

import { useGetProjectsQuery } from '@/features/projects/api/projectsApi';
import { useGetCategoriesQuery } from '@/features/categories/api/categoriesApi';
import { useGetProjectsHeroQuery } from '@/features/company/api/companyApi';

import PageMeta from '@/components/common/PageMeta';
import FadeIn from '@/components/common/FadeIn';
import { ProjectCard } from '@/features/projects/types';

import heroBgImg from '@/assets/projects/hero.png';

const PortfolioCard = ({
    project,
    delay,
}: {
    project: ProjectCard;
    delay: number;
}) => {
    const mainImage = project.cover;
    const categoryName =
        project.category_names && project.category_names.length > 0
            ? project.category_names[0]
            : 'General';

    const extraCategories =
        project.category_names?.length > 1
            ? project.category_names.length - 1
            : 0;

    return (
        <FadeIn delay={delay} direction="up">
            <Link
                to={`/proyectos/${project.slug}`}
                className="group relative block w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg aspect-[3/4] hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-1"
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

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold text-white bg-orange-600 rounded-md shadow-lg shadow-orange-600/20 uppercase tracking-wider">
                            {categoryName}
                        </span>
                        {extraCategories > 0 && (
                            <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold text-white bg-white/20 backdrop-blur-md rounded-md uppercase tracking-wider border border-white/10">
                                +{extraCategories}
                            </span>
                        )}
                        {project.status === 'en_proceso' && (
                            <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold text-blue-200 bg-blue-900/50 border border-blue-500/30 rounded-md uppercase tracking-wider backdrop-blur-md">
                                En Ejecución
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight line-clamp-2 text-shadow-sm group-hover:text-orange-50 transition-colors">
                        {project.name}
                    </h3>

                    <div className="flex items-center gap-4 text-slate-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex items-center gap-1.5 truncate">
                            <FaMapMarkerAlt className="text-orange-500 shrink-0" />
                            <span className="truncate">{project.location}</span>
                        </div>
                        {project.year && (
                            <div className="flex items-center gap-1.5 shrink-0">
                                <FaCalendarAlt className="text-orange-500 shrink-0" />
                                <span>{project.year}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </FadeIn>
    );
};

const ProjectSkeleton = () => (
    <div className="rounded-2xl aspect-[3/4] bg-slate-200 animate-pulse relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full p-6 space-y-3">
            <div className="w-24 h-6 bg-slate-300 rounded-md"></div>
            <div className="w-3/4 h-8 bg-slate-300 rounded-lg"></div>
            <div className="w-1/2 h-4 bg-slate-300 rounded-full"></div>
        </div>
    </div>
);

const ProjectsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 9;

    const { data: heroResponse } = useGetProjectsHeroQuery();
    const heroData = heroResponse?.data;

    const { data: categoriesResponse, isLoading: isLoadingCats } =
        useGetCategoriesQuery({ no_page: true });

    const categories = categoriesResponse?.data || [];

    const {
        data: response,
        isLoading,
        isFetching,
    } = useGetProjectsQuery({
        page,
        pageSize: PAGE_SIZE,
        categories: selectedCategory,
    });

    const projects = response?.data || [];
    const meta = response?.meta;

    useEffect(() => {
        if (!isLoading && !isFetching) {
            const grid = document.getElementById('projects-grid');
            if (grid) {
                const y =
                    grid.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }, [page, selectedCategory]);

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        setPage(1);
    };

    const handlePageChange = (p: number) => {
        setPage(p);
    };

    const showPagination = meta && projects.length > 0 && meta.total_pages > 1;

    const heroTitle = heroData?.title || 'Nuestros';
    const heroHighlight = heroData?.highlight || 'Proyectos.';
    const heroDescription =
        heroData?.description ||
        'Una muestra de nuestra capacidad técnica y visión arquitectónica.';
    const heroImage = heroData?.image || heroBgImg;

    return (
        <>
            <PageMeta
                title="PORTAFOLIO – BRIORSAL"
                description="Explora nuestros proyectos de construcción, diseño y arquitectura."
            />

            <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-500 pt-32 pb-32 md:pb-48">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 transition-all duration-700 scale-105"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-700/90 via-slate-700/70 to-slate-50"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn direction="down">
                        <div className="flex items-center justify-center gap-2 text-slate-300 text-xs md:text-sm font-bold mb-6 uppercase tracking-widest">
                            <Link
                                to="/"
                                className="hover:text-white transition-colors flex items-center gap-1"
                            >
                                <FaHouse size={12} className="pb-0.5" /> Inicio
                            </Link>
                            <span className="text-orange-500">•</span>
                            <span className="text-white">Portafolio</span>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.2}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                            {heroTitle}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                {heroHighlight}
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.4}>
                        <p className="text-base md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed px-4">
                            {heroDescription}
                        </p>
                    </FadeIn>
                </div>
            </section>

            <section
                id="projects-grid"
                className="bg-slate-50 pb-24 min-h-screen -mt-20 relative z-20 rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]"
            >
                <div className="container mx-auto px-4 pt-16">
                    <div className="mb-12 relative z-30">
                        <FadeIn direction="up" delay={0.5}>
                            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                                <button
                                    onClick={() => handleCategoryChange('')}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-sm border ${
                                        selectedCategory === ''
                                            ? 'bg-orange-600 text-white border-orange-600 shadow-orange-500/30'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                                    }`}
                                >
                                    <FaLayerGroup /> Todos
                                </button>
                                {isLoadingCats ? (
                                    <>
                                        <div className="w-24 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                                        <div className="w-32 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                                    </>
                                ) : (
                                    categories.map((cat: any) => (
                                        <button
                                            key={cat.id}
                                            onClick={() =>
                                                handleCategoryChange(
                                                    String(cat.id)
                                                )
                                            }
                                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border shadow-sm ${
                                                selectedCategory ===
                                                String(cat.id)
                                                    ? 'bg-orange-600 text-white border-orange-600 shadow-orange-500/30 transform scale-105'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600 hover:-translate-y-0.5'
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        </FadeIn>
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
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed mx-auto max-w-2xl">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaBuilding className="text-3xl text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                No se encontraron proyectos
                            </h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">
                                No hay resultados para la categoría
                                seleccionada.
                            </p>
                            <button
                                onClick={() => handleCategoryChange('')}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg"
                            >
                                Ver todo el portafolio
                            </button>
                        </div>
                    )}

                    {showPagination && meta && (
                        <div className="flex flex-col md:flex-row items-center justify-between mt-20 pt-8 border-t border-slate-200 gap-6">
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
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm transition-all hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                                >
                                    <FaArrowLeft size={12} /> Anterior
                                </button>

                                <div className="hidden md:flex gap-1.5 mx-2">
                                    {Array.from(
                                        { length: meta.total_pages },
                                        (_, i) => i + 1
                                    ).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => handlePageChange(p)}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                                                page === p
                                                    ? 'bg-orange-600 text-white shadow-md'
                                                    : 'text-slate-500 hover:bg-slate-100'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= meta.total_pages}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm transition-all hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                                >
                                    Siguiente <FaArrowRight size={12} />
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
