import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaLayerGroup } from 'react-icons/fa';
import toast from 'react-hot-toast';

import {
    useGetCategoriesQuery,
    useDeleteCategoryMutation,
} from '@/features/categories/api/categoriesApi';
import PageMeta from '@components/common/PageMeta';
import { ConfirmModal } from '@components/ui/ConfirmModal';
import { PageHeader } from '@components/ui/PageHeader';
import { PaginationFooter } from '@components/ui/PaginationFooter';
import { EmptyState } from '@components/ui/EmptyState';
import { CategoryFilters } from '@/features/categories/components/admin/CategoryFilters';
import { CategoriesTable } from '@/features/categories/components/admin/CategoriesTable';

const CategoriesList: React.FC = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(
        null
    );

    const isShowingAll = pageSize === -1;

    const {
        data: response,
        isLoading: isLoadingCategories,
        isFetching,
        isError,
    } = useGetCategoriesQuery({
        page,
        pageSize: isShowingAll ? 1000 : pageSize,
        no_page: isShowingAll,
        search: searchTerm,
    });

    const [deleteCategory, { isLoading: isDeleting }] =
        useDeleteCategoryMutation();

    const categories = response?.data || [];
    const meta = response?.meta;

    useEffect(() => {
        if (
            !isFetching &&
            !isLoadingCategories &&
            !isError &&
            categories.length === 0 &&
            page > 1
        ) {
            setPage((prev) => prev - 1);
        }

        if (isError && page > 1) {
            setPage((prev) => prev - 1);
        }
    }, [categories.length, isFetching, isLoadingCategories, isError, page]);

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        setPage(1);
    };

    const handlePageSizeChange = (val: number) => {
        setPageSize(val);
        setPage(1);
    };

    const handleDeleteConfirm = async () => {
        if (categoryToDelete) {
            try {
                await deleteCategory(categoryToDelete).unwrap();
                toast.success('Categoría eliminada correctamente');
                setCategoryToDelete(null);
            } catch (error: any) {
                const errorMsg =
                    error?.data?.message || 'Error al eliminar la categoría';
                toast.error(errorMsg);
            }
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setPage(1);
    };

    const hasActiveFilters = !!searchTerm;
    const showLoading = isLoadingCategories || isFetching || isDeleting;

    const emptyStateProps = hasActiveFilters
        ? {
            title: 'No se encontraron resultados',
            description:
                'No encontramos categorías que coincidan con los filtros aplicados. Intenta con otros términos.',
            isFiltered: true,
            onClear: clearFilters,
        }
        : {
            title: 'Sin Categorías',
            description: 'Crea categorías para organizar tus proyectos.',
            isFiltered: false,
            createLink: '/admin/categories/new',
            createText: 'Crear Categoría',
            onCreate: () => navigate('/admin/categories/new'),
        };

    return (
        <>
            <PageMeta title="GESTIÓN DE CATEGORÍAS" description="Gestión de Categorías" />

            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Gestión de Categorías"
                    breadcrumbs={['Administración', 'Categorías']}
                    icon={FaLayerGroup}
                    totalRecords={meta?.total_records || 0}
                >
                    <button
                        onClick={() => navigate('/admin/categories/new')}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-orange-600 transition-all active:scale-95"
                    >
                        <FaPlus size={12} className="opacity-80" />
                        <span>Nueva Categoría</span>
                    </button>
                </PageHeader>

                <div className="max-w-7xl mx-auto">
                    <CategoryFilters
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        onClear={clearFilters}
                    />

                    <CategoriesTable
                        categories={categories}
                        isLoading={showLoading}
                        onEdit={(id) =>
                            navigate(`/admin/categories/edit/${id}`)
                        }
                        onDelete={setCategoryToDelete}
                        EmptyState={() => <EmptyState {...emptyStateProps} />}
                    />

                    {meta && meta.total_records > 0 && !isShowingAll && (
                        <PaginationFooter meta={meta} onPageChange={setPage} />
                    )}
                </div>

                <ConfirmModal
                    isOpen={!!categoryToDelete}
                    title="¿Eliminar Categoría?"
                    message="Esto podría afectar a los proyectos asignados a esta categoría."
                    confirmText={isDeleting ? 'Eliminando...' : 'Eliminar'}
                    isDestructive={true}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setCategoryToDelete(null)}
                />
            </div>
        </>
    );
};

export default CategoriesList;
