import React from 'react';
import { FaWhatsapp, FaImage } from 'react-icons/fa';
import { useGetCompanyInfoQuery } from '@/features/company/api/companyApi';

interface ServiceCardProps {
    title: string;
    description: string;
    image?: string | null;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    description,
    image,
}) => {
    const { data: response } = useGetCompanyInfoQuery();
    const companyInfo = response?.data;

    const baseWhatsappUrl = companyInfo?.whatsapp || '';

    const cleanBaseUrl = baseWhatsappUrl.endsWith('/')
        ? baseWhatsappUrl.slice(0, -1)
        : baseWhatsappUrl;

    const message = `Hola, estoy interesado en el servicio de *${title}*.`;

    const finalUrl = `${cleanBaseUrl}?text=${encodeURIComponent(message)}`;

    return (
        <div className="flex flex-col group h-full">
            <div className="h-64 w-full overflow-hidden mb-8 relative rounded-sm shadow-xl bg-slate-800">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-500">
                        <FaImage size={40} className="opacity-50" />
                    </div>
                )}

                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-all duration-500"></div>

                <div className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 transition-all duration-500 group-hover:w-full"></div>
            </div>

            <div className="flex flex-col items-start flex-1">
                <h3 className="text-white text-2xl lg:text-3xl font-bold uppercase mb-3 tracking-wide group-hover:text-orange-500 transition-colors">
                    {title}
                </h3>

                <div className="w-12 h-1 bg-orange-500 mb-5 group-hover:w-24 transition-all duration-500"></div>

                <p className="text-gray-300 text-lg text-justify leading-relaxed mb-8 font-light flex-1">
                    {description}
                </p>

                <a
                    href={finalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600 border border-orange-500 text-white font-bold py-3 px-8 text-base uppercase tracking-widest transition-all duration-300 hover:bg-orange-700 hover:shadow-lg"
                >
                    <FaWhatsapp className="text-xl" />
                    Contáctanos
                    <span className="text-lg leading-none">&rsaquo;</span>
                </a>
            </div>
        </div>
    );
};

export default ServiceCard;
