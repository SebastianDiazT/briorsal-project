import React from 'react';
import { Link } from 'react-router-dom';
import { FaHouse, FaHelmetSafety, FaArrowRight } from 'react-icons/fa6';
import PageMeta from '@components/common/PageMeta';
import FadeIn from '@components/common/FadeIn';

const NotFound: React.FC = () => {
    return (
        <>
            <PageMeta
                title="404 - Página no encontrada | BRIORSAL"
                description="Parece que te has perdido en la obra."
            />

            <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-900 overflow-hidden font-sans">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-orange-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                    <div className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                </div>

                <div className="z-10 text-center px-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none opacity-5">
                        <span className="text-[200px] md:text-[350px] font-black text-white leading-none">
                            404
                        </span>
                    </div>

                    <FadeIn direction="down" delay={0.1}>
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700 mb-8 shadow-xl shadow-orange-900/10 backdrop-blur-sm">
                            <FaHelmetSafety className="text-4xl text-orange-500" />
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.2}>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
                            Estructura no <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
                                Encontrada
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.3}>
                        <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto font-light mb-10 leading-relaxed">
                            Parece que los planos de esta sección se han
                            extraviado o la página está en mantenimiento.
                        </p>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.4}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/"
                                className="group flex items-center gap-3 px-8 py-3.5 bg-orange-600 text-white font-bold uppercase tracking-widest hover:bg-orange-500 transition-all duration-300 rounded-sm shadow-lg hover:shadow-orange-500/20 hover:-translate-y-1"
                            >
                                <FaHouse />
                                Ir al Inicio
                            </Link>

                            <Link
                                to="/proyectos"
                                className="group flex items-center gap-3 px-8 py-3.5 bg-transparent border border-slate-600 text-white font-bold uppercase tracking-widest hover:border-white hover:bg-white hover:text-slate-900 transition-all duration-300 rounded-sm"
                            >
                                Ver Proyectos
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </FadeIn>
                </div>

                <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
            </div>
        </>
    );
};

export default NotFound;
