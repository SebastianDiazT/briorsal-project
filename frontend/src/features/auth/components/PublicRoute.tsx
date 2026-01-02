import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';

export const PublicRoute = () => {
    const { token } = useAppSelector((state) => state.auth);

    if (token) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};
