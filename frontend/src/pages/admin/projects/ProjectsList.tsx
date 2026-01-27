import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaPlus,
    FaBuilding,
    FaExternalLinkAlt,
    FaSortAmountDown,
    FaSave,
    FaSpinner,
    FaGripVertical,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import {
    useGetProjectsQuery,
    useDeleteProjectMutation,
    useReorderProjectsMutation,
} from '@features/projects/api/projectsApi';
import { useGetCategoriesQuery } from '@features/categories/api/categoriesApi';
import { Project } from '@features/projects/types';

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
    const [filterFeatured, setFilterFeatured] = useState(false);

    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [isReordering, setIsReordering] = useState(false);
    const [localProjects, setLocalProjects] = useState<Project[]>([]);

    const isShowingAll = pageSize === -1;

    const hasActiveFilters = !!(
        searchTerm ||
        filterCategory ||
        filterStatus ||
        filterFeatured
    );

    const {
        data: response,
        isLoading: isLoadingProjects,
        isFetching,
        isError,
        refetch,
    } = useGetProjectsQuery({
        page: isReordering ? undefined : page,
        pageSize: isReordering ? undefined : pageSize,
        no_page: isReordering,
        search: isReordering ? '' : searchTerm,
        categories: isReordering ? '' : filterCategory,
        status: isReordering ? '' : filterStatus,
        is_featured: isReordering ? undefined : filterFeatured,
        ordering: !hasActiveFilters ? 'sort_order' : undefined,
    });

    const { data: categoriesResponse } = useGetCategoriesQuery({
        no_page: true,
    });
    const categories = categoriesResponse?.data || [];

    const [deleteProject, { isLoading: isDeleting }] =
        useDeleteProjectMutation();
    const [reorderProjects, { isLoading: isSavingOrder }] =
        useReorderProjectsMutation();

    const projectsFromApi = response?.data || [];
    const meta = response?.meta;

    useEffect(() => {
        if (projectsFromApi) {
            setLocalProjects(projectsFromApi);
        }
    }, [projectsFromApi]);

    useEffect(() => {
        if (
            !isFetching &&
            !isLoadingProjects &&
            !isError &&
            projectsFromApi.length === 0 &&
            page > 1
        ) {
            setPage((prev) => Math.max(prev - 1, 1));
        }

        if (isError && page > 1) {
            setPage((prev) => Math.max(prev - 1, 1));
        }
    }, [projectsFromApi.length, isFetching, isLoadingProjects, isError, page]);
    const handleStartReorder = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterStatus('');
        setFilterFeatured(false);
        setPage(1);
        setIsReordering(true);
        toast('Modo reordenar activado. Arrastra las filas.', { icon: '✋' });
    };

    const handleCancelReorder = () => {
        setIsReordering(false);
        refetch();
        toast('Cambios descartados');
    };

    const handleSaveOrder = async () => {
        const offset = (page - 1) * (isShowingAll ? 1000 : pageSize);
        const itemsToUpdate = localProjects.map((project, index) => ({
            id: project.id,
            sort_order: offset + index + 1,
        }));

        try {
            await reorderProjects({ items: itemsToUpdate }).unwrap();
            toast.success('Nuevo orden guardado correctamente');
            setIsReordering(false);
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar el orden');
        }
    };

    const handleLocalReorder = (newOrder: Project[]) => {
        setLocalProjects(newOrder);
    };

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

    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterStatus('');
        setFilterFeatured(false);
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

    const showLoading = isLoadingProjects || isFetching || isDeleting;

    const emptyStateProps = hasActiveFilters
        ? {
              title: 'No se encontraron resultados',
              description:
                  'No encontramos proyectos que coincidan con los filtros aplicados.',
              isFiltered: true,
              onClear: clearFilters,
          }
        : {
              title: 'El portafolio está vacío',
              description: 'Aún no has agregado ningún proyecto.',
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

            <div className="w-full animate-fade-in-up pb-20">
                <PageHeader
                    title={
                        isReordering
                            ? 'Reordenando Proyectos'
                            : 'Portafolio de Proyectos'
                    }
                    breadcrumbs={['Administración', 'Proyectos']}
                    icon={isReordering ? FaSortAmountDown : FaBuilding}
                    totalRecords={
                        isReordering
                            ? localProjects.length
                            : meta?.total_records || 0
                    }
                >
                    {isReordering ? (
                        <div className="flex items-center gap-3 animate-fade-in">
                            <button
                                onClick={handleCancelReorder}
                                disabled={isSavingOrder}
                                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveOrder}
                                disabled={isSavingOrder}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-600/30 hover:bg-orange-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSavingOrder ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    <FaSave />
                                )}
                                Guardar Orden
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/proyectos"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden lg:flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold shadow-sm hover:bg-slate-50 hover:text-orange-600 hover:border-orange-200 hover:-translate-y-0.5 transition-all"
                                title="Ver en Web"
                            >
                                <FaExternalLinkAlt size={14} />
                            </Link>

                            <button
                                onClick={handleStartReorder}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold shadow-sm hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 hover:-translate-y-0.5 transition-all"
                                title="Cambiar el orden visual de los proyectos"
                            >
                                <FaSortAmountDown size={14} />
                                <span className="hidden sm:inline">
                                    Ordenar
                                </span>
                            </button>

                            <Link
                                to="/admin/projects/new"
                                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-orange-600 hover:shadow-orange-600/30 hover:-translate-y-0.5 transition-all active:scale-95"
                            >
                                <FaPlus size={12} className="opacity-80" />
                                <span className="hidden sm:inline">Nuevo</span>
                            </Link>
                        </div>
                    )}
                </PageHeader>

                {!isReordering && (
                    <div className="animate-fade-in-down">
                        <ProjectFilters
                            searchTerm={searchTerm}
                            onSearchChange={handleSearch}
                            filterCategory={filterCategory}
                            onCategoryChange={handleCategory}
                            filterStatus={filterStatus}
                            onStatusChange={handleStatus}
                            categories={categories}
                            hasActiveFilters={hasActiveFilters}
                            onClear={clearFilters}
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSize}
                            filterFeatured={filterFeatured}
                            onFeaturedChange={handleFeatured}
                        />
                    </div>
                )}

                {isReordering && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex items-center gap-3 text-orange-800 animate-fade-in-up">
                        <FaSortAmountDown className="text-xl" />
                        <div>
                            <p className="font-bold text-sm">
                                Modo de Organización Activo
                            </p>
                            <p className="text-xs opacity-80">
                                Arrastra las filas usando el icono{' '}
                                <FaGripVertical className="inline" /> para
                                cambiar su posición. Los filtros están
                                desactivados temporalmente.
                            </p>
                        </div>
                    </div>
                )}

                <ProjectsTable
                    projects={localProjects}
                    isLoading={showLoading}
                    onEdit={(slug) => navigate(`/admin/projects/edit/${slug}`)}
                    onDelete={setProjectToDelete}
                    isReordering={isReordering}
                    onReorderChange={handleLocalReorder}
                    EmptyState={() => <EmptyState {...emptyStateProps} />}
                />

                <div className={isReordering ? 'hidden' : 'block'}>
                    <ProjectsMobileList
                        projects={localProjects}
                        isLoading={showLoading}
                        onEdit={(slug) =>
                            navigate(`/admin/projects/edit/${slug}`)
                        }
                        onDelete={setProjectToDelete}
                        EmptyState={() => <EmptyState {...emptyStateProps} />}
                    />
                </div>

                {!isReordering && (
                    <PaginationFooter meta={meta} onPageChange={setPage} />
                )}

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
