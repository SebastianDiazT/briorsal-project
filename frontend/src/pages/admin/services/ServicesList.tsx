import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaChevronLeft,
    FaChevronRight,
    FaHardHat,
    FaImage,
    FaAngleDown,
    FaExternalLinkAlt,
    FaChartPie,
    FaFolderOpen,
    FaTimes,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    fetchServices,
    deleteService,

} from '@store/slices/companySlice';
import PageMeta from '@components/common/PageMeta';
import { ConfirmModal } from '@components/ui/ConfirmModal';

const ServicesList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { services, loading, count } = useAppSelector(
        (state) => state.company
    );

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchServices({ page, pageSize }));
    }, [dispatch, page, pageSize]);

    const filteredServices = services.filter((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteConfirm = async () => {
        if (serviceToDelete) {
            await dispatch(deleteService(serviceToDelete));
            toast.success('Servicio eliminado');
            setServiceToDelete(null);
            dispatch(fetchServices({ page, pageSize }));
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    const totalPages = Math.ceil(count / pageSize);

    return (
        <>
            <PageMeta
                title="GESTIÓN DE SERVICIOS"
                description="GESTIÓN Y ADMINISTRACIÓN DE SERVICIOS"
            />

            <div className="w-full animate-fade-in-up">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-white text-brand-600 flex items-center justify-center border border-brand-100 shadow-sm shadow-brand-100/50">
                            <FaHardHat size={28} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                Gestión de Servicios
                            </h1>

                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200">
                                    <FaChartPie
                                        size={10}
                                        className="text-slate-400"
                                    />
                                    {count} Registros
                                </span>

                                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-green-100">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Catálogo Activo
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 relative z-10">
                        <Link
                            to="/services"
                            target="_blank"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-xl font-bold hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 transition-all text-sm group"
                        >
                            <FaExternalLinkAlt
                                size={12}
                                className="group-hover:scale-110 transition-transform"
                            />
                            Ver en Web
                        </Link>

                        <Link
                            to="/admin/services/new"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all active:scale-95 text-sm"
                        >
                            <FaPlus size={14} />
                            Nuevo Servicio
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:max-w-xs group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar..."
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
                                onChange={handlePageSizeChange}
                                className="appearance-none bg-slate-50 border border-slate-200 hover:border-brand-300 text-slate-700 text-sm font-bold rounded-lg pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                            >
                                <option value="5">5 filas</option>
                                <option value="10">10 filas</option>
                                <option value="20">20 filas</option>
                                <option value="50">50 filas</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                <FaAngleDown size={12} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className="p-4 w-28 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                        Imagen
                                    </th>
                                    <th className="p-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                        Información
                                    </th>
                                    <th className="p-4 text-right w-32 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="p-20 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="relative">
                                                    <div className="w-16 h-16 border-4 border-slate-100 border-t-brand-500 rounded-full animate-spin"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-slate-800 font-bold text-lg animate-pulse">
                                                        Cargando catálogo...
                                                    </h3>
                                                    <p className="text-slate-400 text-sm">
                                                        Estamos recuperando la
                                                        información
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredServices.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-0">
                                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                                <div className="relative mb-6 group">
                                                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-500">
                                                        {searchTerm ? (
                                                            <FaSearch className="text-5xl text-slate-300" />
                                                        ) : (
                                                            <FaFolderOpen className="text-5xl text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div className="absolute top-0 left-0 w-32 h-32 bg-brand-50 rounded-full blur-xl opacity-50 animate-pulse"></div>

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
                                                            : 'El catálogo está vacío'}
                                                    </h3>

                                                    <p className="text-slate-500 leading-relaxed">
                                                        {searchTerm ? (
                                                            <>
                                                                No encontramos
                                                                servicios que
                                                                coincidan con{' '}
                                                                <span className="font-bold text-slate-700">
                                                                    "
                                                                    {searchTerm}
                                                                    "
                                                                </span>
                                                                .
                                                                <br />
                                                                Revisa la
                                                                ortografía o
                                                                intenta con otro
                                                                término.
                                                            </>
                                                        ) : (
                                                            'Aún no has agregado ningún servicio. Crea el primero para comenzar a mostrar tu oferta en la web.'
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="mt-8">
                                                    {searchTerm ? (
                                                        <button
                                                            onClick={() =>
                                                                setSearchTerm(
                                                                    ''
                                                                )
                                                            }
                                                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-brand-600 hover:border-brand-300 transition-all shadow-sm active:scale-95"
                                                        >
                                                            <FaTimes /> Limpiar
                                                            búsqueda
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            to="/admin/services/new"
                                                            className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:-translate-y-1 transition-all"
                                                        >
                                                            <FaPlus /> Crear mi
                                                            primer servicio
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredServices.map((service) => (
                                        <tr
                                            key={service.id}
                                            className="group hover:bg-slate-50/80 transition-colors duration-200"
                                        >
                                            <td className="p-3 text-center align-middle">
                                                <div className="h-16 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 mx-auto relative shadow-sm">
                                                    {service.image ? (
                                                        <img
                                                            src={service.image}
                                                            alt={service.title}
                                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <FaImage
                                                                size={20}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-bold text-slate-800 group-hover:text-brand-700 transition-colors mb-1">
                                                        {service.title}
                                                    </span>
                                                    <span className="text-sm text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                                                        {service.description ||
                                                            'Sin descripción disponible.'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="p-4 align-middle text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/services/edit/${service.id}`
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setServiceToDelete(
                                                                service.id
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {count > 0 && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            <div className="text-xs text-slate-500 font-medium">
                                Mostrando{' '}
                                <span className="font-bold text-slate-700">
                                    {Math.min((page - 1) * pageSize + 1, count)}
                                </span>{' '}
                                -{' '}
                                <span className="font-bold text-slate-700">
                                    {Math.min(page * pageSize, count)}
                                </span>{' '}
                                de{' '}
                                <span className="font-bold text-slate-700">
                                    {count}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page === 1 || loading}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:text-brand-600 hover:border-brand-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                >
                                    <FaChevronLeft size={10} />
                                    <span className="hidden sm:inline">
                                        Anterior
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        setPage((p) =>
                                            p < totalPages ? p + 1 : p
                                        )
                                    }
                                    disabled={page >= totalPages || loading}
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

                <ConfirmModal
                    isOpen={!!serviceToDelete}
                    title="¿Eliminar Servicio?"
                    message="El servicio dejará de ser visible para los clientes. Esta acción no se puede deshacer."
                    confirmText="Eliminar"
                    isDestructive={true}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setServiceToDelete(null)}
                />
            </div>
        </>
    );
};

export default ServicesList;
