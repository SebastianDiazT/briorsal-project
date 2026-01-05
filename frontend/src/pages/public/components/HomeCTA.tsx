import { Link } from 'react-router-dom';
import { FaPaperPlane, FaWhatsapp } from 'react-icons/fa6';
import FadeIn from '@/components/common/FadeIn';
import { useGetCompanyInfoQuery } from '@/features/company/api/companyApi';

export const HomeCTA = () => {
    const { data } = useGetCompanyInfoQuery();
    const companyInfo = data?.data;

    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <FadeIn direction="up">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                        ¿Listo para construir?
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                        Cuéntanos sobre tu proyecto. Nuestro equipo de expertos
                        está preparado para brindarte la mejor asesoría.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            to="/contacto"
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-lg shadow-xl shadow-orange-600/20 hover:-translate-y-1 transition-all"
                        >
                            Cotizar Proyecto <FaPaperPlane />
                        </Link>
                        {companyInfo?.whatsapp && (
                            <a
                                href={companyInfo.whatsapp}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl text-lg transition-all"
                            >
                                <FaWhatsapp className="text-xl" /> WhatsApp
                            </a>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};
