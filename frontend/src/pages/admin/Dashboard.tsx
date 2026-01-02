import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchProjects } from '@store/slices/projectSlice';
import { fetchServices } from '@store/slices/companySlice';
import { fetchCategories } from '@store/slices/categorySlice';
import FadeIn from '@components/common/FadeIn';
import PageMeta from '@components/common/PageMeta';
import {
    FaBuilding,
    FaHardHat,
    FaLayerGroup,
    FaClock,
    FaCheckCircle,
    FaPlus,
    FaArrowRight,
} from 'react-icons/fa';

const Dashboard = () => {
    const dispatch = useAppDispatch();

    // 1. BLINDAJE: Asignamos valores por defecto (= []) en la desestructuración
    // Esto evita que 'projects' sea undefined si el estado aún no carga
    const {
        projects = [],
        count,
        loading: projectsLoading,
    } = useAppSelector(
        (state) => state.projects || { projects: [], count: 0, loading: false } // Fallback extra por seguridad
    );
    const { services = [], loading: servicesLoading } = useAppSelector(
        (state) => state.company || { services: [], loading: false }
    );
    const { categories = [] } = useAppSelector(
        (state) => state.categories || { categories: [] }
    );

    useEffect(() => {
        dispatch(fetchProjects({ page: 1, pageSize: 100 }));
        dispatch(fetchServices({ page: 1, pageSize: 100 }));
        dispatch(fetchCategories());
    }, [dispatch]);

    // --- CÁLCULO DE ESTADÍSTICAS (CON SEGURIDAD) ---
    // Usamos el operador ?. y || 0 para evitar crasheos si los arrays fallan
    const totalProjects = count || projects?.length || 0;

    const inProgressProjects = projects?.filter
        ? projects.filter((p) => p.status === 'In Progress').length
        : 0;

    const deliveredProjects = projects?.filter
        ? projects.filter((p) => p.status === 'Delivered').length
        : 0;

    const totalServices = services?.length || 0;
    const totalCategories = categories?.length || 0;

    // Proyectos recientes (Safe slice)
    // Nos aseguramos que projects sea un array antes de hacer spread [...]
    const safeProjects = Array.isArray(projects) ? projects : [];
    const recentProjects = [...safeProjects].slice(0, 5);

    const isLoading = projectsLoading || servicesLoading;

    // Componente de Tarjeta de Estadística (StatCard)
    const StatCard = ({ title, value, icon, colorClass, link }: any) => (
        <Link
            to={link}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <h3 className="text-3xl font-black text-slate-800 group-hover:text-brand-600 transition-colors">
                        {isLoading ? '...' : value}
                    </h3>
                </div>
                <div
                    className={`p-3 rounded-xl ${colorClass} text-white shadow-sm`}
                >
                    {icon}
                </div>
            </div>
        </Link>
    );

    return (
        <FadeIn>
            <PageMeta
                title="Dashboard"
                description="Resumen general del sistema"
            />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Panel de Control
                </h1>
                <p className="text-slate-500">
                    Bienvenido de nuevo. Aquí tienes un resumen de tu
                    portafolio.
                </p>
            </div>

            {/* --- SECCIÓN 1: TARJETAS KPI --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Proyectos Totales"
                    value={totalProjects}
                    icon={<FaBuilding size={20} />}
                    colorClass="bg-blue-500"
                    link="/admin/projects"
                />
                <StatCard
                    title="En Ejecución"
                    value={inProgressProjects}
                    icon={<FaClock size={20} />}
                    colorClass="bg-amber-500"
                    link="/admin/projects"
                />
                <StatCard
                    title="Entregados"
                    value={deliveredProjects}
                    icon={<FaCheckCircle size={20} />}
                    colorClass="bg-green-500"
                    link="/admin/projects"
                />
                <StatCard
                    title="Servicios Activos"
                    value={totalServices}
                    icon={<FaHardHat size={20} />}
                    colorClass="bg-purple-500"
                    link="/admin/services"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- SECCIÓN 2: PROYECTOS RECIENTES (Columna Ancha) --- */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">
                                Proyectos Recientes
                            </h3>
                            <Link
                                to="/admin/projects"
                                className="text-sm text-brand-600 font-bold hover:underline flex items-center gap-1"
                            >
                                Ver todos <FaArrowRight size={10} />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Nombre</th>
                                        <th className="p-4">Categoría</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4 text-right">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentProjects.length > 0 ? (
                                        recentProjects.map((project) => (
                                            <tr
                                                key={project.id}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="p-4 font-medium text-slate-700">
                                                    {project.name}
                                                </td>
                                                <td className="p-4 text-slate-500">
                                                    {project.category_name}
                                                </td>
                                                <td className="p-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                            project.status ===
                                                            'In Progress'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-green-100 text-green-700'
                                                        }`}
                                                    >
                                                        {project.status ===
                                                        'In Progress'
                                                            ? 'Ejecución'
                                                            : 'Entregado'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link
                                                        to={`/admin/projects/edit/${project.slug}`}
                                                        className="text-brand-600 hover:text-brand-800 font-bold text-xs"
                                                    >
                                                        Editar
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="p-8 text-center text-slate-400"
                                            >
                                                {isLoading
                                                    ? 'Cargando datos...'
                                                    : 'No hay proyectos registrados aún.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN 3: ACCIONES RÁPIDAS (Columna Estrecha) --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-brand-600 rounded-2xl p-6 text-white shadow-lg shadow-brand-600/20">
                        <h3 className="font-bold text-lg mb-2">
                            Acciones Rápidas
                        </h3>
                        <p className="text-brand-100 text-sm mb-6">
                            Gestiona tu contenido de forma eficiente.
                        </p>

                        <div className="space-y-3">
                            <Link
                                to="/admin/projects/new"
                                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all backdrop-blur-sm border border-white/10"
                            >
                                <div className="bg-white text-brand-600 p-2 rounded-lg">
                                    <FaPlus size={12} />
                                </div>
                                <span className="font-bold text-sm">
                                    Nuevo Proyecto
                                </span>
                            </Link>

                            <Link
                                to="/admin/services/new"
                                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all backdrop-blur-sm border border-white/10"
                            >
                                <div className="bg-white text-brand-600 p-2 rounded-lg">
                                    <FaPlus size={12} />
                                </div>
                                <span className="font-bold text-sm">
                                    Nuevo Servicio
                                </span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">
                                Categorías
                            </h3>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full font-bold text-slate-500">
                                {totalCategories} Total
                            </span>
                        </div>
                        <div className="space-y-3">
                            {categories?.slice(0, 5).map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center gap-3 text-sm text-slate-600"
                                >
                                    <FaLayerGroup className="text-slate-300" />
                                    <span>{cat.name}</span>
                                </div>
                            ))}
                            {categories && categories.length > 5 && (
                                <Link
                                    to="/admin/categories"
                                    className="block text-center text-xs text-brand-600 font-bold mt-2"
                                >
                                    Ver todas las categorías
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};

export default Dashboard;
