import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaChevronLeft,
    FaChevronRight,
    FaBuilding,
    FaImage,
    FaAngleDown,
    FaExternalLinkAlt,
    FaChartPie,
    FaFolderOpen,
    FaTimes,
    FaMapMarkerAlt,
    FaStar,
    FaFilter,
    FaLayerGroup,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProjects, deleteProject } from '@store/slices/projectSlice';
import { fetchCategories } from '@store/slices/categorySlice';
import PageMeta from '@components/common/PageMeta';
import { ConfirmModal } from '@components/ui/ConfirmModal';

const ProjectsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Obtenemos los datos del store
    const { projects, loading, count } = useAppSelector(
        (state) => state.projects
    );
    const { categories } = useAppSelector((state) => state.categories);

    // Estados locales
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    // Cargar datos cada vez que cambie la página o el tamaño
    useEffect(() => {
        dispatch(fetchProjects({ page, pageSize }));
        dispatch(fetchCategories());
    }, [dispatch, page, pageSize]);

    // --- CORRECCIÓN DEL ERROR ---
    // Si 'projects' es undefined o null, usamos un array vacío para que .filter no falle
    const safeProjects = Array.isArray(projects) ? projects : [];

    // Lógica de Filtrado (Se aplica sobre los datos recibidos)
    const filteredProjects = safeProjects.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory
            ? p.category === Number(filterCategory)
            : true;
        const matchesStatus = filterStatus ? p.status === filterStatus : true;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // --- CORRECCIÓN DE PAGINACIÓN ---
    // Como el backend YA paginó los datos (trajo solo 10), no hacemos .slice aquí.
    // 'paginatedProjects' son simplemente los que llegaron del servidor filtrados.
    const paginatedProjects = filteredProjects;

    // Calculamos el total de páginas usando el 'count' que viene del backend
    const totalPages = Math.ceil((count || 0) / pageSize);

    const handleDeleteConfirm = async () => {
        if (projectToDelete) {
            await dispatch(deleteProject(projectToDelete));
            toast.success('Proyecto eliminado correctamente');
            setProjectToDelete(null);
            // Recargamos la página actual
            dispatch(fetchProjects({ page, pageSize }));
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterStatus('');
        setPage(1);
    };

    const hasActiveFilters = searchTerm || filterCategory || filterStatus;

    // Componente reutilizable para el estado vacío (Tu diseño original)
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-6 group">
                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-500">
                    {hasActiveFilters ? (
                        <FaFilter className="text-5xl text-slate-300" />
                    ) : (
                        <FaFolderOpen className="text-5xl text-slate-300" />
                    )}
                </div>

                <div className="absolute top-0 left-0 w-32 h-32 bg-orange-50 rounded-full blur-xl opacity-50 animate-pulse flex items-center justify-center">
                    <FaLayerGroup className="text-6xl text-orange-200 opacity-20 transform -rotate-12" />
                </div>

                <div className="absolute bottom-2 right-2 z-20 bg-white p-2 rounded-full shadow-md border border-slate-100">
                    {hasActiveFilters ? (
                        <FaTimes className="text-red-400" size={14} />
                    ) : (
                        <FaPlus className="text-orange-500" size={14} />
                    )}
                </div>
            </div>

            <div className="text-center max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold text-slate-800">
                    {hasActiveFilters
                        ? 'No se encontraron resultados'
                        : 'El portafolio está vacío'}
                </h3>

                <p className="text-slate-500 leading-relaxed">
                    {hasActiveFilters ? (
                        <>
                            No encontramos proyectos que coincidan con tus
                            filtros.
                            <br />
                            Intenta limpiar la búsqueda.
                        </>
                    ) : (
                        'Aún no has agregado ningún proyecto. Crea el primero para comenzar a mostrar tu trabajo.'
                    )}
                </p>
            </div>

            <div className="mt-8">
                {hasActiveFilters ? (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-orange-600 hover:border-orange-300 transition-all shadow-sm active:scale-95"
                    >
                        <FaTimes /> Limpiar Filtros
                    </button>
                ) : (
                    <Link
                        to="/admin/projects/new"
                        className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 hover:bg-orange-700 hover:-translate-y-1 transition-all"
                    >
                        <FaPlus /> Crear mi primer proyecto
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <>
            <PageMeta
                title="GESTIÓN DE PROYECTOS"
                description="ADMINISTRACIÓN DEL PORTAFOLIO DE PROYECTOS"
            />

            <div className="w-full animate-fade-in-up">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-white text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm shadow-orange-100/50">
                            <FaBuilding size={28} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                Gestión de Proyectos
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200">
                                    <FaChartPie
                                        size={10}
                                        className="text-slate-400"
                                    />
                                    {count} Registros
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 relative z-10">
                        <Link
                            to="/"
                            target="_blank"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-xl font-bold hover:bg-slate-50 hover:text-orange-600 hover:border-orange-200 transition-all text-sm group"
                        >
                            <FaExternalLinkAlt
                                size={12}
                                className="group-hover:scale-110 transition-transform"
                            />
                            Ver en Web
                        </Link>
                        <Link
                            to="/admin/projects/new"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:shadow-orange-600/30 hover:-translate-y-0.5 transition-all active:scale-95 text-sm"
                        >
                            <FaPlus size={14} />
                            Nuevo Proyecto
                        </Link>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
                            <div className="relative w-full sm:w-64 group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 sm:text-sm transition-all font-medium"
                                />
                            </div>
                            <div className="relative w-full sm:w-48">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => {
                                        setFilterCategory(e.target.value);
                                        setPage(1);
                                    }}
                                    className="block w-full pl-3 pr-10 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 sm:text-sm appearance-none cursor-pointer font-medium"
                                >
                                    <option value="">
                                        Todas las Categorías
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                    <FaAngleDown size={12} />
                                </div>
                            </div>
                            <div className="relative w-full sm:w-40">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setPage(1);
                                    }}
                                    className="block w-full pl-3 pr-10 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 sm:text-sm appearance-none cursor-pointer font-medium"
                                >
                                    <option value="">Todos los Estados</option>
                                    <option value="In Progress">
                                        En Ejecución
                                    </option>
                                    <option value="Delivered">Entregado</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                    <FaAngleDown size={12} />
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-red-500 text-sm font-bold hover:underline flex items-center gap-1"
                                >
                                    <FaTimes /> Limpiar
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide hidden sm:inline">
                                Mostrar:
                            </span>
                            <div className="relative">
                                <select
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="appearance-none bg-slate-50 border border-slate-200 hover:border-orange-300 text-slate-700 text-sm font-bold rounded-lg pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
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
                </div>

                {/* --- CONTENIDO PRINCIPAL --- */}

                {/* 1. VISTA DE TABLA (SOLO PC/TABLET) */}
                <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className="p-4 w-28 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                        Portada
                                    </th>
                                    <th className="p-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                        Información
                                    </th>
                                    <th className="p-4 text-center w-40 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                        Estado
                                    </th>
                                    <th className="p-4 text-right w-32 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading && projects.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="p-20 text-center"
                                        >
                                            <div className="text-slate-400">
                                                Cargando...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-0">
                                            <EmptyState />
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedProjects.map((project) => (
                                        <tr
                                            key={project.id}
                                            className="group hover:bg-slate-50/80 transition-colors duration-200"
                                        >
                                            <td className="p-3 text-center align-middle">
                                                <div className="h-16 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 mx-auto relative shadow-sm">
                                                    {project.images &&
                                                    project.images.length >
                                                        0 ? (
                                                        <img
                                                            src={
                                                                project
                                                                    .images[0]
                                                                    .image
                                                            }
                                                            alt={project.name}
                                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <FaImage
                                                                size={20}
                                                            />
                                                        </div>
                                                    )}
                                                    {project.is_featured && (
                                                        <div className="absolute top-1 right-1 text-yellow-400 bg-white rounded-full p-0.5 shadow-sm">
                                                            <FaStar size={10} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-bold text-slate-800 mb-1">
                                                        {project.name}
                                                    </span>
                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <FaMapMarkerAlt
                                                                size={10}
                                                            />{' '}
                                                            {project.location}
                                                        </span>
                                                        <span className="text-slate-300">
                                                            •
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold border border-slate-200 text-slate-600">
                                                            {project.category_name ||
                                                                'Sin Categoría'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <span
                                                    className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold border min-w-[100px] ${project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}
                                                >
                                                    {project.status ===
                                                    'In Progress'
                                                        ? 'En Ejecución'
                                                        : 'Entregado'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/projects/edit/${project.slug}`
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setProjectToDelete(
                                                                project.slug
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
                </div>

                {/* 2. VISTA DE TARJETAS (SOLO MÓVIL) */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                    {loading && projects.length === 0 ? (
                        <div className="text-center p-10 text-slate-400">
                            Cargando...
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <EmptyState />
                        </div>
                    ) : (
                        paginatedProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4"
                            >
                                {/* Encabezado Tarjeta */}
                                <div className="flex gap-4">
                                    <div className="h-20 w-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative">
                                        {project.images &&
                                        project.images.length > 0 ? (
                                            <img
                                                src={project.images[0].image}
                                                alt={project.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FaImage size={20} />
                                            </div>
                                        )}
                                        {project.is_featured && (
                                            <div className="absolute top-1 right-1 text-yellow-400 bg-white rounded-full p-0.5 shadow-sm">
                                                <FaStar size={10} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                                            {project.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                            <FaMapMarkerAlt size={10} />{' '}
                                            <span className="truncate">
                                                {project.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cuerpo Tarjeta */}
                                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                            Categoría
                                        </span>
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold border border-slate-200 text-slate-600 self-start">
                                            {project.category_name ||
                                                'Sin Categoría'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                            Estado
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-bold border ${project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}
                                        >
                                            {project.status === 'In Progress'
                                                ? 'En Ejecución'
                                                : 'Entregado'}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer Tarjeta */}
                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/admin/projects/edit/${project.slug}`
                                            )
                                        }
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-lg font-bold text-sm border border-slate-200 hover:bg-slate-100 active:bg-slate-200"
                                    >
                                        <FaEdit /> Editar
                                    </button>
                                    <button
                                        onClick={() =>
                                            setProjectToDelete(project.slug)
                                        }
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm border border-red-100 hover:bg-red-100 active:bg-red-200"
                                    >
                                        <FaTrash /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Paginación */}
                {count > 0 && (
                    <div className="mt-4 md:mt-0 md:border-t md:border-slate-200 bg-white md:px-6 md:py-4 p-4 rounded-xl md:rounded-t-none shadow-sm md:shadow-none border border-slate-200 md:border-0 flex flex-col md:flex-row items-center justify-between gap-4">
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
                        <div className="flex gap-2 w-full md:w-auto justify-center">
                            <button
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                                className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:text-orange-600 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                            >
                                <FaChevronLeft size={10} /> Anterior
                            </button>
                            <button
                                onClick={() =>
                                    setPage((p) => (p < totalPages ? p + 1 : p))
                                }
                                disabled={page >= totalPages}
                                className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:text-orange-600 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                            >
                                Siguiente <FaChevronRight size={10} />
                            </button>
                        </div>
                    </div>
                )}

                <ConfirmModal
                    isOpen={!!projectToDelete}
                    title="¿Eliminar Proyecto?"
                    message="El proyecto dejará de ser visible para los clientes. Esta acción no se puede deshacer."
                    confirmText="Eliminar"
                    isDestructive={true}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setProjectToDelete(null)}
                />
            </div>
        </>
    );
};

export default ProjectsList;
