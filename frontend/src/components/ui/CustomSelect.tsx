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
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Seleccionar...',
    icon: Icon,
    disabled = false,
    className = '',
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

    return (
        <div
            className={`relative group w-full ${className}`}
            ref={containerRef}
        >
            <div
                onClick={handleToggle}
                className={`
                    relative w-full flex items-center justify-between h-[42px]
                    ${Icon ? 'pl-10' : 'pl-4'} pr-4
                    cursor-pointer rounded-xl text-sm font-semibold border transition-all duration-200
                    select-none
                    ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 border-slate-200' : ''}
                    ${!disabled && isOpen ? 'ring-2 ring-orange-500/10 border-orange-500' : ''}
                    ${
                        !disabled && isActive
                            ? 'bg-orange-50 border-orange-200 text-orange-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }
                `}
            >
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Icon
                            className={`transition-colors ${isActive ? 'text-orange-500' : 'text-slate-400'}`}
                        />
                    </div>
                )}

                <span
                    className={`truncate ${!isActive ? 'text-slate-400 font-normal' : ''}`}
                >
                    {isActive ? selectedOption?.label : placeholder}
                </span>

                <FaChevronDown
                    size={10}
                    className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : 'text-slate-400'}`}
                />
            </div>

            {isOpen && !disabled && (
                <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up origin-top min-w-[180px]">
                    <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                        <div
                            onClick={() => handleSelect('')}
                            className={`
                                px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors
                                ${!isActive ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                            `}
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
                                        px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors border-t border-slate-50
                                        ${
                                            isSelected
                                                ? 'bg-orange-50 text-orange-700 font-bold'
                                                : 'text-slate-600 hover:bg-orange-50/50 hover:text-orange-600'
                                        }
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
