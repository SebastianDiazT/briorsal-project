import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router';

import AdminLayout from '@layouts/admin/AdminLayout';
import UserLayout from '@layouts/user/UserLayout';

import { AppToast } from '@components/ui/AppToast';

import { ProtectedRoute } from '@features/auth/components/ProtectedRoute';
import { PublicRoute } from '@features/auth/components/PublicRoute';

import CategoriesList from '@pages/admin/categories/CategoriesList';
import CategoryCreate from '@pages/admin/categories/CategoryCreate';
import CategoryEdit from '@pages/admin/categories/CategoryEdit';

import ProjectsList from '@pages/admin/projects/ProjectsList';
import ProjectCreate from '@pages/admin/projects/ProjectCreate';
import ProjectEdit from '@pages/admin/projects/ProjectEdit';

import CompanyInfoPage from '@pages/admin/company/CompanyInfoPage';
import AboutUsPage from '@pages/admin/company/AboutUsPage';

import ServicesList from '@pages/admin/services/ServicesList';
import ServiceCreate from '@pages/admin/services/ServiceCreate';
import ServiceEdit from '@pages/admin/services/ServiceEdit';

import ContactList from '@pages/admin/contact/ContactList';

import Login from '@pages/admin/Login';

import ProjectsPage from '@pages/public/projects/ProjectsPage';
import ProjectDetailPage from '@pages/public/projects/ProjectDetailPage';
import About from '@pages/public/About';
import Services from '@pages/public/Services';
import Contact from '@pages/public/Contact';
import NotFound from '@/pages/public/NotFound';

export default function App() {
    return (
        <Router>
            <AppToast />
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/proyectos" element={<ProjectsPage />} />
                    <Route path="/proyectos/:slug" element={<ProjectDetailPage />} />
                    <Route path="/nosotros" element={<About />} />
                    <Route path="/servicios" element={<Services />} />
                    <Route path="/contacto" element={<Contact />} />
                </Route>

                <Route element={<PublicRoute />}>
                    <Route path="/admin/login" element={<Login />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<>Dashboard</>} />

                        <Route path="categories" element={<CategoriesList />} />
                        <Route path="categories/new" element={<CategoryCreate />} />
                        <Route path="categories/edit/:id" element={<CategoryEdit />} />

                        <Route path="projects" element={<ProjectsList />} />
                        <Route path="projects/new" element={<ProjectCreate />} />
                        <Route path="projects/edit/:slug" element={<ProjectEdit />} />

                        <Route path="company" element={<CompanyInfoPage />} />
                        <Route path="about" element={<AboutUsPage />} />

                        <Route path="services" element={<ServicesList />} />
                        <Route path="services/new" element={<ServiceCreate />} />
                        <Route path="services/edit/:id" element={<ServiceEdit />} />

                        <Route path="messages" element={<ContactList />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}
