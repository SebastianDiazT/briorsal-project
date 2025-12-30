import { useEffect } from 'react';
import { FaQuoteLeft, FaBullseye, FaEye, FaBuilding } from 'react-icons/fa';
import PageMeta from '@components/common/PageMeta';
import FadeIn from '@components/common/FadeIn';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchAboutUs } from '@store/slices/companySlice';

const About = () => {
    const dispatch = useAppDispatch();
    const { aboutUs, loading } = useAppSelector((state) => state.company);

    useEffect(() => {
        if (!aboutUs) {
            dispatch(fetchAboutUs());
        }
    }, [dispatch, aboutUs]);

    return (
        <>
            <PageMeta
                title="NOSOTROS – BRIORSAL"
                description={
                    aboutUs?.description?.slice(0, 150) ||
                    'Conoce nuestra historia y visión.'
                }
            />

            <div className="relative flex flex-col xl:flex-row min-h-screen bg-slate-950">
                <div className="relative w-full xl:w-[45%] h-[50vh] xl:h-screen xl:sticky xl:top-0 group overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={aboutUs?.image || ''}
                            alt="Briorsal Nosotros"
                            className={`w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 ${loading ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent xl:bg-gradient-to-r xl:from-transparent xl:to-slate-950/80"></div>

                    <div className="absolute bottom-0 left-0 p-8 xl:p-16 w-full z-10">
                        <FadeIn direction="up">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="h-[2px] w-12 bg-brand-500"></span>
                                <span className="text-brand-500 font-bold uppercase tracking-widest text-sm">
                                    Nuestra Esencia
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase leading-none mb-2 drop-shadow-lg">
                                Cons
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-300">
                                    truyendo
                                </span>
                                <br />
                                El Futuro
                            </h1>
                        </FadeIn>
                    </div>
                </div>

                <div className="w-full xl:w-[55%] flex flex-col justify-center px-6 py-16 md:p-20 xl:py-24 bg-slate-950 text-white relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <FaBuilding size={300} />
                    </div>

                    <div className="max-w-2xl mx-auto space-y-16 relative z-10">
                        <FadeIn direction="up" delay={0.1}>
                            <div className="relative">
                                <FaQuoteLeft className="text-4xl text-brand-600/30 absolute -top-6 -left-4" />
                                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-brand-500 pl-4">
                                    Quiénes Somos
                                </h2>
                                <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light text-justify">
                                    {aboutUs?.description ||
                                        'Cargando nuestra historia...'}
                                </p>
                            </div>
                        </FadeIn>

                        <div className="w-full h-[1px] bg-slate-800"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FadeIn direction="up" delay={0.2} fullWidth>
                                <div className="group h-full p-8 bg-slate-900 rounded-2xl border border-slate-800 hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/20">
                                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500/10 transition-colors">
                                        <FaBullseye size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                                        Nuestra Misión
                                    </h3>
                                    <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                                        {aboutUs?.mission ||
                                            'Cargando misión...'}
                                    </p>
                                </div>
                            </FadeIn>

                            <FadeIn direction="up" delay={0.3} fullWidth>
                                <div className="group h-full p-8 bg-slate-900 rounded-2xl border border-slate-800 hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/20">
                                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-500/10 transition-colors">
                                        <FaEye size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                                        Nuestra Visión
                                    </h3>
                                    <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                                        {aboutUs?.vision ||
                                            'Cargando visión...'}
                                    </p>
                                </div>
                            </FadeIn>
                        </div>

                        <FadeIn direction="up" delay={0.4}>
                            <div className="bg-gradient-to-r from-brand-900/20 to-transparent p-8 rounded-2xl border-l-4 border-brand-500 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <p className="text-brand-100 font-medium text-lg md:text-xl mb-1">
                                        ¿Tienes un proyecto en mente?
                                    </p>
                                    <p className="text-white font-bold text-xl md:text-xl">
                                        Hagamos realidad tus ideas.
                                    </p>
                                </div>
                                <a
                                    href="/contact"
                                    className="px-8 py-4 bg-brand-600 text-white text-base font-bold rounded-xl hover:bg-brand-500 transition-colors shadow-lg shadow-brand-600/20 whitespace-nowrap"
                                >
                                    Contáctanos
                                </a>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;
