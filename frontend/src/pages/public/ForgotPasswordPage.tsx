import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { RequestPasswordResetForm } from '@/features/auth/components/RequestPasswordResetForm';
import PageMeta from '@/components/common/PageMeta';

import imgLogin from '@/assets/login/login.jpg';
import logoBriorsal from '@/assets/logo.png';

export const ForgotPasswordPage = () => {
    return (
        <>
            <PageMeta
                title="Recuperar Contraseña"
                description="Restablece tu acceso al portal Briorsal"
            />

            <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#121212] font-sans">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${imgLogin})` }}
                    />
                    <div className="absolute inset-0 bg-[#121212]/80 backdrop-blur-sm bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/50" />
                </div>

                <div className="relative z-10 w-full max-w-lg px-6">
                    <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-12 animate-fade-in-up">
                        <div className="flex justify-center mb-8">
                            <img
                                src={logoBriorsal}
                                alt="Briorsal"
                                className="h-12 w-auto object-contain"
                            />
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                                ¿Olvidaste tu contraseña?
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                No te preocupes. Ingresa el correo electrónico
                                asociado a tu cuenta y te enviaremos un enlace
                                para restablecerla.
                            </p>
                        </div>

                        <RequestPasswordResetForm />

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <Link
                                to="/admin/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group"
                            >
                                <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1 text-orange-500" />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mt-8 text-xs text-slate-600">
                        &copy; {new Date().getFullYear()} Constructora Briorsal.
                        Seguridad y Confianza.
                    </div>
                </div>
            </div>
        </>
    );
};
