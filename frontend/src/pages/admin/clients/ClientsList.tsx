import React, { useState, useEffect } from 'react';
import { FaHandshake, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

import PageMeta from '@/components/common/PageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { PaginationFooter } from '@/components/ui/PaginationFooter';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

import { ClientFilters } from '@/features/clients/components/admin/ClientFilters';
import { ClientsTable } from '@/features/clients/components/admin/ClientsTable';
import { ClientFormModal } from '@/features/clients/components/admin/ClientFormModal';
import {
    useGetClientsQuery,
    useDeleteClientMutation,
} from '@/features/clients/api/clientsApi';
import { Client } from '@/features/clients/types';

const ClientsList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<number | null>(null);

    const isShowingAll = pageSize === -1;

    const {
        data: response,
        isLoading,
        isFetching,
        isError,
    } = useGetClientsQuery({
        page,
        pageSize: isShowingAll ? 1000 : pageSize,
        search: searchTerm,
        no_page: isShowingAll,
    });

    const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

    const clients = response?.data || [];
    const meta = response?.meta;
    const showLoading = isLoading || isFetching;

    const handleOpenCreate = () => {
        setClientToEdit(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (client: Client) => {
        setClientToEdit(client);
        setIsFormOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (clientToDelete) {
            try {
                await deleteClient(clientToDelete).unwrap();
                toast.success('Cliente eliminado correctamente');
                setClientToDelete(null);
            } catch (error) {
                toast.error('Error al eliminar el cliente');
            }
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setPage(1);
    };

    useEffect(() => {
        if (!showLoading && !isError && clients.length === 0 && page > 1) {
            setPage((prev) => prev - 1);
        }
        if (isError && page > 1 && !isFetching) {
            setPage((prev) => prev - 1);
        }
    }, [clients.length, showLoading, isError, page]);

    const emptyStateProps = searchTerm
        ? {
            title: 'Sin resultados',
            description: 'Intenta con otro nombre de cliente.',
            isFiltered: true,
            onClear: handleClearFilters,
        }
        : {
            title: 'Sin Clientes',
            description:
                'Agrega los logos de las empresas que confían en Briorsal.',
            isFiltered: false,
            createText: 'Agregar Primer Cliente',
            onCreate: handleOpenCreate,
        };

    return (
        <>
            <PageMeta
                title="GESTIÓN DE CLIENTES"
                description="Administrar logos de aliados y clientes"
            />

            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Clientes y Aliados"
                    breadcrumbs={['Administración', 'Clientes']}
                    icon={FaHandshake}
                    totalRecords={meta?.total_records || 0}
                >
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-orange-600 transition-all active:scale-95"
                    >
                        <FaPlus size={12} className="opacity-80" />
                        <span>Agregar Cliente</span>
                    </button>
                </PageHeader>

                <div className="max-w-7xl mx-auto">
                    <ClientFilters
                        searchTerm={searchTerm}
                        onSearchChange={(val) => {
                            setSearchTerm(val);
                            setPage(1);
                        }}
                        pageSize={pageSize}
                        onPageSizeChange={(val) => {
                            setPageSize(val);
                            setPage(1);
                        }}
                        onClear={handleClearFilters}
                    />

                    <ClientsTable
                        clients={clients}
                        isLoading={showLoading}
                        onEdit={handleOpenEdit}
                        onDelete={setClientToDelete}
                        EmptyState={() => <EmptyState {...emptyStateProps} />}
                    />

                    {meta && meta.total_records > 0 && !isShowingAll && (
                        <PaginationFooter meta={meta} onPageChange={setPage} />
                    )}
                </div>

                <ClientFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    clientToEdit={clientToEdit}
                />

                <ConfirmModal
                    isOpen={!!clientToDelete}
                    title="¿Eliminar Cliente?"
                    message="Se eliminará el logo y el registro de la base de datos."
                    confirmText={isDeleting ? 'Eliminando...' : 'Eliminar'}
                    isDestructive
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setClientToDelete(null)}
                />
            </div>
        </>
    );
};

export default ClientsList;
