import React, { useState, useEffect, useMemo } from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';

import {
    useGetContactMessagesQuery,
    useUpdateContactMessageStatusMutation,
} from '@/features/contact/api/contactApi';
import { ContactMessage } from '@/features/contact/types';

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
    const [filterStatus, setFilterStatus] = useState('');

    const [selectedMessage, setSelectedMessage] =
        useState<ContactMessage | null>(null);

    const isShowingAll = pageSize === -1;

    const {
        data: response,
        isLoading: isLoadingMessages,
        isFetching,
        isError,
    } = useGetContactMessagesQuery({
        page,
        pageSize: isShowingAll ? 1000 : pageSize,
        search: searchTerm,
        no_page: isShowingAll,
    });

    const [updateStatus] = useUpdateContactMessageStatusMutation();

    const messages = response?.data || [];
    const meta = response?.meta;

    const filteredMessages = useMemo(() => {
        if (filterStatus === '') return messages;
        if (filterStatus === 'unread')
            return messages.filter((m) => !m.is_read);
        if (filterStatus === 'read') return messages.filter((m) => m.is_read);
        return messages;
    }, [messages, filterStatus]);

    useEffect(() => {
        if (
            !isFetching &&
            !isLoadingMessages &&
            !isError &&
            filteredMessages.length === 0 &&
            page > 1
        ) {
            setPage((prev) => prev - 1);
        }
    }, [filteredMessages.length, isFetching, isLoadingMessages, isError, page]);

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        setPage(1);
    };
    const handleStatus = (val: string) => {
        setFilterStatus(val);
        setPage(1);
    };
    const handlePageSize = (val: number) => {
        setPageSize(val);
        setPage(1);
    };

    const handleViewMessage = (msg: ContactMessage) => {
        setSelectedMessage(msg);
        if (!msg.is_read) {
            updateStatus({ id: msg.id, is_read: true });
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('');
        setPage(1);
    };

    const hasActiveFilters = !!(searchTerm || filterStatus !== '');
    const showLoading = isLoadingMessages || isFetching;

    const emptyStateProps = hasActiveFilters
        ? {
            title: 'No se encontraron resultados',
            description: 'No encontramos mensajes con esos filtros.',
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
                description="Gestión de mensajes"
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
                        filterStatus={filterStatus}
                        onStatusChange={handleStatus}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSize}
                        onClear={clearFilters}
                    />

                    <MessagesTable
                        messages={filteredMessages}
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
                />
            </div>
        </>
    );
};

export default ContactList;
