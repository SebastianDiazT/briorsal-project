import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaHardHat, FaExternalLinkAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

import {
    useGetServicesQuery,
    useDeleteServiceMutation,
} from '@/features/services/api/servicesApi';
import { Service } from '@/features/services/types';

import PageMeta from '@components/common/PageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { ConfirmModal } from '@components/ui/ConfirmModal';
import { PaginationFooter } from '@components/ui/PaginationFooter';
import { EmptyState } from '@components/ui/EmptyState';

import { ServiceFilters } from '@/features/services/components/admin/ServiceFilters';
import { ServicesTable } from '@/features/services/components/admin/ServicesTable';

const ServicesList: React.FC = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

    const isShowingAll = pageSize === -1;

    const {
        data: response,
        isLoading: loading,
        isFetching,
        isError,
    } = useGetServicesQuery({
        page: isShowingAll ? 1 : page,
        pageSize: isShowingAll ? 1000 : pageSize,
        search: searchTerm,
        no_page: isShowingAll,
    });

    const [deleteService, { isLoading: isDeleting }] =
        useDeleteServiceMutation();

    const services = response?.data || [];
    const meta = response?.meta;

    useEffect(() => {
        if (
            !isFetching &&
            !loading &&
            !isError &&
            services.length === 0 &&
            page > 1
        ) {
            setPage((prev) => prev - 1);
        }
        if (isError && page > 1 && !isFetching) {
            setPage((prev) => prev - 1);
        }
    }, [services.length, isFetching, loading, isError, page]);

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        setPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setPage(1);
    };

    const handleCreate = () => {
        navigate('/admin/services/new');
    };

    const handleEdit = (service: Service) => {
        navigate(`/admin/services/edit/${service.id}`);
    };

    const handleDeleteConfirm = async () => {
        if (serviceToDelete) {
            try {
                await deleteService(serviceToDelete).unwrap();
                toast.success('Servicio eliminado');
                setServiceToDelete(null);
            } catch (error) {
                toast.error('Error al eliminar');
            }
        }
    };

    const isLoadingData = loading || isFetching;

    const emptyStateProps = searchTerm
        ? {
            title: 'No se encontraron resultados',
            description: 'Intenta con otros términos de búsqueda.',
            isFiltered: true,
            onClear: clearFilters,
        }
        : {
            title: 'Catálogo de Servicios',
            description: 'Registra los servicios que ofrece tu empresa.',
            isFiltered: false,
            createText: 'Crear Primer Servicio',
            onCreate: handleCreate,
            createLink: '/admin/services/new',
        };

    const EmptyStateComponent = () => <EmptyState {...emptyStateProps} />;

    return (
        <>
            <PageMeta
                title="GESTIÓN DE SERVICIOS"
                description="Panel Administrativo de Servicios"
            />

            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Catálogo de Servicios"
                    breadcrumbs={['Administración', 'Servicios']}
                    icon={FaHardHat}
                    totalRecords={meta?.total_records || 0}
                >
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/servicios"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300"
                            title="Ver página de servicios en nueva pestaña"
                        >
                            <FaExternalLinkAlt size={14} />
                            <span className="hidden sm:inline">
                                Ver Sitio Web
                            </span>
                            <span className="sm:hidden">Ver</span>
                        </Link>

                        <button
                            onClick={handleCreate}
                            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-orange-600 hover:shadow-orange-600/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                        >
                            <FaPlus size={12} className="opacity-80" />
                            <span className="hidden sm:inline">
                                Crear Servicio
                            </span>
                            <span className="sm:hidden">Crear</span>
                        </button>
                    </div>
                </PageHeader>

                <ServiceFilters
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    hasActiveFilters={!!searchTerm}
                    onClear={clearFilters}
                />

                <ServicesTable
                    services={services}
                    isLoading={isLoadingData}
                    onEdit={handleEdit}
                    onDelete={setServiceToDelete}
                    EmptyState={EmptyStateComponent}
                />

                {meta && meta.total_records > 0 && (
                    <PaginationFooter meta={meta} onPageChange={setPage} />
                )}
                <ConfirmModal
                    isOpen={!!serviceToDelete}
                    title="¿Eliminar Servicio?"
                    message="Se eliminará permanentemente y dejará de ser visible."
                    confirmText={isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
                    isDestructive={true}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setServiceToDelete(null)}
                />
            </div>
        </>
    );
};

export default ServicesList;
