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

const ITEMS_PER_PAGE = 15;

const ClientsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { clients, loading } = useAppSelector((state) => state.company);

    const [currentPage, setCurrentPage] = useState(1);
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

    const count = clients.length;
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [count, currentPage, totalPages]);

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem);

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
                setCurrentPage(Math.ceil((count + 1) / ITEMS_PER_PAGE));
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
        <div className="w-full animate-fade-in-up pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FaBuilding className="text-brand-600" />
                        Nuestros Clientes
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Gestiona los logos de las empresas aliadas.
                    </p>
                </div>

                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 hover:-translate-y-0.5 transition-all text-sm"
                >
                    <FaPlus size={12} />
                    Agregar Cliente
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6">
                    {clients.length === 0 && !loading ? (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <FaBuilding className="mx-auto text-4xl text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium mb-4">
                                No hay clientes registrados.
                            </p>
                            <button
                                onClick={() => openModal()}
                                className="text-brand-600 font-bold hover:underline text-sm"
                            >
                                Sube el primero ahora &rarr;
                            </button>
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
                                            className="max-h-full max-w-full object-contain group-hover:grayscale-0 transition-all duration-300"
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
                                                    setClientToDelete(client.id)
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
                                    (currentPage - 1) * ITEMS_PER_PAGE + 1,
                                    count
                                )}
                            </span>{' '}
                            -{' '}
                            <span className="font-bold text-slate-700">
                                {Math.min(currentPage * ITEMS_PER_PAGE, count)}
                            </span>{' '}
                            de{' '}
                            <span className="font-bold text-slate-700">
                                {count}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
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
                                disabled={currentPage >= totalPages || loading}
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

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div
                                onClick={() => fileInputRef.current?.click()}
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
                                                <FaCloudUploadAlt size={20} />{' '}
                                                Cambiar
                                            </span>
                                            {editingClient && selectedFile && (
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
                                    onChange={(e) => setName(e.target.value)}
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
    );
};

export default ClientsList;
