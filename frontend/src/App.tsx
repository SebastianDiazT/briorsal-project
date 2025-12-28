import { useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { checkAuth } from '@store/slices/authSlice';

// Layouts
import UserLayout from '@layouts/User/UserLayout';
import AdminLayout from '@layouts/Admin/AdminLayout';

// UI
import { AppToast } from '@components/ui/AppToast';

// Pages Public
import About from '@pages/About';
import Projects from '@pages/Projects';
import Services from '@pages/Services';
import Contact from '@pages/Contact';

// Pages Admin
import Login from '@pages/admin/Login';
import Dashboard from '@pages/admin/Dashboard';
import ProjectsList from '@pages/admin/projects/ProjectsList';
import ProjectCreate from '@pages/admin/projects/ProjectCreate';
import ProjectDetail from '@pages/admin/projects/ProjectDetail';
import ProjectEdit from '@pages/admin/projects/ProjectEdit';

export default function App() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    // Componente ProtectedRoute (Definido aquí para acceder al estado loading/auth fácilmente)
    // Nota: Si este componente crece, deberías moverlo a su propio archivo.
    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        if (loading) {
            return (
                <div className="h-screen w-full flex items-center justify-center bg-slate-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            // Redirige al login si no está autenticado
            return <Navigate to="/admin/login" replace />;
        }

        // Si está autenticado, renderiza el contenido (el AdminLayout)
        return <>{children}</>;
    };

    return (
        <Router>
            <AppToast />
            <Routes>
                {/* --- RUTAS PÚBLICAS (UserLayout) --- */}
                <Route element={<UserLayout />}>
                    <Route path="/" element={<>Home</>} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                </Route>

                {/* --- LOGIN (Fuera de layouts) --- */}
                <Route path="/admin/login" element={<Login />} />

                {/* --- RUTAS PROTEGIDAS (AdminLayout) --- */}
                {/* Aquí está el truco:
                    1. ProtectedRoute verifica la sesión.
                    2. Si pasa, renderiza AdminLayout.
                    3. AdminLayout debe tener un <Outlet /> para renderizar las rutas hijas.
                */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/projects" element={<ProjectsList />} />
                    <Route path="/admin/projects/new" element={<ProjectCreate />} />
                    <Route path="/admin/projects/:slug" element={<ProjectDetail />} />
                    <Route path="/admin/projects/edit/:slug" element={<ProjectEdit />} />
                </Route>
            </Routes>
        </Router>
    );
}