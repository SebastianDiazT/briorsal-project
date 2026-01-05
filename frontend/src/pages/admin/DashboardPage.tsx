
import { Link } from 'react-router-dom';
import {
    FaBuilding,
    FaHandshake,
    FaEnvelope,
    FaLayerGroup,
    FaPlus,
    FaArrowRight,
    FaClock,
} from 'react-icons/fa6';

import { useGetProjectsQuery } from '@/features/projects/api/projectsApi';
import { useGetClientsQuery } from '@/features/clients/api/clientsApi';
import { useGetContactMessagesQuery } from '@/features/contact/api/contactApi';
import { useGetCategoriesQuery } from '@/features/categories/api/categoriesApi';

import PageMeta from '@/components/common/PageMeta';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    link: string;
    isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    link,
    isLoading,
}) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div
            className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}
        >
            <Icon size={80} />
        </div>

        <div className="relative z-10">
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg ${color}`}
            >
                <Icon size={20} />
            </div>

            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">
                {title}
            </p>

            {isLoading ? (
                <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
                <h3 className="text-4xl font-black text-slate-800">{value}</h3>
            )}

            <Link
                to={link}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 mt-4 hover:text-orange-600 transition-colors"
            >
                Ver detalles <FaArrowRight size={10} />
            </Link>
        </div>
    </div>
);

const RecentMessageRow = ({ msg }: { msg: any }) => (
    <div className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.is_read ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-600'}`}
        >
            {msg.first_name.charAt(0)}
            {msg.last_name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
            <h4
                className={`text-sm truncate ${msg.is_read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}
            >
                {msg.first_name} {msg.last_name}
            </h4>
            <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap">
            {new Date(msg.created_at).toLocaleDateString()}
        </span>
    </div>
);

const DashboardPage = () => {
    const { data: projectsData, isLoading: loadingProjects } =
        useGetProjectsQuery({ pageSize: 1 });
    const { data: clientsData, isLoading: loadingClients } = useGetClientsQuery(
        { pageSize: 1 }
    );
    const { data: categoriesData, isLoading: loadingCats } =
        useGetCategoriesQuery({ pageSize: 1 });
    const { data: messagesData, isLoading: loadingMsgs } =
        useGetContactMessagesQuery({ page: 1, pageSize: 5 });

    const stats = {
        projects: projectsData?.meta?.total_records || 0,
        clients: clientsData?.meta?.total_records || 0,
        categories: categoriesData?.meta?.total_records || 0,
        messages: messagesData?.meta?.total_records || 0,
    };

    const recentMessages = messagesData?.data || [];
    const today = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <PageMeta
                title="DASHBOARD - ADMINISTRACIÓN"
                description="Resumen general del sistema"
            />

            <div className="w-full animate-fade-in-up pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                            Hola, Administrador 👋
                        </h1>
                        <p className="text-slate-500 flex items-center gap-2 mt-1 font-medium">
                            <FaClock className="text-orange-500" />{' '}
                            {today.charAt(0).toUpperCase() + today.slice(1)}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            to="/admin/projects/new"
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-slate-900/20 hover:shadow-orange-500/30"
                        >
                            <FaPlus /> Nuevo Proyecto
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Proyectos Totales"
                        value={stats.projects}
                        icon={FaBuilding}
                        color="bg-blue-500"
                        link="/admin/projects"
                        isLoading={loadingProjects}
                    />
                    <StatCard
                        title="Clientes / Aliados"
                        value={stats.clients}
                        icon={FaHandshake}
                        color="bg-emerald-500"
                        link="/admin/clients"
                        isLoading={loadingClients}
                    />
                    <StatCard
                        title="Mensajes Recibidos"
                        value={stats.messages}
                        icon={FaEnvelope}
                        color="bg-orange-500"
                        link="/admin/messages"
                        isLoading={loadingMsgs}
                    />
                    <StatCard
                        title="Categorías Activas"
                        value={stats.categories}
                        icon={FaLayerGroup}
                        color="bg-violet-500"
                        link="/admin/categories"
                        isLoading={loadingCats}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <FaEnvelope className="text-slate-400" />{' '}
                                Últimos Mensajes
                            </h3>
                            <Link
                                to="/admin/messages"
                                className="text-xs font-bold text-orange-600 hover:underline"
                            >
                                Ver todos
                            </Link>
                        </div>

                        <div className="flex-1">
                            {loadingMsgs ? (
                                <div className="p-8 text-center text-slate-400">
                                    Cargando mensajes...
                                </div>
                            ) : recentMessages.length > 0 ? (
                                <div className="flex flex-col">
                                    {recentMessages.map((msg) => (
                                        <RecentMessageRow
                                            key={msg.id}
                                            msg={msg}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                        <FaEnvelope size={24} />
                                    </div>
                                    <p className="text-slate-500 font-medium">
                                        No hay mensajes recientes
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>

                            <h3 className="font-bold text-lg mb-1 relative z-10">
                                Información de Empresa
                            </h3>
                            <p className="text-slate-400 text-sm mb-6 relative z-10">
                                Actualiza los datos de contacto y redes sociales.
                            </p>

                            <Link
                                to="/admin/company"
                                className="block w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-center text-sm font-bold transition-all relative z-10"
                            >
                                Editar Información
                            </Link>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">
                                Accesos Directos
                            </h3>
                            <div className="space-y-3">
                                <Link
                                    to="/admin/projects"
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                                >
                                    <span className="font-medium text-sm">
                                        Gestionar Proyectos
                                    </span>
                                    <FaArrowRight
                                        size={12}
                                        className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                                    />
                                </Link>
                                <Link
                                    to="/admin/clients"
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-colors group"
                                >
                                    <span className="font-medium text-sm">
                                        Gestionar Clientes
                                    </span>
                                    <FaArrowRight
                                        size={12}
                                        className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                                    />
                                </Link>
                                <Link
                                    to="/admin/categories"
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-violet-50 hover:text-violet-600 transition-colors group"
                                >
                                    <span className="font-medium text-sm">
                                        Gestionar Categorías
                                    </span>
                                    <FaArrowRight
                                        size={12}
                                        className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
