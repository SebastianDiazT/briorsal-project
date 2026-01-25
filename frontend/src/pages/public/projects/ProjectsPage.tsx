import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaArrowLeft,
    FaArrowRight,
    FaBuilding,
    FaHouse,
    FaLayerGroup,
} from 'react-icons/fa6';

import { useGetProjectsQuery } from '@/features/projects/api/projectsApi';
import { useGetCategoriesQuery } from '@/features/categories/api/categoriesApi';
import { useGetProjectsHeroQuery } from '@/features/company/api/companyApi';

import PageMeta from '@/components/common/PageMeta';
import FadeIn from '@/components/common/FadeIn';
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
        project.cover_image ||
        (project.images && project.images.length > 0
            ? project.images[0].image
            : null);

    const categoryName =
        project.categories && project.categories.length > 0
            ? project.categories[0].name
            : 'General';

    return (
        <FadeIn delay={delay} direction="up">
            <Link
                to={`/proyectos/${project.slug}`}

                className="group relative block w-full overflow-hidden rounded-3xl bg-[#1b252f] shadow-lg aspect-square md:aspect-[4/5] hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
            >
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={project.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#25303b] text-slate-600">
                        <FaBuilding size={40} />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#1b252f]/90 via-[#1b252f]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-block px-2.5 py-1 text-[10px] font-bold text-white bg-orange-600 rounded-full shadow-lg shadow-orange-600/20 uppercase tracking-wider">
                            {categoryName}
                        </span>
                        {project.categories &&
                            project.categories.length > 1 && (
                                <span className="inline-block px-2 py-1 text-[10px] font-bold text-white bg-slate-800/80 rounded-full backdrop-blur-sm uppercase tracking-wider">
                                    +{project.categories.length - 1}
                                </span>
                            )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight line-clamp-2">
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
    <div className="rounded-3xl aspect-square md:aspect-[4/5] bg-slate-100 animate-pulse relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full p-8 space-y-3">
            <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
            <div className="w-3/4 h-8 bg-slate-200 rounded-lg"></div>
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
        setPage(1);
    }, [selectedCategory]);

    const scrollToGrid = () => {
        const grid = document.getElementById('projects-grid');
        if (grid) {
            const y = grid.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handlePageChange = (p: number) => {
        setPage(p);
        scrollToGrid();
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
                description="Nuestros proyectos."
            />

            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900 pt-32 pb-48">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-60 transition-all duration-700"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1b252f]/90 via-[#1b252f]/60 to-slate-50"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn direction="down">
                        <div className="flex items-center justify-center gap-2 text-slate-300 text-sm font-medium mb-8 uppercase tracking-wider">
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
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg max-w-5xl mx-auto">
                            {heroTitle}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 block md:inline">
                                {heroHighlight}
                            </span>
                        </h1>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.4}>
                        <p className="text-lg md:text-xl text-slate-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md px-4">
                            {heroDescription}
                        </p>
                    </FadeIn>
                </div>
            </section>

            <section
                id="projects-grid"
                className="bg-slate-50 pb-24 min-h-screen -mt-20 relative z-20"
            >
                <div className="container mx-auto px-4">
                    <div className="mb-16 transform -translate-y-10 relative z-30">
                        <FadeIn direction="up" delay={0.5}>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border flex items-center gap-2 shadow-xl ${selectedCategory === '' ? 'bg-orange-600 text-white border-orange-600 scale-105 ring-4 ring-orange-600/20' : 'bg-white text-slate-600 border-white hover:border-orange-300 hover:text-orange-500 hover:-translate-y-1'}`}
                                >
                                    <FaLayerGroup
                                        className={
                                            selectedCategory === ''
                                                ? 'text-white'
                                                : 'text-slate-400'
                                        }
                                    />{' '}
                                    Todos
                                </button>
                                {isLoadingCats ? (
                                    <>
                                        <div className="w-24 h-12 bg-white rounded-full animate-pulse opacity-80"></div>
                                        <div className="w-32 h-12 bg-white rounded-full animate-pulse opacity-80"></div>
                                    </>
                                ) : (
                                    categories.map((cat: any) => (
                                        <button
                                            key={cat.id}
                                            onClick={() =>
                                                setSelectedCategory(
                                                    String(cat.id)
                                                )
                                            }
                                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border shadow-xl ${selectedCategory === String(cat.id) ? 'bg-orange-600 text-white border-orange-600 scale-105 ring-4 ring-orange-600/20' : 'bg-white text-slate-600 border-white hover:border-orange-300 hover:text-orange-500 hover:-translate-y-1'}`}
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
                        <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 border-dashed shadow-sm mx-auto max-w-2xl">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaBuilding className="text-4xl text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                No se encontraron proyectos
                            </h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                                No hay proyectos en la categoría "
                                <span className="font-bold text-slate-700">
                                    {categories.find(
                                        (c: any) =>
                                            String(c.id) === selectedCategory
                                    )?.name || 'seleccionada'}
                                </span>
                                ".
                            </p>
                            <button
                                onClick={() => setSelectedCategory('')}
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-orange-600 transition-colors shadow-lg"
                            >
                                Ver todos los proyectos
                            </button>
                        </div>
                    )}

                    {showPagination && meta && (
                        <div className="flex flex-col md:flex-row items-center justify-between mt-20 pt-10 border-t border-slate-200 gap-6">
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
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm transition-all hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${page === p ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= meta.total_pages}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm transition-all hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
