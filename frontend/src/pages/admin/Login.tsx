import logoBriorsal from '@assets/logo.png';
import { LoginForm } from '@features/auth/components/LoginForm';

const Login = () => {
    return (
        <div className="min-h-screen flex w-full font-sans bg-brand-dark-900">
            {/* --- COLUMNA IZQUIERDA (Formulario) --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10">
                {/* Logo visible solo en móvil */}
                <div className="lg:hidden mb-12 flex justify-center">
                    <img
                        src={logoBriorsal}
                        alt="Briorsal"
                        className="h-12 w-auto object-contain"
                    />
                </div>

                <div className="mb-10">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-wide">
                        Bienvenido
                    </h1>
                    <p className="text-brand-dark-200 font-light text-lg">
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

            {/* --- COLUMNA DERECHA (Imagen Decorativa) --- */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-brand-dark-800">
                {/* Imagen de fondo con efecto zoom suave */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
                    }}
                ></div>

                {/* Overlay gradiente para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-900 via-brand-dark-900/70 to-brand-dark-900/30"></div>

                {/* Contenido sobre la imagen */}
                <div className="absolute inset-0 flex flex-col justify-between p-20 z-10">
                    <div className="flex justify-end">
                        <img
                            src={logoBriorsal}
                            alt="Briorsal"
                            className="h-20 w-auto brightness-0 invert opacity-90 drop-shadow-lg"
                        />
                    </div>

                    <div className="max-w-lg">
                        <div className="w-16 h-1 bg-brand-400 mb-8 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                        <h2 className="text-4xl xl:text-5xl font-bold text-white uppercase leading-tight mb-6 tracking-wide drop-shadow-md">
                            Construyendo el futuro con{' '}
                            <span className="text-brand-400">excelencia</span>.
                        </h2>
                        <p className="text-gray-200 font-light text-xl border-l-2 border-brand-400 pl-4">
                            Sistema de Gestión Integral de Proyectos y
                            Servicios.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
