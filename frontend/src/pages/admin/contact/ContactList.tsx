import React, { useState } from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';

import {
    useGetContactMessagesQuery,
    useUpdateContactMessageMutation,
} from '@/features/contact/api/contactApi';
import { ContactMessage, ContactStatus } from '@/features/contact/types';

import PageMeta from '@/components/common/PageMeta';
import { PageHeader } from '@/components/ui/PageHeader';
import { PaginationFooter } from '@/components/ui/PaginationFooter';
import { EmptyState } from '@/components/ui/EmptyState';

import { ContactFilters } from '@/features/contact/components/admin/ContactFilters';
import { MessagesTable } from '@/features/contact/components/admin/MessagesTable';
import { MessageDetailModal } from '@/features/contact/components/admin/MessageDetailModal';

const ContactList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [inquiryFilter, setInquiryFilter] = useState<string>('');

    const [selectedMessage, setSelectedMessage] =
        useState<ContactMessage | null>(null);

    const isShowingAll = pageSize === -1;

    const {
        data: response,
        isLoading: isLoadingMessages,
        isFetching,
    } = useGetContactMessagesQuery({
        page,
        pageSize: isShowingAll ? 1000 : pageSize,
        search: searchTerm,
        status: statusFilter,
        inquiry_type: inquiryFilter,
    });

    const [updateMessage] = useUpdateContactMessageMutation();

    const messages = response?.data || [];
    const meta = response?.meta;

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        setPage(1);
    };
    const handlePageSize = (val: number) => {
        setPageSize(val);
        setPage(1);
    };

    const handleViewMessage = (msg: ContactMessage) => {
        setSelectedMessage(msg);
        if (msg.status === 'NEW') {
            updateMessage({
                id: msg.id,
                data: { status: 'IN_PROGRESS' },
            });
        }
    };

    const handleStatusChange = (id: number, newStatus: ContactStatus) => {
        updateMessage({ id, data: { status: newStatus } });
        if (selectedMessage && selectedMessage.id === id) {
            setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setInquiryFilter('');
        setPage(1);
    };

    const hasActiveFilters = !!(searchTerm || statusFilter || inquiryFilter);
    const showLoading = isLoadingMessages || isFetching;

    const emptyStateProps = hasActiveFilters
        ? {
              title: 'No se encontraron resultados',
              description: 'Intenta ajustar los filtros de búsqueda.',
              isFiltered: true,
              onClear: clearFilters,
          }
        : {
              title: 'Buzón de entrada vacío',
              description: 'Aún no has recibido mensajes de contacto.',
              isFiltered: false,
          };

    return (
        <>
            <PageMeta
                title="BUZÓN DE CONTACTO"
                description="Gestión de mensajes y leads"
            />

            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Buzón de Mensajes"
                    breadcrumbs={['Administración', 'Contacto']}
                    icon={FaEnvelopeOpenText}
                    totalRecords={meta?.total_records}
                />

                <div className="max-w-7xl mx-auto">
                    <ContactFilters
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        inquiryFilter={inquiryFilter}
                        onInquiryChange={setInquiryFilter}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSize}
                        onClear={clearFilters}
                    />

                    <MessagesTable
                        messages={messages}
                        isLoading={showLoading}
                        onView={handleViewMessage}
                        EmptyState={() => <EmptyState {...emptyStateProps} />}
                    />

                    {meta && meta.total_records > 0 && !isShowingAll && (
                        <PaginationFooter meta={meta} onPageChange={setPage} />
                    )}
                </div>

                <MessageDetailModal
                    isOpen={!!selectedMessage}
                    onClose={() => setSelectedMessage(null)}
                    message={selectedMessage}
                    onStatusChange={handleStatusChange}
                />
            </div>
        </>
    );
};

export default ContactList;
