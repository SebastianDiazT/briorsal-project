import logoBriorsal from '@assets/logo.png';
import { LoginForm } from '../../components/auth/LoginForm';

const Login = () => {
    return (
        <div className="min-h-screen flex w-full font-sans bg-brand-dark-900">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10">
                <div className="lg:hidden mb-12">
                    <img
                        src={logoBriorsal}
                        alt="Briorsal"
                        className="h-10 w-auto"
                    />
                </div>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-3 tracking-wide">
                        Bienvenido
                    </h1>
                    <p className="text-brand-dark-200 font-light">
                        Ingresa tus credenciales para acceder al sistema.
                    </p>
                </div>

                <LoginForm />

                <div className="mt-12 text-center lg:text-left">
                    <p className="text-xs text-brand-dark-500">
                        &copy; {new Date().getFullYear()} Grupo Briorsal. Todos
                        los derechos reservados.
                    </p>
                </div>
            </div>

            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
                    }}
                ></div>

                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-900 via-brand-dark-900/60 to-transparent"></div>

                <div className="absolute inset-0 flex flex-col justify-between p-20 z-10">
                    <div className="flex justify-end">
                        <img
                            src={logoBriorsal}
                            alt="Briorsal"
                            className="h-16 w-auto brightness-0 invert opacity-90"
                        />
                    </div>

                    <div className="max-w-md">
                        <div className="w-12 h-1 bg-brand-400 mb-6"></div>
                        <h2 className="text-4xl font-bold text-white uppercase leading-tight mb-4">
                            Construyendo el futuro con excelencia.
                        </h2>
                        <p className="text-gray-300 font-light text-lg">
                            Panel de administración y gestión de proyectos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
