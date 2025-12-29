import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { useEffect } from 'react';

import { AppToast } from '@components/ui/AppToast';

import UserLayout from '@layouts/User/UserLayout';
import AdminLayout from '@layouts/Admin/AdminLayout';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';

import { useAppDispatch } from '@store/hooks';
import { checkAuth } from '@store/slices/authSlice';

import Services from '@/pages/public/Services';
import About from '@/pages/public/About';
import NotFound from '@/pages/public/NotFound';

import ServicesList from './pages/admin/services/ServicesList';
import ServiceCreate from './pages/admin/services/ServiceCreate';
import ServiceEdit from './pages/admin/services/ServiceEdit';

import CompanySettings from './pages/admin/company/CompanySettings';
import AboutSettings from './pages/admin/company/AboutSettings';

import Login from '@pages/admin/Login';

export default function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return (
        <Router>
            <AppToast />
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/" element={<>Home</>} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                </Route>

                <Route path="/admin/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<>Dashboard Admin</>} />
                        <Route path="/admin/projects" element={<>Proyectos Admin</>} />

                        <Route path="/admin/services" element={<ServicesList />} />
                        <Route path="/admin/services/new" element={<ServiceCreate />} />
                        <Route path="/admin/services/edit/:id" element={<ServiceEdit />} />

                        <Route path="/admin/settings" element={<CompanySettings />} />
                        <Route path="/admin/about" element={<AboutSettings />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}