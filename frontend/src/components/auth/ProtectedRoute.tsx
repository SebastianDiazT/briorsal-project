import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';

export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

    if (loading) return <div>Cargando permisos...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};
