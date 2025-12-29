import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
