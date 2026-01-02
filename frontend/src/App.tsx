import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { useEffect } from 'react';

import { AppToast } from '@components/ui/AppToast';

import UserLayout from '@layouts/User/UserLayout';
import AdminLayout from '@layouts/Admin/AdminLayout';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';

import { useAppDispatch } from '@store/hooks';
import { checkAuth } from '@store/slices/authSlice';

import Home from '@pages/public/Home';
import Services from '@pages/public/Services';
import About from '@pages/public/About';
import Projects from '@pages/public/Projects';
import ProjectDetail from '@pages/public/ProjectDetail';
import NotFound from '@pages/public/NotFound';

import Dashboard from '@pages/admin/Dashboard';
import ServicesList from '@pages/admin/services/ServicesList';
import ServiceCreate from '@pages/admin/services/ServiceCreate';
import ServiceEdit from '@pages/admin/services/ServiceEdit';

import ClientsList from '@pages/admin/company/ClientsList';
import CompanySettings from '@pages/admin/company/CompanySettings';
import AboutSettings from '@pages/admin/company/AboutSettings';

import CategoriesList from '@pages/admin/categories/CategoriesList';

import ProjectsList from '@pages/admin/projects/ProjectsList';
import ProjectCreate from '@pages/admin/projects/ProjectCreate';
import ProjectEdit from '@pages/admin/projects/ProjectEdit';

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
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:slug" element={<ProjectDetail />} />
                </Route>

                <Route path="/admin/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<Dashboard />} />

                        <Route path="/admin/services" element={<ServicesList />} />
                        <Route path="/admin/services/new" element={<ServiceCreate />} />
                        <Route path="/admin/services/edit/:id" element={<ServiceEdit />} />

                        <Route path="/admin/settings" element={<CompanySettings />} />
                        <Route path="/admin/about" element={<AboutSettings />} />
                        <Route path="/admin/clients" element={<ClientsList />} />

                        <Route path="/admin/categories" element={<CategoriesList />} />

                        <Route path="/admin/projects" element={<ProjectsList />} />
                        <Route path="/admin/projects/new" element={<ProjectCreate />} />
                        <Route path="/admin/projects/edit/:slug" element={<ProjectEdit />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}