import { FaQuoteLeft, FaBullseye, FaEye, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import PageMeta from '@components/common/PageMeta';
import FadeIn from '@components/common/FadeIn';

import { useGetAboutUsQuery } from '@features/company/api/companyApi';

const About = () => {
    const { data: response, isLoading } = useGetAboutUsQuery();

    const aboutUs = response?.data;

    const heroImage = aboutUs?.image || '/placeholder-about.jpg';

    // Color base solicitado: #1b252f

    return (
        <>
            <PageMeta
                title="NOSOTROS – BRIORSAL CONSTRUCTORA"
                description={
                    aboutUs?.description?.slice(0, 150) ||
                    'Conoce nuestra historia y visión.'
                }
            />

            {/* APLICACIÓN COLOR: Fondo principal #1b252f */}
            <div className="relative flex flex-col xl:flex-row min-h-screen bg-[#1b252f]">
                {/* SECCIÓN IZQUIERDA (IMAGEN) */}
                <div className="relative w-full xl:w-[45%] h-[50vh] xl:sticky xl:top-20 xl:h-[calc(100vh-5rem)] group overflow-hidden z-0">
                    {/* Fondo de respaldo por si la imagen tarda */}
                    <div className="absolute inset-0 bg-[#1b252f]">
                        <img
                            src={heroImage}
                            alt="Briorsal Nosotros"
                            className={`w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-110
                                ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
                            loading="eager"
                        />
                    </div>

                    {/* APLICACIÓN COLOR: Degradados para fundir la imagen con el color #1b252f */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b252f] via-[#1b252f]/40 to-transparent xl:bg-gradient-to-r xl:from-transparent xl:to-[#1b252f]/90"></div>

                    <div className="absolute bottom-0 left-0 p-8 xl:p-16 w-full z-10 pointer-events-none">
                        <FadeIn direction="up">
                            <div className="flex items-center gap-3 mb-2 md:mb-4">
                                <span className="h-[2px] w-8 md:w-12 bg-orange-500"></span>
                                <span className="text-orange-500 font-bold uppercase tracking-widest text-xs md:text-sm">
                                    Nuestra Esencia
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase leading-none mb-2 drop-shadow-2xl break-words">
                                Cons
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
                                    truyendo
                                </span>
                                <br className="hidden sm:block" />{' '}
                                <span className="block sm:inline mt-1 sm:mt-0">
                                    El Futuro
                                </span>
                            </h1>
                        </FadeIn>
                    </div>
                </div>

                {/* SECCIÓN DERECHA (TEXTO) - APLICACIÓN COLOR: bg-[#1b252f] */}
                <div className="w-full xl:w-[55%] flex flex-col justify-center px-6 py-16 md:p-20 xl:py-24 bg-[#1b252f] text-white relative z-10">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <FaBuilding size={400} />
                    </div>

                    <div className="max-w-2xl mx-auto space-y-16 relative z-10">
                        <FadeIn direction="up" delay={0.1}>
                            <div className="relative">
                                <FaQuoteLeft className="text-4xl text-orange-600/20 absolute -top-8 -left-6" />
                                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-4">
                                    Quiénes Somos
                                </h2>
                                <div className="text-lg md:text-xl text-slate-200 leading-relaxed font-light text-justify prose prose-invert max-w-none">
                                    {isLoading ? (
                                        <div className="space-y-3 animate-pulse">
                                            <div className="h-4 bg-white/10 rounded w-full"></div>
                                            <div className="h-4 bg-white/10 rounded w-5/6"></div>
                                            <div className="h-4 bg-white/10 rounded w-4/6"></div>
                                        </div>
                                    ) : (
                                        aboutUs?.description ||
                                        'Información no disponible.'
                                    )}
                                </div>
                            </div>
                        </FadeIn>

                        {/* Separador sutil */}
                        <div className="w-full h-[1px] bg-white/10"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FadeIn direction="up" delay={0.2} fullWidth>
                                {/* TARJETA MISIÓN: 
                                   Usamos bg-white/5 para que sea un tono ligeramente más claro
                                   que el #1b252f automáticamente.
                                */}
                                <div className="group h-full p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-900/10 backdrop-blur-sm">
                                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-400/20 group-hover:scale-110 transition-all duration-300">
                                        <FaBullseye size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                                        Nuestra Misión
                                    </h3>
                                    <p className="text-slate-300 text-base leading-relaxed group-hover:text-slate-200 transition-colors">
                                        {isLoading
                                            ? 'Cargando...'
                                            : aboutUs?.mission ||
                                              'Definir misión.'}
                                    </p>
                                </div>
                            </FadeIn>

                            <FadeIn direction="up" delay={0.3} fullWidth>
                                {/* TARJETA VISIÓN */}
                                <div className="group h-full p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-sky-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-900/10 backdrop-blur-sm">
                                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-sky-400 mb-6 group-hover:bg-sky-400/20 group-hover:scale-110 transition-all duration-300">
                                        <FaEye size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-sky-300 transition-colors">
                                        Nuestra Visión
                                    </h3>
                                    <p className="text-slate-300 text-base leading-relaxed group-hover:text-slate-200 transition-colors">
                                        {isLoading
                                            ? 'Cargando...'
                                            : aboutUs?.vision ||
                                              'Definir visión.'}
                                    </p>
                                </div>
                            </FadeIn>
                        </div>

                        <FadeIn direction="up" delay={0.4}>
                            <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-8 md:p-10 rounded-3xl border border-white/10 border-l-4 border-l-orange-500 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white/5 transition-colors duration-500">
                                <div className="text-center md:text-left">
                                    <p className="text-orange-200 font-medium text-lg mb-2">
                                        ¿Tienes un proyecto en mente?
                                    </p>
                                    <p className="text-white font-bold text-2xl md:text-3xl">
                                        Hagamos realidad tus ideas.
                                    </p>
                                </div>
                                <Link
                                    to="/contacto"
                                    className="px-8 py-4 bg-orange-600 text-white text-base font-bold rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 whitespace-nowrap transform group-hover:scale-105"
                                >
                                    Contáctanos
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
