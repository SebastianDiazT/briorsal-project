import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCloudUploadAlt, FaSave, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Client } from '../../types';
import {
    useCreateClientMutation,
    useUpdateClientMutation,
} from '../../api/clientsApi';

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientToEdit: Client | null;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
    isOpen,
    onClose,
    clientToEdit,
}) => {
    const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
    const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();

    const [name, setName] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isLoading = isCreating || isUpdating;

    useEffect(() => {
        if (isOpen) {
            if (clientToEdit) {
                setName(clientToEdit.name);
                setPreview(clientToEdit.image);
                setSelectedFile(null);
            } else {
                setName('');
                setPreview(null);
                setSelectedFile(null);
            }
        }
    }, [isOpen, clientToEdit]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return toast.error('El nombre es obligatorio');
        if (!clientToEdit && !selectedFile)
            return toast.error('La imagen es obligatoria para nuevos clientes');

        const formData = new FormData();
        formData.append('name', name);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            if (clientToEdit) {
                await updateClient({
                    id: clientToEdit.id,
                    data: formData,
                }).unwrap();
                toast.success('Cliente actualizado correctamente');
            } else {
                await createClient(formData).unwrap();
                toast.success('Cliente agregado correctamente');
            }
            onClose();
        } catch (error) {
            toast.error('Error al guardar el cliente');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">
                        {clientToEdit
                            ? 'Editar Aliado/Cliente'
                            : 'Nuevo Aliado/Cliente'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Nombre de la Empresa{' '}
                            <span className="text-orange-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
                            placeholder="Ej. Parque Lambramani"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Logotipo{' '}
                            {clientToEdit ? '(Opcional)' : ''}
                        </label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group relative overflow-hidden"
                        >
                            {preview ? (
                                <div className="relative w-full h-32 flex items-center justify-center">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-sm font-bold flex items-center gap-2">
                                            <FaCloudUploadAlt /> Cambiar Imagen
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-orange-500">
                                        <FaImage size={24} />
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">
                                        Click para subir imagen
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        PNG, JPG (Max 2MB)
                                    </p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <FaSave /> Guardar
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
