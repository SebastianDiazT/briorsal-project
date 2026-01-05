import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import FadeIn from '@/components/common/FadeIn';

export const HomeHero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30"></div>
            </div>
            <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="max-w-2xl">
                    <FadeIn direction="down">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            Innovación y Solidez
                        </div>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8">
                            Construimos <br />{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                El Futuro.
                            </span>
                        </h1>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.4}>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-lg">
                            Transformamos visiones en estructuras tangibles. En
                            Briorsal, fusionamos ingeniería de precisión con
                            diseño arquitectónico de vanguardia.
                        </p>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.6}>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/proyectos"
                                className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 hover:-translate-y-1 text-center transition-all"
                            >
                                Ver Proyectos
                            </Link>
                            <Link
                                to="/contacto"
                                className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-bold rounded-xl hover:-translate-y-1 text-center flex items-center justify-center gap-3 group transition-all"
                            >
                                Contáctanos{' '}
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};
