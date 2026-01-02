import logoBriorsal from '@assets/logo.png';
import { LoginForm } from '@features/auth/components/LoginForm';
import PageMeta from '@components/common/PageMeta';
import imgLogin from '@assets/login/login.jpg';

const Login = () => {
    return (
        <>
            <PageMeta
                title="Acceso Administrativo"
                description="Portal de gestión Briorsal"
            />

            <div className="min-h-screen flex w-full font-sans bg-[#121212] text-white overflow-hidden">
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 relative z-10">
                    <div className="w-full max-w-md mx-auto">
                        <div className="mb-12">
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-white">
                                Bienvenido
                            </h1>
                            <p className="text-slate-400 text-base lg:text-lg">
                                Ingresa tus credenciales para acceder al{' '}
                                <span className="text-orange-500 font-semibold border-b border-orange-500/50 pb-0.5">
                                    Panel de Control
                                </span>
                                .
                            </p>
                        </div>

                        <LoginForm />

                        <div className="mt-16 border-t border-white/10 pt-6">
                            <p className="text-xs text-slate-500">
                                &copy; {new Date().getFullYear()} GRUPO
                                BRIORSAL. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block lg:w-1/2 relative bg-black">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60"
                        style={{
                            backgroundImage: `url(${imgLogin})`,
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/40 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-between p-16 z-20">
                        <div className="flex justify-end">
                            <img
                                src={logoBriorsal}
                                alt="Briorsal"
                                className="h-14 w-auto object-contain brightness-0 invert"
                            />
                        </div>

                        <div className="max-w-xl">
                            <div className="w-16 h-1 bg-orange-500 mb-6"></div>

                            <h2 className="text-5xl font-bold text-white uppercase leading-tight mb-6 tracking-wide">
                                Construyendo <br />
                                el futuro con <br />
                                <span className="text-orange-500">
                                    excelencia
                                </span>
                            </h2>

                            <div className="flex items-center gap-4 border-l-4 border-orange-600 pl-4">
                                <p className="text-slate-300 font-light text-lg leading-relaxed">
                                    Sistema de Gestión Integral de Proyectos
                                    Inmobiliarios y Servicios de Construcción.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
