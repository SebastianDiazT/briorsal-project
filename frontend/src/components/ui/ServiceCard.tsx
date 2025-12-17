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
        <div className="flex flex-col group">
            <div className="h-64 w-full overflow-hidden mb-6 relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
            </div>

            <div className="flex flex-col items-start">
                <h3 className="text-white text-2xl font-bold uppercase mb-2">
                    {title}
                </h3>

                <div className="w-16 h-1 bg-brand-400 mb-4"></div>

                <p className="text-brand-dark-200 text-lg text-justify leading-relaxed mb-6 font-light">
                    {description}
                </p>

                <a
                    href="https://wa.me/51952322024"
                    className="bg-brand-400 hover:bg-brand-500 text-white font-bold py-2 px-6 text-xs uppercase tracking-wider transition-colors"
                >
                    Contáctanos &gt;
                </a>
            </div>
        </div>
    );
};

export default ServiceCard;
