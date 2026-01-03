import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaBuilding, FaExternalLinkAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

import {
    useGetProjectsQuery,
    useDeleteProjectMutation,
} from '@features/projects/api/projectsApi';
import { useGetCategoriesQuery } from '@features/categories/api/categoriesApi';
import PageMeta from '@components/common/PageMeta';
import { ConfirmModal } from '@components/ui/ConfirmModal';

import { EmptyState } from '@components/ui/EmptyState';
import { PageHeader } from '@components/ui/PageHeader';
import { PaginationFooter } from '@components/ui/PaginationFooter';
import { ProjectFilters } from '@features/projects/components/admin/ProjectFilters';
import { ProjectsTable } from '@features/projects/components/admin/ProjectsTable';
import { ProjectsMobileList } from '@features/projects/components/admin/ProjectsMobileList';

const ProjectsList: React.FC = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [filterFeatured, setFilterFeatured] = useState(false);
    const isShowingAll = pageSize === -1;

    const {
        data: response,
        isLoading: isLoadingProjects,
        isFetching,
        isError,
    } = useGetProjectsQuery({
        page,
        pageSize: isShowingAll ? 1000 : pageSize,
        no_page: isShowingAll,
        search: searchTerm,
        category: filterCategory,
        status: filterStatus,
        is_featured: filterFeatured,
    });

    const { data: categories = [] } = useGetCategoriesQuery();
    const [deleteProject, { isLoading: isDeleting }] =
        useDeleteProjectMutation();

    const projects = response?.data || [];
    const meta = response?.meta;

    useEffect(() => {
        if (
            !isFetching &&
            !isLoadingProjects &&
            !isError &&
            projects.length === 0 &&
            page > 1
        ) {
            setPage((prev) => prev - 1);
        }

        if (isError && page > 1) {
            setPage((prev) => prev - 1);
        }
    }, [projects.length, isFetching, isLoadingProjects, isError, page]);

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        setPage(1);
    };
    const handleCategory = (val: string) => {
        setFilterCategory(val);
        setPage(1);
    };
    const handleStatus = (val: string) => {
        setFilterStatus(val);
        setPage(1);
    };
    const handleFeatured = (val: boolean) => {
        setFilterFeatured(val);
        setPage(1);
    };

    const handlePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    const handleDeleteConfirm = async () => {
        if (projectToDelete) {
            try {
                await deleteProject(projectToDelete).unwrap();
                toast.success('Proyecto eliminado correctamente');
                setProjectToDelete(null);
            } catch (error) {
                toast.error('Error al eliminar el proyecto');
            }
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterStatus('');
        setFilterFeatured(false);
        setPage(1);
    };

    const hasActiveFilters = !!(searchTerm || filterCategory || filterStatus || filterFeatured);
    const showLoading = isLoadingProjects || isFetching || isDeleting;

    const emptyStateProps = hasActiveFilters
        ? {
            title: 'No se encontraron resultados',
            description:
                'No encontramos proyectos que coincidan con los filtros aplicados. Intenta con otros términos.',
            isFiltered: true,
            onClear: clearFilters,
        }
        : {
            title: 'El portafolio está vacío',
            description:
                'Aún no has agregado ningún proyecto a tu base de datos. Crea el primero para comenzar.',
            isFiltered: false,
            createLink: '/admin/projects/new',
            createText: 'Crear Proyecto',
        };

    return (
        <>
            <PageMeta
                title="GESTIÓN DE PROYECTOS"
                description="Panel Administrativo"
            />

            <div className="w-full animate-fade-in-up">
                <PageHeader
                    title="Portafolio de Proyectos"
                    breadcrumbs={['Administración', 'Proyectos']}
                    icon={FaBuilding}
                    totalRecords={meta?.total_records || 0}
                >
                    <Link
                        to="/proyectos"
                        target="_blank"
                        className="group flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5
                            bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-bold
                            shadow-sm hover:shadow-md hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50
                            transition-all active:scale-95 duration-200"
                    >
                        <FaExternalLinkAlt
                            size={12}
                            className="text-slate-400 group-hover:text-orange-500 transition-colors"
                        />
                        <span className="hidden sm:inline">Ver en Web</span>
                        <span className="sm:hidden">Ver</span>
                    </Link>

                    <Link
                        to="/admin/projects/new"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5
                            rounded-xl bg-slate-900 text-white text-sm font-bold
                            shadow-lg shadow-slate-900/20
                            hover:bg-orange-600 hover:shadow-orange-600/30 hover:-translate-y-0.5
                            transition-all duration-300 active:scale-95"
                    >
                        <FaPlus size={12} className="opacity-80" />
                        <span className="hidden sm:inline">Nuevo Proyecto</span>
                        <span className="sm:hidden">Nuevo</span>
                    </Link>
                </PageHeader>

                <ProjectFilters
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    filterCategory={filterCategory}
                    onCategoryChange={handleCategory}
                    filterStatus={filterStatus}
                    onStatusChange={handleStatus}
                    categories={categories}
                    hasActiveFilters={!!hasActiveFilters}
                    onClear={clearFilters}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSize}
                    filterFeatured={filterFeatured}
                    onFeaturedChange={handleFeatured}
                />

                <ProjectsTable
                    projects={projects}
                    isLoading={showLoading}
                    onEdit={(slug) => navigate(`/admin/projects/edit/${slug}`)}
                    onDelete={setProjectToDelete}
                    EmptyState={() => <EmptyState {...emptyStateProps} />}
                />

                <ProjectsMobileList
                    projects={projects}
                    isLoading={showLoading}
                    onEdit={(slug) => navigate(`/admin/projects/edit/${slug}`)}
                    onDelete={setProjectToDelete}
                    EmptyState={() => <EmptyState {...emptyStateProps} />}
                />

                <PaginationFooter meta={meta} onPageChange={setPage} />

                <ConfirmModal
                    isOpen={!!projectToDelete}
                    title="¿Eliminar Proyecto?"
                    message="Se eliminará permanentemente."
                    confirmText={isDeleting ? 'Eliminando...' : 'Eliminar'}
                    isDestructive={true}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setProjectToDelete(null)}
                />
            </div>
        </>
    );
};

export default ProjectsList;
