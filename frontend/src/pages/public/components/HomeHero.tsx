import { Link } from 'react-router-dom';
import { FaWhatsapp, FaEnvelope, FaBuilding } from 'react-icons/fa6';
import FadeIn from '@components/common/FadeIn';

import {
    useGetCompanyInfoQuery,
    useGetHomeHeroQuery,
} from '@features/company/api/companyApi';

export const HomeHero = () => {
    const { data: companyResponse } = useGetCompanyInfoQuery();
    const whatsappLink = companyResponse?.data?.whatsapp;

    const { data: heroResponse, isLoading } = useGetHomeHeroQuery();
    const heroData = heroResponse?.data;

    if (isLoading)
        return (
            <section className="min-h-screen bg-slate-900 flex items-center justify-center"></section>
        );

    const bgImage = heroData?.image || '';
    const badgeText = heroData?.badge || '';
    const mainTitle = heroData?.title || '';
    const highlightText = heroData?.highlight || '';
    const description = heroData?.description || '';

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
            <div className="absolute inset-0 z-0">
                <img
                    src={bgImage}
                    alt="Briorsal Construcción"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="max-w-2xl">
                    <FadeIn direction="down">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            {badgeText}
                        </div>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 drop-shadow-lg">
                            {mainTitle}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                {highlightText}
                            </span>
                        </h1>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.4}>
                        <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-lg drop-shadow-md font-medium">
                            {description}
                        </p>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.6}>
                        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                            <Link
                                to="/proyectos"
                                className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 hover:-translate-y-1 text-center transition-all flex items-center justify-center gap-2 group"
                            >
                                <FaBuilding className="text-xl" />
                                <span className="inline">Ver Proyectos</span>
                            </Link>

                            {whatsappLink && (
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-100 font-bold rounded-xl hover:-translate-y-1 text-center flex items-center justify-center gap-2 group transition-all backdrop-blur-sm"
                                >
                                    <FaWhatsapp className="text-xl" />
                                    <span className="inline">WhatsApp</span>
                                </a>
                            )}

                            <Link
                                to="/contacto"
                                className="px-8 py-4 border border-white/20 hover:bg-white/10 text-white font-bold rounded-xl hover:-translate-y-1 text-center flex items-center justify-center gap-3 group transition-all backdrop-blur-sm"
                            >
                                <FaEnvelope className="text-xl" />
                                <span className="inline">Contáctanos</span>
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};