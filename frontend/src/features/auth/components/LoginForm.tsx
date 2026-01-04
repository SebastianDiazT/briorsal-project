import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
    FaLock,
    FaEnvelope,
    FaArrowRight,
    FaSpinner,
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';
import {
    useLoginMutation,
    useLazyGetMeQuery,
} from '@features/auth/api/authApi';
import { loginSchema, LoginFormValues } from '@features/auth/schemas';

export const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [triggerGetMe, { isLoading: isUserLoading }] = useLazyGetMeQuery();

    const isLoading = isLoginLoading || isUserLoading;

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const tokenData = await login(data).unwrap();
            localStorage.setItem('token', tokenData.access);

            const userData = await triggerGetMe().unwrap();

            dispatch(
                setCredentials({
                    user: userData,
                    token: tokenData.access,
                })
            );

            toast.success(`¡Bienvenido, ${userData.first_name || 'Admin'}!`);
            navigate('/admin/dashboard');
        } catch (err: any) {
            if (err?.status === 401) {
                toast.error('Credenciales incorrectas');
            } else {
                toast.error('Error de conexión');
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 relative z-10"
            >
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FaEnvelope
                            className={`transition-colors duration-300 ${
                                errors.email
                                    ? 'text-error-500'
                                    : 'text-brand-dark-500 group-focus-within:text-brand-400'
                            }`}
                        />
                    </div>

                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`
                            block w-full px-4 pl-11
                            pt-6 pb-2
                            bg-brand-dark-900/60 backdrop-blur-md
                            border rounded-lg text-white text-theme-sm
                            focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400
                            peer transition-all duration-300
                            placeholder-transparent
                            ${
                                errors.email
                                    ? 'border-error-500 focus:ring-error-500'
                                    : 'border-brand-dark-600 hover:border-brand-dark-500'
                            }
                        `}
                        placeholder=" "
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
                            ${errors.email ? 'text-error-500 peer-focus:text-error-500' : ''}
                        `}
                    >
                        Correo Electrónico
                    </label>

                    {errors.email && (
                        <p className="absolute -bottom-5 left-0 text-error-500 text-xs ml-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="relative group mt-8">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FaLock
                            className={`transition-colors duration-300 ${
                                errors.password
                                    ? 'text-error-500'
                                    : 'text-brand-dark-500 group-focus-within:text-brand-400'
                            }`}
                        />
                    </div>

                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        className={`
                            block w-full px-4 pl-11 pr-10
                            pt-6 pb-2
                            bg-brand-dark-900/60 backdrop-blur-md
                            border rounded-lg text-white text-theme-sm
                            focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400
                            peer transition-all duration-300
                            placeholder-transparent
                            ${
                                errors.password
                                    ? 'border-error-500 focus:ring-error-500'
                                    : 'border-brand-dark-600 hover:border-brand-dark-500'
                            }
                        `}
                        placeholder=" "
                        disabled={isLoading}
                    />

                    <label
                        htmlFor="password"
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
                            ${errors.password ? 'text-error-500 peer-focus:text-error-500' : ''}
                        `}
                    >
                        Contraseña
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

                    {errors.password && (
                        <p className="absolute -bottom-5 left-0 text-error-500 text-xs ml-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
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
                                    <span>Accediendo...</span>
                                </>
                            ) : (
                                <>
                                    <span>Iniciar Sesión</span>
                                    <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};
