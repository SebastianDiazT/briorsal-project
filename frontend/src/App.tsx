import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { useEffect } from 'react';

import UserLayout from '@layouts/User/UserLayout';
import AdminLayout from '@layouts/Admin/AdminLayout';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';

import { useAppDispatch } from '@store/hooks';
import { checkAuth } from '@store/slices/authSlice';

import Services from '@/pages/public/Services';
import NotFound from '@/pages/public/NotFound';

import Login from '@pages/admin/Login';

export default function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/" element={<>Home</>} />
                    <Route path="/services" element={<Services />} />
                </Route>

                <Route path="/admin/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<>Dashboard Admin</>} />
                        <Route path="/admin/projects" element={<>Proyectos Admin</>} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}