import React from 'react';

export interface InfoCardProps {
    title: string;
    description: string;
    className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    description,
    className = '',
}) => (
    <div className={`flex flex-col items-center text-center ${className}`}>
        <h3 className="text-white font-bold text-2xl uppercase tracking-widest mb-4">
            {title}
        </h3>
        <p className="text-brand-dark-200 text-xl leading-relaxed font-light max-w-sm">
            {description}
        </p>
    </div>
);

export default InfoCard;
