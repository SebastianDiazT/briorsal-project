import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaEye,
    FaMapMarkerAlt,
    FaEllipsisV,
    FaFilter,
    FaStar,
    FaBuilding,
    FaChevronLeft,
    FaChevronRight,
    FaFolderOpen,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
    fetchProjects,
    deleteProject,
    fetchCategories,
} from '../../../store/slices/projectSlice';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';

const ProjectsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Estado global
    const { projects, categories, loading, count } = useAppSelector(
        (state) => state.projects
    );

    // Filtros locales
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterFeatured, setFilterFeatured] = useState(false);

    // Estado del menú móvil (guarda el ID del proyecto)
    const [mobileMenuOpen, setMobileMenuOpen] = useState<number | null>(null);

    // Estado para controlar el modal de eliminación
    const [projectToDelete, setProjectToDelete] = useState<{id: number, slug: string} | null>(null);

    // 1. Cargar Categorías al inicio
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // 2. Fetch de Proyectos (con Debounce para el buscador)
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(
                fetchProjects({
                    page,
                    search: searchTerm,
                    category: filterCategory,
                    status: filterStatus,
                    is_featured: filterFeatured,
                })
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [
        dispatch,
        page,
        searchTerm,
        filterStatus,
        filterCategory,
        filterFeatured,
    ]);

    // 3. Resetear a página 1 si cambian los filtros
    useEffect(() => {
        setPage(1);
    }, [searchTerm, filterStatus, filterCategory, filterFeatured]);

    // Lógica de Eliminación
    const handleDeleteClick = (id: number, slug: string) => {
        setMobileMenuOpen(null); // Cerrar menú móvil si está abierto
        setProjectToDelete({ id, slug }); // Abrir Modal
    };

    const confirmDelete = async () => {
        if (projectToDelete) {
            await dispatch(deleteProject(projectToDelete));
            toast.success('Proyecto eliminado correctamente');
            setProjectToDelete(null); // Cerrar Modal
            // Recargar datos...
            dispatch(
                fetchProjects({
                    page,
                    search: searchTerm,
                    category: filterCategory,
                    status: filterStatus,
                    is_featured: filterFeatured,
                })
            );
        }
    };

    const totalPages = Math.ceil(count / 9);

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up pb-20 md:pb-0">
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Proyectos
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Mostrando {projects.length} de {count} resultados
                    </p>
                </div>
                <Link
                    to="/admin/projects/new"
                    className="bg-brand-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-brand-700 transition-colors flex items-center gap-2 font-medium"
                >
                    <FaPlus /> <span>Nuevo Proyecto</span>
                </Link>
            </div>

            {/* --- BARRA DE FILTROS --- */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Buscador */}
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-brand-500 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Categoría */}
                <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="ALL">Todas las Categorías</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Estado */}
                <div className="relative">
                    <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-brand-500 outline-none text-sm appearance-none cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">Todos los Estados</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Diseño">Diseño</option>
                    </select>
                </div>

                {/* Switch Destacados */}
                <button
                    onClick={() => setFilterFeatured(!filterFeatured)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        filterFeatured
                            ? 'bg-amber-50 border-amber-200 text-amber-600'
                            : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                    }`}
                >
                    <FaStar
                        className={
                            filterFeatured ? 'text-amber-500' : 'text-slate-300'
                        }
                    />
                    {filterFeatured ? 'Solo Destacados' : 'Ver Destacados'}
                </button>
            </div>

            {/* --- CONTENIDO --- */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mb-2"></div>
                    <p className="text-slate-400 text-sm">
                        Cargando proyectos...
                    </p>
                </div>
            ) : projects.length === 0 ? (
                /* --- NO RESULTS --- */
                <div className="bg-white rounded-xl border border-slate-200 border-dashed p-16 text-center">
                    <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <FaFolderOpen className="text-3xl text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-1">
                        No se encontraron proyectos
                    </h3>
                    <p className="text-slate-500 text-sm mb-6">
                        No hay resultados para los filtros seleccionados.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterCategory('ALL');
                            setFilterStatus('ALL');
                            setFilterFeatured(false);
                        }}
                        className="text-brand-600 font-medium hover:underline text-sm"
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <>
                    {/* --- VISTA PC: TABLA --- */}
                    <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                    <th className="px-6 py-4">Proyecto</th>
                                    <th className="px-6 py-4">Ubicación</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {projects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="hover:bg-slate-50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-14 shrink-0 rounded overflow-hidden bg-slate-200 relative border border-slate-100">
                                                    {project.images &&
                                                    project.images.length >
                                                        0 ? (
                                                        <img
                                                            src={
                                                                project
                                                                    .images[0]
                                                                    .image
                                                            }
                                                            className="h-full w-full object-cover"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                                                            Sin Foto
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                        {project.name}
                                                        {project.is_featured && (
                                                            <FaStar
                                                                className="text-amber-400 text-xs"
                                                                title="Destacado"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {project.category_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {project.location}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    project.status ===
                                                    'Finalizado'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : project.status ===
                                                            'En Proceso'
                                                          ? 'bg-blue-100 text-blue-700'
                                                          : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/admin/projects/${project.slug}`}
                                                    className="p-2 hover:bg-slate-100 rounded text-slate-500"
                                                >
                                                    <FaEye />
                                                </Link>
                                                <Link
                                                    to={`/admin/projects/edit/${project.slug}`}
                                                    className="p-2 hover:bg-blue-50 rounded text-blue-600"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            project.id,
                                                            project.slug
                                                        )
                                                    }
                                                    className="p-2 hover:bg-red-50 rounded text-red-600"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- VISTA MÓVIL: TARJETAS --- */}
                    <div className="md:hidden grid grid-cols-1 gap-4">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 relative"
                            >
                                <div
                                    className="h-20 w-20 shrink-0 rounded-lg bg-slate-200 overflow-hidden"
                                    onClick={() =>
                                        navigate(
                                            `/admin/projects/${project.slug}`
                                        )
                                    }
                                >
                                    {project.images &&
                                    project.images.length > 0 ? (
                                        <img
                                            src={project.images[0].image}
                                            className="h-full w-full object-cover"
                                            alt=""
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                                            N/A
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="flex-1 min-w-0"
                                    onClick={() =>
                                        navigate(
                                            `/admin/projects/${project.slug}`
                                        )
                                    }
                                >
                                    <h3 className="font-bold text-slate-800 truncate pr-6 text-sm">
                                        {project.name}
                                    </h3>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <FaMapMarkerAlt /> {project.location}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                project.status === 'Finalizado'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}
                                        >
                                            {project.status}
                                        </span>
                                        {project.is_featured && (
                                            <FaStar className="text-amber-400 text-xs" />
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMobileMenuOpen(project.id);
                                    }}
                                    className="absolute top-4 right-4 text-slate-400 p-1"
                                >
                                    <FaEllipsisV />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* --- PAGINACIÓN --- */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-2">
                            <button
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={page === 1}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronLeft size={12} /> Anterior
                            </button>

                            <span className="text-sm text-slate-600">
                                Página{' '}
                                <span className="font-bold text-slate-800">
                                    {page}
                                </span>{' '}
                                de{' '}
                                <span className="font-bold text-slate-800">
                                    {totalPages}
                                </span>
                            </span>

                            <button
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={page === totalPages}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente <FaChevronRight size={12} />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* --- MODAL MÓVIL (Action Sheet) --- */}
            {mobileMenuOpen !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(null)}
                >
                    <div
                        className="bg-white w-full rounded-t-2xl p-6 animate-slide-up shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-3">
                            Opciones del Proyecto
                        </h3>
                        <div className="flex flex-col gap-2">
                            {/* Ver Detalles */}
                            <button
                                onClick={() => {
                                    const slug = projects.find(
                                        (p) => p.id === mobileMenuOpen
                                    )?.slug;
                                    if (slug)
                                        navigate(`/admin/projects/${slug}`);
                                }}
                                className="flex items-center gap-3 w-full p-3.5 hover:bg-slate-50 rounded-xl font-medium transition-colors text-left text-slate-600"
                            >
                                <FaEye className="text-slate-400" /> Ver
                                Detalles
                            </button>

                            {/* Editar */}
                            <button
                                onClick={() => {
                                    const slug = projects.find(
                                        (p) => p.id === mobileMenuOpen
                                    )?.slug;
                                    if (slug)
                                        navigate(
                                            `/admin/projects/edit/${slug}`
                                        );
                                }}
                                className="flex items-center gap-3 w-full p-3.5 hover:bg-slate-50 rounded-xl font-medium transition-colors text-left text-blue-600"
                            >
                                <FaEdit className="text-blue-400" /> Editar
                                Proyecto
                            </button>

                            {/* Eliminar (CORREGIDO) */}
                            <button
                                onClick={() => {
                                    const project = projects.find(
                                        (p) => p.id === mobileMenuOpen
                                    );
                                    if (project) {
                                        handleDeleteClick(
                                            mobileMenuOpen!,
                                            project.slug
                                        );
                                    }
                                }}
                                className="flex items-center gap-3 w-full p-3.5 hover:bg-slate-50 rounded-xl font-medium transition-colors text-left text-red-600"
                            >
                                <FaTrash className="text-red-400" /> Eliminar
                            </button>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(null)}
                            className="mt-4 w-full py-3 bg-slate-100 rounded-xl font-bold text-slate-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            <ConfirmModal
                isOpen={!!projectToDelete}
                title="¿Eliminar Proyecto?"
                message="Estás a punto de eliminar este proyecto permanentemente. Esta acción no se puede deshacer."
                confirmText="Sí, Eliminar"
                isDestructive={true}
                onConfirm={confirmDelete}
                onCancel={() => setProjectToDelete(null)}
            />
        </div>
    );
};

export default ProjectsList;
