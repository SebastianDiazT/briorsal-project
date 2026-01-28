import React, { useState } from 'react';
import { FaEnvelope, FaSpinner, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '../api/authApi';

export const RequestPasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await resetPassword({ email }).unwrap();
            toast.success(
                'Si la cuenta existe, recibirás un correo con instrucciones.',
                { duration: 5000 }
            );
            setEmail('');
        } catch (err) {
            toast.error('Ocurrió un error al procesar la solicitud.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaEnvelope className="text-brand-dark-500 group-focus-within:text-brand-400 transition-colors duration-300" />
                </div>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                        block w-full px-4 pl-11
                        pt-6 pb-2
                        bg-brand-dark-900/60 backdrop-blur-md
                        border rounded-lg text-white text-theme-sm
                        focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400
                        peer transition-all duration-300
                        placeholder-transparent
                        border-brand-dark-600 hover:border-brand-dark-500
                    `}
                    placeholder=" "
                    required
                    disabled={isLoading}
                />

                <label
                    htmlFor="email"
                    className={`
                        absolute left-11
                        top-1 text-theme-xs
                        text-brand-dark-500 font-medium
                        duration-300 transform origin-[0]

                        peer-placeholder-shown:top-3.5
                        peer-placeholder-shown:text-theme-sm
                        peer-placeholder-shown:text-brand-dark-500

                        peer-focus:top-1
                        peer-focus:text-theme-xs
                        peer-focus:text-brand-400

                        pointer-events-none
                    `}
                >
                    Correo Electrónico
                </label>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading || !email}
                    className={`
                        group w-full relative overflow-hidden rounded-lg
                        bg-white text-brand-dark-950
                        py-4 px-6
                        uppercase tracking-widest font-bold text-sm
                        transition-all duration-300

                        hover:bg-brand-400 hover:text-white
                        hover:shadow-[0_10px_20px_-5px_rgba(255,122,61,0.4)]
                        hover:-translate-y-0.5

                        active:scale-95
                        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-brand-dark-950
                    `}
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>Enviando...</span>
                            </>
                        ) : (
                            <>
                                <span>Enviar Enlace</span>
                                <FaPaperPlane className="transform group-hover:translate-x-1 transition-transform text-xs" />
                            </>
                        )}
                    </span>
                </button>
            </div>
        </form>
    );
};
