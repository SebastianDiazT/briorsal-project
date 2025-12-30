import React, { useEffect, useState, useRef } from 'react';
import {
    FaBuilding,
    FaPlus,
    FaTrash,
    FaEdit,
    FaCloudUploadAlt,
    FaTimes,
    FaSave,
    FaChevronLeft,
    FaChevronRight,
    FaUndo,
    FaChartPie,
    FaSearch,
    FaAngleDown,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
} from '@store/slices/companySlice';
import { ClientLogo } from '@/types';
import { ConfirmModal } from '@components/ui/ConfirmModal';
import PageMeta from '@components/common/PageMeta';

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const ClientsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { clients, loading } = useAppSelector((state) => state.company);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<ClientLogo | null>(null);
    const [name, setName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);

    const [clientToDelete, setClientToDelete] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    const filteredClients = clients.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const count = filteredClients.length;
    const totalPages = Math.ceil(count / pageSize);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPages > 0 && currentPage === 0) {
            setCurrentPage(1);
        }
        if (count > 0 && currentPage === 0) setCurrentPage(1);
    }, [count, currentPage, totalPages]);

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentClients = filteredClients.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const openModal = (client?: ClientLogo) => {
        if (client) {
            setEditingClient(client);
            setName(client.name);
            setPreviewUrl(client.image);
            setSelectedFile(null);
        } else {
            setEditingClient(null);
            setName('');
            setPreviewUrl('');
            setSelectedFile(null);
        }
        setIsDragActive(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
        setName('');
        setPreviewUrl('');
        setSelectedFile(null);
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Solo se permiten imágenes');
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        if (!editingClient && !name) {
            setName(file.name.split('.')[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover')
            setIsDragActive(true);
        else if (e.type === 'dragleave') setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };

    const restoreOriginalImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (editingClient) {
            setPreviewUrl(editingClient.image);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        if (selectedFile) formData.append('image', selectedFile);

        let result;
        if (editingClient) {
            result = await dispatch(
                updateClient({ id: editingClient.id, data: formData })
            );
        } else {
            if (!selectedFile) return toast.error('La imagen es obligatoria');
            result = await dispatch(createClient(formData));
        }

        if (
            createClient.fulfilled.match(result) ||
            updateClient.fulfilled.match(result)
        ) {
            toast.success(
                editingClient ? 'Cliente actualizado' : 'Cliente creado'
            );
            closeModal();
            if (!editingClient)
                setCurrentPage(Math.ceil((count + 1) / pageSize));
        } else {
            toast.error('Ocurrió un error');
        }
    };

    const handleDeleteConfirm = async () => {
        if (clientToDelete) {
            await dispatch(deleteClient(clientToDelete));
            toast.success('Cliente eliminado');
            setClientToDelete(null);
        }
    };

    return (
        <>
            <PageMeta
                title="GESTIÓN DE CLIENTES"
                description="Administra los logos de clientes que confían en nosotros."
            />

            <div className="w-full animate-fade-in-up pb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-white text-brand-600 flex items-center justify-center border border-brand-100 shadow-sm shadow-brand-100/50">
                            <FaBuilding size={28} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                Gestión de Clientes
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200">
                                    <FaChartPie
                                        size={10}
                                        className="text-slate-400"
                                    />
                                    {clients.length} Registros
                                </span>
                                <span className="flex items-center gap-1.5 bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-brand-100">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                                    </span>
                                    Visible en Web
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto relative z-10">
                        <button
                            onClick={() => openModal()}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all active:scale-95 text-sm"
                        >
                            <FaPlus size={14} />
                            Nuevo Cliente
                        </button>
                    </div>
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:max-w-xs group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-xl leading-5 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 sm:text-sm transition-all font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end px-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide hidden sm:inline">
                            Mostrar:
                        </span>
                        <div className="relative">
                            <select
                                value={pageSize}
                                onChange={(e) =>
                                    setPageSize(Number(e.target.value))
                                }
                                className="appearance-none bg-slate-50 border border-slate-200 hover:border-brand-300 text-slate-700 text-sm font-bold rounded-lg pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                            >
                                {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt} filas
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                <FaAngleDown size={12} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6">
                        {filteredClients.length === 0 && !loading ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="relative mb-6 group">
                                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-500">
                                        {searchTerm ? (
                                            <FaSearch className="text-5xl text-slate-300" />
                                        ) : (
                                            <FaBuilding className="text-5xl text-slate-300" />
                                        )}
                                    </div>
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-brand-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

                                    <div className="absolute bottom-2 right-2 z-20 bg-white p-2 rounded-full shadow-md border border-slate-100">
                                        {searchTerm ? (
                                            <FaTimes
                                                className="text-red-400"
                                                size={14}
                                            />
                                        ) : (
                                            <FaPlus
                                                className="text-brand-500"
                                                size={14}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="text-center max-w-md mx-auto space-y-2">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {searchTerm
                                            ? 'No hay coincidencias'
                                            : 'No hay clientes registrados'}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed">
                                        {searchTerm ? (
                                            <>
                                                No encontramos clientes que
                                                coincidan con{' '}
                                                <span className="font-bold text-slate-700">
                                                    "{searchTerm}"
                                                </span>
                                                .<br />
                                                Revisa la ortografía o intenta
                                                con otro término.
                                            </>
                                        ) : (
                                            'Añade el logo de tu primer cliente para que aparezca en el carrusel de la página web.'
                                        )}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    {searchTerm ? (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-brand-600 hover:border-brand-300 transition-all shadow-sm active:scale-95"
                                        >
                                            <FaTimes /> Limpiar búsqueda
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => openModal()}
                                            className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:-translate-y-1 transition-all"
                                        >
                                            <FaPlus /> Agregar Cliente
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {currentClients.map((client) => (
                                    <div
                                        key={client.id}
                                        className="group relative bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-brand-200 transition-all overflow-hidden"
                                    >
                                        <div className="h-32 p-4 flex items-center justify-center bg-slate-50 relative">
                                            <img
                                                src={client.image}
                                                alt={client.name}
                                                className="max-h-full max-w-full object-contain transition-all duration-300"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                <button
                                                    onClick={() =>
                                                        openModal(client)
                                                    }
                                                    className="p-3 bg-white text-brand-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                                                    title="Editar"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setClientToDelete(
                                                            client.id
                                                        )
                                                    }
                                                    className="p-3 bg-white text-red-500 rounded-full shadow-lg hover:scale-110 transition-transform"
                                                    title="Eliminar"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-3 border-t border-slate-100 bg-white">
                                            <h4
                                                className="text-center font-bold text-slate-700 text-xs uppercase tracking-wide truncate"
                                                title={client.name}
                                            >
                                                {client.name}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {count > 0 && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="text-xs text-slate-500 font-medium">
                                Mostrando{' '}
                                <span className="font-bold text-slate-700">
                                    {Math.min(
                                        (currentPage - 1) * pageSize + 1,
                                        count
                                    )}
                                </span>{' '}
                                -{' '}
                                <span className="font-bold text-slate-700">
                                    {Math.min(currentPage * pageSize, count)}
                                </span>{' '}
                                de{' '}
                                <span className="font-bold text-slate-700">
                                    {count}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1)
                                        )
                                    }
                                    disabled={currentPage === 1 || loading}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:text-brand-600 hover:border-brand-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                >
                                    <FaChevronLeft size={10} />
                                    <span className="hidden sm:inline">
                                        Anterior
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            p < totalPages ? p + 1 : p
                                        )
                                    }
                                    disabled={
                                        currentPage >= totalPages || loading
                                    }
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:text-brand-600 hover:border-brand-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                >
                                    <span className="hidden sm:inline">
                                        Siguiente
                                    </span>
                                    <FaChevronRight size={10} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800">
                                    {editingClient
                                        ? 'Editar Cliente'
                                        : 'Nuevo Cliente'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="p-6 space-y-5"
                            >
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    className={`
                                    w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden
                                    ${isDragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-500 hover:bg-slate-50'}
                                    bg-slate-50
                                `}
                                >
                                    {previewUrl ? (
                                        <>
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-contain p-4"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <span className="text-white text-xs font-bold flex items-center gap-1 mb-2">
                                                    <FaCloudUploadAlt
                                                        size={20}
                                                    />{' '}
                                                    Cambiar
                                                </span>
                                                {editingClient &&
                                                    selectedFile && (
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                restoreOriginalImage
                                                            }
                                                            className="bg-white/20 hover:bg-white/40 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm transition-all"
                                                        >
                                                            <FaUndo /> Restaurar
                                                            Original
                                                        </button>
                                                    )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <FaCloudUploadAlt
                                                className={`text-4xl mb-2 transition-colors ${isDragActive ? 'text-brand-500' : 'text-slate-400'}`}
                                            />
                                            <span
                                                className={`text-sm font-bold transition-colors ${isDragActive ? 'text-brand-600' : 'text-slate-500'}`}
                                            >
                                                {isDragActive
                                                    ? 'Suelta la imagen aquí'
                                                    : 'Clic o arrastra imagen'}
                                            </span>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                                        Nombre de la Empresa
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all font-medium"
                                        placeholder="Ej: Minera Cerro Verde"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            (!editingClient && !selectedFile)
                                        }
                                        className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            'Guardando...'
                                        ) : (
                                            <>
                                                <FaSave /> Guardar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <ConfirmModal
                    isOpen={!!clientToDelete}
                    title="¿Eliminar Cliente?"
                    message="Esta acción quitará el logo de la página de inicio."
                    confirmText="Eliminar"
                    isDestructive
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setClientToDelete(null)}
                />
            </div>
        </>
    );
};
export default ClientsList;
