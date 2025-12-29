import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaLock,
    FaEnvelope, // Cambiamos FaUser por FaEnvelope
    FaArrowRight,
    FaSpinner,
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { login } from '@store/slices/authSlice'; // Asegúrate que se llame 'login' en tu slice

export const LoginForm = () => {
    const [email, setEmail] = useState(''); // Cambiado de username a email
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Obtenemos estado de Redux (authSlice)
    const { loading, error, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    // 1. Redirección si el login es exitoso
    useEffect(() => {
        if (isAuthenticated) {
            toast.dismiss(); // Limpia toasts anteriores
            toast.success('¡Bienvenido al Panel de Control!');
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // 2. Manejo de errores
    useEffect(() => {
        if (error) {
            toast.error(
                typeof error === 'string' ? error : 'Error de autenticación'
            );
            // Opcional: dispatch(clearError()) si implementaste esa acción
        }
    }, [error]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        // Enviamos la acción a Redux
        dispatch(login({ email, password }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* INPUT EMAIL */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-brand-400 uppercase tracking-widest ml-1">
                    Correo Electrónico
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                        <FaEnvelope className="ml-2 text-brand-dark-500 group-focus-within:text-white transition-colors duration-300" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full py-3 pl-10 bg-transparent border-b border-brand-dark-600 text-white placeholder-brand-dark-600 focus:outline-none focus:border-brand-400 transition-all duration-300"
                        placeholder="admin@briorsal.com"
                        disabled={loading}
                        required
                    />
                </div>
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-brand-400 uppercase tracking-widest ml-1">
                    Contraseña
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                        <FaLock className="ml-2 text-brand-dark-500 group-focus-within:text-white transition-colors duration-300" />
                    </div>

                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full py-3 pl-10 pr-10 bg-transparent border-b border-brand-dark-600 text-white placeholder-brand-dark-600 focus:outline-none focus:border-brand-400 transition-all duration-300"
                        placeholder="••••••••"
                        disabled={loading}
                        required
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-2 flex items-center text-brand-dark-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
                        disabled={loading}
                    >
                        {showPassword ? (
                            <FaEyeSlash size={18} className="mr-2" />
                        ) : (
                            <FaEye size={18} className="mr-2" />
                        )}
                    </button>
                </div>
            </div>

            {/* BOTÓN SUBMIT */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`
                        group w-full flex items-center justify-center gap-3
                        bg-white text-brand-dark-900 font-bold py-4 px-6
                        uppercase tracking-widest hover:bg-brand-400 hover:text-white
                        transition-all duration-300 shadow-lg hover:shadow-brand-400/25
                        rounded-sm
                        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                >
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            <span>Verificando...</span>
                        </>
                    ) : (
                        <>
                            <span>Iniciar Sesión</span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
