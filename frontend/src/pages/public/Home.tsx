import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProjects } from '@store/slices/projectSlice';
import { fetchCategories } from '@store/slices/categorySlice';
import ClientsMarquee from '@features/company/components/ClientsMarquee';
import { FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { Project } from '@/types';

// --- Componente Interno: Proyecto Full Width con Galería ---
const FullWidthProjectItem = ({
    project,
    index,
}: {
    project: Project;
    index: number;
}) => {
    // Obtenemos hasta 3 imágenes para mostrar
    const displayImages = project.images?.slice(0, 4).map((i) => i.image) || [];

    // Estado para la imagen de fondo activa
    const [activeImageIdx, setActiveImageIdx] = useState(0);

    // Efecto de Carrusel Automático (cambia cada 5s)
    useEffect(() => {
        if (displayImages.length <= 1) return;

        const interval = setInterval(() => {
            setActiveImageIdx((prev) => (prev + 1) % displayImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [displayImages.length]);

    // Si no hay imágenes, no mostramos nada (o un placeholder)
    if (displayImages.length === 0) return null;

    return (
        <div className="relative w-full h-[85vh] min-h-[650px] flex items-center overflow-hidden group">
            {/* --- FONDO DINÁMICO --- */}
            {displayImages.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === activeImageIdx
                            ? 'opacity-100 z-0'
                            : 'opacity-0 -z-10'
                    }`}
                >
                    <img
                        src={img}
                        alt={`${project.name} ${idx}`}
                        className={`w-full h-full object-cover transition-transform duration-[6s] ease-out ${
                            idx === activeImageIdx ? 'scale-110' : 'scale-100'
                        }`}
                    />
                    {/* Overlay oscuro para leer el texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"></div>
                </div>
            ))}

            {/* --- CONTENIDO --- */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16 md:justify-center md:pb-0">
                <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-end ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                    {/* LADO A: TEXTO (Alterna izquierda/derecha según index) */}
                    <div
                        className={`${index % 2 !== 0 ? 'lg:order-2 lg:text-right items-end' : 'lg:order-1'} flex flex-col`}
                    >
                        <div
                            className={`flex items-center gap-3 mb-6 ${index % 2 !== 0 && 'justify-end'}`}
                        >
                            <span
                                className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                                    project.status === 'In Progress'
                                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                        : 'bg-green-500/20 text-green-300 border-green-500/30'
                                }`}
                            >
                                {project.status === 'In Progress'
                                    ? 'En Ejecución'
                                    : 'Entregado'}
                            </span>
                            <span className="h-px w-8 bg-slate-500"></span>
                            <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">
                                {project.category_name}
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
                            {project.name}
                        </h2>

                        <div
                            className={`flex items-center gap-2 text-xl text-slate-300 mb-8 font-medium ${index % 2 !== 0 && 'justify-end'}`}
                        >
                            <FaMapMarkerAlt className="text-brand-500" />
                            {project.location}
                        </div>

                        <Link
                            to={`/projects/${project.slug}`}
                            className="group/btn inline-flex items-center gap-4 text-white font-bold text-lg hover:text-brand-400 transition-colors w-fit"
                        >
                            <span className="border-b-2 border-white/30 group-hover/btn:border-brand-500 pb-1 transition-all">
                                Explorar Detalles
                            </span>
                            <div className="bg-white/10 p-3 rounded-full group-hover/btn:bg-brand-500 group-hover/btn:text-white transition-all backdrop-blur-sm">
                                <FaArrowRight size={16} />
                            </div>
                        </Link>
                    </div>

                    {/* LADO B: MINI GALERÍA (Siempre visible para cumplir "mostrar 3 al menos") */}
                    <div
                        className={`${index % 2 !== 0 ? 'lg:order-1 justify-start' : 'lg:order-2 justify-end'} hidden lg:flex gap-4`}
                    >
                        {displayImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImageIdx(idx)}
                                className={`relative w-24 h-32 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${
                                    activeImageIdx === idx
                                        ? 'border-brand-500 scale-110 shadow-lg shadow-brand-500/30'
                                        : 'border-white/20 opacity-70 hover:opacity-100'
                                }`}
                            >
                                <img
                                    src={img}
                                    alt="Thumb"
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}

                        {/* Tarjeta "Ver más" si hay muchas fotos */}
                        <Link
                            to={`/projects/${project.slug}`}
                            className="w-24 h-32 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2 hover:bg-brand-600 hover:border-brand-600 transition-all group/more"
                        >
                            <span className="text-xs font-bold uppercase text-center leading-tight">
                                Ver
                                <br />
                                Todo
                            </span>
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/more:bg-white group-hover/more:text-brand-600">
                                <FaArrowRight size={8} />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const dispatch = useAppDispatch();
    const { projects, loading } = useAppSelector((state) => state.projects);
    const { categories } = useAppSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchProjects({ page: 1, pageSize: 10 }));
        dispatch(fetchCategories());
    }, [dispatch]);

    // Filtrar solo los destacados
    const allFeatured = projects.filter((p) => p.is_featured);

    if (loading) {
        return (
            <div className="h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="bg-white">
            {/* HERO PRINCIPAL */}
            <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 fixed-bg"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900"></div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                        Arquitectura & Construcción
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none">
                        Creamos{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-orange-600">
                            Legado
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-light">
                        Transformamos visiones en estructuras tangibles.
                        Calidad, innovación y diseño en cada metro cuadrado.
                    </p>
                </div>
            </section>

            {/* --- SECCIONES POR CATEGORÍA --- */}
            {categories.map((category) => {
                const categoryProjects = allFeatured.filter(
                    (p) => p.category === category.id
                );
                if (categoryProjects.length === 0) return null;

                return (
                    <section
                        key={category.id}
                        className="relative bg-slate-900"
                    >
                        {/* Separador de Categoría */}
                        <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-y border-slate-800 py-6">
                            <div className="container mx-auto px-4 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="w-2 h-8 bg-brand-500 rounded-full"></span>
                                    {category.name}
                                </h2>
                                <Link
                                    to="/projects"
                                    className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    Ver todos <FaArrowRight size={10} />
                                </Link>
                            </div>
                        </div>

                        {/* Lista de Proyectos Full Width */}
                        <div className="flex flex-col">
                            {categoryProjects.map((project, idx) => (
                                <FullWidthProjectItem
                                    key={project.id}
                                    project={project}
                                    index={idx}
                                />
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* Si no hay destacados */}
            {allFeatured.length === 0 && (
                <div className="py-40 text-center bg-slate-900">
                    <p className="text-slate-500 text-xl font-light">
                        Nuestros proyectos destacados se publicarán pronto.
                    </p>
                </div>
            )}

            {/* CLIENTES */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 mb-12 text-center">
                    <h3 className="text-2xl font-bold text-slate-800">
                        Empresas que confían en nosotros
                    </h3>
                </div>
                <ClientsMarquee />
            </section>

            {/* CTA */}
            <section className="bg-brand-600 py-24 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        ¿Listo para construir algo extraordinario?
                    </h2>
                    <Link
                        to="/contact"
                        className="inline-block bg-white text-brand-700 px-12 py-5 rounded-full font-extrabold text-lg hover:bg-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all"
                    >
                        Inicia tu Proyecto Hoy
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default Home;
