import React from 'react';

interface ServiceCardProps {
    title: string;
    description: string;
    image: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    description,
    image,
}) => {
    return (
        <div className="flex flex-col group h-full">
            <div className="h-64 w-full overflow-hidden mb-8 relative rounded-sm shadow-xl bg-slate-800">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-brand-dark-900/40 group-hover:bg-transparent transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-btm transition-all duration-500 group-hover:w-full"></div>
            </div>

            <div className="flex flex-col items-start flex-1">
                <h3 className="text-white text-2xl lg:text-3xl font-bold uppercase mb-3 tracking-wide group-hover:text-btm transition-colors">
                    {title}
                </h3>

                <div className="w-12 h-1 bg-btm mb-5 group-hover:w-24 transition-all duration-500"></div>

                <p className="text-gray-300 text-lg text-justify leading-relaxed mb-8 font-light flex-1">
                    {description}
                </p>

                <a
                    href="https://wa.me/51952322024"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-btm border border-gray-500 text-white font-bold py-3 px-8 text-base uppercase tracking-widest transition-all duration-300"
                >
                    Contáctanos
                    <span className="text-lg leading-none">&rsaquo;</span>
                </a>
            </div>
        </div>
    );
};

export default ServiceCard;
