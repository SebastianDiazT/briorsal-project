import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaSpinner, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useResetPasswordConfirmMutation } from '../api/authApi';

interface Props {
    uid: string;
    token: string;
}

export const ResetPasswordConfirmForm: React.FC<Props> = ({ uid, token }) => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [resetConfirm, { isLoading }] = useResetPasswordConfirmMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== reNewPassword) {
            return toast.error('Las contraseñas no coinciden.');
        }
        if (newPassword.length < 8) {
            return toast.error(
                'La contraseña debe tener al menos 8 caracteres.'
            );
        }

        try {
            await resetConfirm({
                uid,
                token,
                new_password: newPassword,
                re_new_password: reNewPassword,
            }).unwrap();

            toast.success(
                '¡Contraseña restablecida! Ahora puedes iniciar sesión.'
            );
            navigate('/admin/login');
        } catch (err: any) {
            let message = 'El enlace es inválido o ha expirado.';
            if (err.data?.new_password) {
                message = err.data.new_password[0];
            }
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaLock className="text-brand-dark-500 group-focus-within:text-brand-400 transition-colors duration-300" />
                </div>

                <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`
                        block w-full px-4 pl-11 pr-10
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
                    htmlFor="newPassword"
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
                    Nueva Contraseña
                </label>

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-dark-500 hover:text-brand-400 transition-colors cursor-pointer focus:outline-none z-20"
                    disabled={isLoading}
                >
                    {showPassword ? (
                        <FaEyeSlash size={18} />
                    ) : (
                        <FaEye size={18} />
                    )}
                </button>
            </div>

            <div className="relative group mt-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaLock className="text-brand-dark-500 group-focus-within:text-brand-400 transition-colors duration-300" />
                </div>

                <input
                    id="reNewPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={reNewPassword}
                    onChange={(e) => setReNewPassword(e.target.value)}
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
                    htmlFor="reNewPassword"
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
                    Confirmar Contraseña
                </label>
            </div>

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={isLoading || !newPassword}
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
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <span>Restablecer Acceso</span>
                                <FaCheck className="transform group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </span>
                </button>
            </div>
        </form>
    );
};
