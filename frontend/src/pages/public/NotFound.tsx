import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import FadeIn from '@components/common/FadeIn';
import PageMeta from '@components/common/PageMeta';


const NotFound: React.FC = () => {
    return (
        <>
            <PageMeta title="404 - Página no encontrada" description="Página no encontrada" />

            <div className="relative min-h-screen flex flex-col items-center justify-center bg-brand-dark-900 overflow-hidden font-sans">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                <div className="z-10 text-center px-4">
                    <FadeIn direction="down" delay={0.1}>
                        <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-dark-600 to-brand-dark-800 select-none">
                            404
                        </h1>
                    </FadeIn>

                    <div className="-mt-12 md:-mt-20 relative">
                        <FadeIn direction="up" delay={0.3}>
                            <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wide mb-4">
                                Página no{' '}
                                <span className="text-brand-400">
                                    encontrada
                                </span>
                            </h2>
                            <p className="text-brand-dark-200 text-lg md:text-xl max-w-lg mx-auto font-light mb-8">
                                Parece que los planos de esta sección se han
                                extraviado o la página está en construcción.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/"
                                    className="group flex items-center gap-2 px-8 py-3 bg-brand-400 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark-900 transition-all duration-300 rounded-sm shadow-lg hover:shadow-brand-400/50"
                                >
                                    <FaHome />
                                    Ir al Inicio
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;
