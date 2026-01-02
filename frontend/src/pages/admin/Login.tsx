import logoBriorsal from '@assets/logo.png';
import { LoginForm } from '@features/auth/components/LoginForm';
import PageMeta from '@components/common/PageMeta';

const Login = () => {
    return (
        <>
            <PageMeta
                title="Acceso Administrativo"
                description="Portal de gestión Briorsal"
            />

            <div className="min-h-screen flex w-full font-sans bg-brand-dark-950 text-white overflow-hidden">
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-brand-dark-900">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-400/20 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="lg:hidden mb-12 flex justify-center">
                        <img
                            src={logoBriorsal}
                            alt="Briorsal"
                            className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,122,61,0.5)]"
                        />
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-100 to-brand-400">
                                Bienvenido
                            </span>
                        </h1>
                        <p className="text-brand-dark-300 font-light text-lg lg:text-xl max-w-md mx-auto lg:mx-0">
                            Ingresa tus credenciales para acceder al{' '}
                            <span className="text-brand-400 font-medium">
                                Panel de Control
                            </span>
                            .
                        </p>
                    </div>

                    <div className="relative z-20">
                        <LoginForm />
                    </div>

                    <div className="mt-16 text-center lg:text-left border-t border-brand-dark-800 pt-6">
                        <p className="text-xs text-brand-dark-500 font-medium tracking-wide">
                            &copy; {new Date().getFullYear()} GRUPO BRIORSAL.
                            Todos los derechos reservados.
                        </p>
                    </div>
                </div>

                <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-brand-dark-950">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[30s] hover:scale-110 animate-kenburns"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
                        }}
                    ></div>

                    <div className="absolute inset-0 bg-gradient-to-l from-brand-dark-950/40 via-brand-dark-900/80 to-brand-dark-900"></div>
                    <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay"></div>

                    <div className="absolute inset-0 flex flex-col justify-between p-20 z-10">
                        <div className="flex justify-end">
                            <img
                                src={logoBriorsal}
                                alt="Briorsal"
                                className="h-24 w-auto brightness-0 invert opacity-100 drop-shadow-2xl"
                            />
                        </div>

                        <div className="max-w-xl">
                            <div className="w-24 h-1.5 bg-gradient-to-r from-brand-400 to-brand-600 mb-8 rounded-full shadow-[0_0_20px_rgba(255,81,0,0.6)]"></div>

                            <h2 className="text-5xl xl:text-6xl font-bold text-white uppercase leading-none mb-8 tracking-wide drop-shadow-lg">
                                Construyendo <br />
                                el futuro con <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">
                                    excelencia
                                </span>
                            </h2>

                            <p className="text-brand-dark-100 font-light text-xl border-l-4 border-brand-500 pl-6 py-2 bg-black/20 backdrop-blur-sm rounded-r-lg">
                                Sistema de Gestión Integral de Proyectos
                                Inmobiliarios y Servicios de Construcción.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
