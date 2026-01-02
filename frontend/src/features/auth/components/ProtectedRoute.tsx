import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';

export const ProtectedRoute = () => {
    const { token } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (!token) {
        return (
            <Navigate to="/admin/login" state={{ from: location }} replace />
        );
    }

    return <Outlet />;
};
