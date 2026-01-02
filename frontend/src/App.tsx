import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router';

import AdminLayout from '@/layouts/admin/AdminLayout';

import { AppToast } from '@components/ui/AppToast';

import { ProtectedRoute } from '@features/auth/components/ProtectedRoute';
import { PublicRoute } from '@features/auth/components/PublicRoute';

import ProjectsList from '@pages/admin/projects/ProjectsList';
import ProjectCreate from '@pages/admin/projects/ProjectCreate';
import ProjectEdit from '@pages/admin/projects/ProjectEdit';

import Login from '@pages/admin/Login';

export default function App() {
    return (
        <Router>
            <AppToast />
            <Routes>
                {/* <Route element={<UserLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:slug" element={<ProjectDetail />} />
                </Route> */}

                <Route element={<PublicRoute />}>
                    <Route path="/admin/login" element={<Login />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<><h1>Dashboard</h1></>} />

                        <Route path="projects" element={<ProjectsList />} />
                        <Route path="projects/new" element={<ProjectCreate />} />
                        <Route path="projects/edit/:slug" element={<ProjectEdit />} />
                        
                        {/* <Route path="/admin/dashboard" element={<Dashboard />} />

                        <Route path="/admin/services" element={<ServicesList />} />
                        <Route path="/admin/services/new" element={<ServiceCreate />} />
                        <Route path="/admin/services/edit/:id" element={<ServiceEdit />} />

                        <Route path="/admin/settings" element={<CompanySettings />} />
                        <Route path="/admin/about" element={<AboutSettings />} />
                        <Route path="/admin/clients" element={<ClientsList />} />

                        <Route path="/admin/categories" element={<CategoriesList />} />

                        <Route path="/admin/projects" element={<ProjectsList />} />
                        <Route path="/admin/projects/new" element={<ProjectCreate />} />
                        <Route path="/admin/projects/edit/:slug" element={<ProjectEdit />} /> */}
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}