import { useParams, Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { ResetPasswordConfirmForm } from '@/features/auth/components/ResetPasswordConfirmForm';
import PageMeta from '@/components/common/PageMeta';

import imgLogin from '@/assets/login/login.jpg';
import logoBriorsal from '@/assets/logo.png';

export const ResetPasswordPage = () => {
    const { uid, token } = useParams<{ uid: string; token: string }>();

    if (!uid || !token) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#121212] font-sans p-6">
                <div className="max-w-md w-full bg-[#1a1a1a] border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle className="text-red-500 text-2xl" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">
                        Enlace Inválido
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                        El enlace de recuperación parece estar incompleto o
                        roto. Por favor, solicita uno nuevo.
                    </p>
                    <Link
                        to="/admin/forgot-password"
                        className="inline-block bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="Nueva Contraseña"
                description="Establece una nueva contraseña segura"
            />

            <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#121212] font-sans">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${imgLogin})` }}
                    />
                    <div className="absolute inset-0 bg-[#121212]/85 backdrop-blur-sm bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/60" />
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
                                Nueva Contraseña
                            </h2>
                            <p className="text-slate-400 text-sm">
                                Por seguridad, elige una contraseña fuerte y
                                única que no hayas usado antes.
                            </p>
                        </div>

                        <ResetPasswordConfirmForm uid={uid} token={token} />

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <Link
                                to="/admin/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group"
                            >
                                <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1 text-orange-500" />
                                Cancelar y volver
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
