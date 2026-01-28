import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface CustomSelectProps {
    value: string | number;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    icon?: React.ElementType;
    disabled?: boolean;
    className?: string;
    variant?: 'default' | 'glass';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Seleccionar...',
    icon: Icon,
    disabled = false,
    className = '',
    variant = 'default',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(
        (opt) => String(opt.value) === String(value)
    );
    const isActive = value !== '' && value !== null && value !== undefined;

    const handleToggle = () => {
        if (!disabled) setIsOpen(!isOpen);
    };

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    const baseStyles =
        'relative w-full flex items-center justify-between cursor-pointer rounded-xl text-sm font-medium border transition-all duration-300 select-none';

    const sizeStyles = 'py-3.5 px-4';

    const variantStyles = {
        default: {
            active: 'bg-orange-50 border-orange-200 text-orange-700',
            inactive:
                'bg-white border-slate-200 text-slate-600 hover:border-slate-300',
            openRing: 'ring-2 ring-orange-500/10 border-orange-500',
            icon: isActive ? 'text-orange-500' : 'text-slate-400',
            placeholder: 'text-slate-400',
            dropdown: 'bg-white border-slate-100 text-slate-600',
            optionActive: 'bg-orange-50 text-orange-700 font-bold',
            optionHover: 'hover:bg-orange-50/50 hover:text-orange-600',
        },
        glass: {
            active: 'bg-white/10 border-orange-500 text-slate-200',
            inactive:
                'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10',
            openRing: 'ring-1 ring-orange-500 border-orange-500 bg-white/10',
            icon: isActive ? 'text-orange-500' : 'text-slate-500',
            placeholder: 'text-slate-500',
            dropdown: 'bg-[#1b252f] border-white/10 text-slate-300 shadow-2xl',
            optionActive: 'bg-orange-600 text-white font-bold',
            optionHover: 'hover:bg-white/5 hover:text-orange-400',
        },
    };

    const currentStyle = variantStyles[variant];

    return (
        <div
            className={`relative group w-full ${className}`}
            ref={containerRef}
        >
            <div
                onClick={handleToggle}
                className={`
                    ${baseStyles}
                    ${sizeStyles}
                    ${Icon ? 'pl-10' : ''}
                    ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 border-slate-200' : ''}
                    ${!disabled && isOpen ? currentStyle.openRing : ''}
                    ${!disabled && !isOpen && (isActive ? currentStyle.active : currentStyle.inactive)}
                `}
            >
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Icon
                            className={`transition-colors ${currentStyle.icon}`}
                        />
                    </div>
                )}

                <span
                    className={`truncate ${!isActive ? currentStyle.placeholder : ''}`}
                >
                    {isActive ? selectedOption?.label : placeholder}
                </span>

                <FaChevronDown
                    size={10}
                    className={`ml-2 transition-transform duration-300 ${currentStyle.icon} ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {isOpen && !disabled && (
                <div
                    className={`absolute top-full left-0 mt-1.5 w-full rounded-xl shadow-xl border overflow-hidden z-50 animate-fade-in-up origin-top min-w-[180px] ${currentStyle.dropdown}`}
                >
                    <div className="py-1">
                        <div
                            onClick={() => handleSelect('')}
                            className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${!isActive ? currentStyle.optionActive : 'opacity-70 ' + currentStyle.optionHover}`}
                        >
                            <span className="opacity-90">{placeholder}</span>
                            {!isActive && <FaCheck size={10} />}
                        </div>

                        {options.map((option) => {
                            const isSelected =
                                String(value) === String(option.value);
                            return (
                                <div
                                    key={option.value}
                                    onClick={() =>
                                        handleSelect(String(option.value))
                                    }
                                    className={`
                                        px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors 
                                        ${variant === 'glass' ? 'border-t border-white/5' : 'border-t border-slate-50'}
                                        ${isSelected ? currentStyle.optionActive : currentStyle.optionHover}
                                    `}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && <FaCheck size={10} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
