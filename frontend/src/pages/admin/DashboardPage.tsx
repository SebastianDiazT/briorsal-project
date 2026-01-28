import { Link } from 'react-router-dom';
import {
    FaBuilding,
    FaHandshake,
    FaEnvelope,
    FaLayerGroup,
    FaPlus,
    FaArrowRight,
    FaCalendarDay,
    FaEllipsisH,
    FaPhone,
    FaMapMarkerAlt,
} from 'react-icons/fa'; // Usando react-icons/fa estándar para compatibilidad

import { useGetProjectsQuery } from '@/features/projects/api/projectsApi';
import { useGetClientsQuery } from '@/features/clients/api/clientsApi';
import { useGetContactMessagesQuery } from '@/features/contact/api/contactApi';
import { useGetCategoriesQuery } from '@/features/categories/api/categoriesApi';

import PageMeta from '@/components/common/PageMeta';

// --- SUB-COMPONENTES UI ---

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    colorClass: string; // Ej: "text-blue-500 bg-blue-50"
    link: string;
    isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    colorClass,
    link,
    isLoading,
}) => (
    <Link
        to={link}
        className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
    >
        <div className="flex justify-between items-start">
            <div className="relative z-10">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                    {title}
                </p>
                {isLoading ? (
                    <div className="h-9 w-20 bg-slate-100 rounded animate-pulse mb-1" />
                ) : (
                    <h3 className="text-3xl font-black text-slate-900 mb-1">
                        {value}
                    </h3>
                )}
                <span className="text-xs font-medium text-slate-400 group-hover:text-orange-500 transition-colors flex items-center gap-1">
                    Ver detalles <FaArrowRight size={10} />
                </span>
            </div>

            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${colorClass}`}
            >
                <Icon size={20} />
            </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity transform rotate-12">
            <Icon size={100} />
        </div>
    </Link>
);

const MessageItem = ({ msg }: { msg: any }) => (
    <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
        <div
            className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-white shadow-sm ${
                msg.is_read
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-orange-100 text-orange-600'
            }`}
        >
            {msg.first_name.charAt(0)}
            {msg.last_name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-0.5">
                <h4
                    className={`text-sm truncate ${msg.is_read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}
                >
                    {msg.first_name} {msg.last_name}
                </h4>
                <span className="text-[10px] text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                    {new Date(msg.created_at).toLocaleDateString()}
                </span>
            </div>
            <p className="text-xs text-slate-500 truncate mb-1">
                {msg.subject}
            </p>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {msg.message_body || 'Sin contenido previo...'}
            </p>
        </div>
    </div>
);

const QuickActionLink = ({ to, icon: Icon, label, colorClass }: any) => (
    <Link
        to={to}
        className={`group flex items-center justify-between p-3.5 rounded-xl border border-transparent transition-all duration-200 ${colorClass}`}
    >
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm bg-opacity-80">
                <Icon size={14} />
            </div>
            <span className="font-semibold text-sm">{label}</span>
        </div>
        <FaArrowRight
            size={12}
            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
        />
    </Link>
);

// --- COMPONENTE PRINCIPAL ---

const DashboardPage = () => {
    // Queries con polling o refresh si es necesario
    const { data: projectsData, isLoading: loadingProjects } =
        useGetProjectsQuery({ pageSize: 1 });
    const { data: clientsData, isLoading: loadingClients } = useGetClientsQuery(
        { pageSize: 1 }
    );
    const { data: categoriesData, isLoading: loadingCats } =
        useGetCategoriesQuery({ pageSize: 1 });
    const { data: messagesData, isLoading: loadingMsgs } =
        useGetContactMessagesQuery({ page: 1, pageSize: 4 }); // Reduje a 4 para que encaje mejor visualmente

    const stats = {
        projects: projectsData?.meta?.total_records || 0,
        clients: clientsData?.meta?.total_records || 0,
        categories: categoriesData?.meta?.total_records || 0,
        messages: messagesData?.meta?.total_records || 0,
    };

    const recentMessages = messagesData?.data || [];

    // Formato de fecha elegante
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    const today = new Date().toLocaleDateString('es-ES', dateOptions);
    const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

    return (
        <>
            <PageMeta
                title="DASHBOARD"
                description="Resumen general Briorsal"
            />

            <div className="w-full animate-fade-in-up pb-10">
                {/* HEADER / WELCOME SECTION */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative overflow-hidden">
                    {/* Fondo decorativo sutil */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-50 to-slate-50 rounded-bl-full opacity-50 pointer-events-none" />

                    <div className="relative z-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-500 text-xs font-bold mb-3 border border-slate-200">
                            <FaCalendarDay className="inline mr-1.5 -mt-0.5" />
                            {capitalizedToday}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Bienvenido,{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
                                Admin
                            </span>
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm md:text-base max-w-lg">
                            Aquí tienes un resumen de la actividad reciente en
                            el portal de{' '}
                            <span className="font-semibold text-slate-700">
                                Briorsal
                            </span>
                            .
                        </p>
                    </div>

                    <div className="relative z-10">
                        <Link
                            to="/admin/projects/new"
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-orange-600 hover:-translate-y-0.5 transition-all shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20"
                        >
                            <FaPlus className="text-xs" />
                            Crear Proyecto
                        </Link>
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Proyectos"
                        value={stats.projects}
                        icon={FaBuilding}
                        colorClass="bg-blue-50 text-blue-600"
                        link="/admin/projects"
                        isLoading={loadingProjects}
                    />
                    <StatCard
                        title="Clientes"
                        value={stats.clients}
                        icon={FaHandshake}
                        colorClass="bg-emerald-50 text-emerald-600"
                        link="/admin/clients"
                        isLoading={loadingClients}
                    />
                    <StatCard
                        title="Mensajes"
                        value={stats.messages}
                        icon={FaEnvelope}
                        colorClass="bg-orange-50 text-orange-600"
                        link="/admin/messages"
                        isLoading={loadingMsgs}
                    />
                    <StatCard
                        title="Categorías"
                        value={stats.categories}
                        icon={FaLayerGroup}
                        colorClass="bg-violet-50 text-violet-600"
                        link="/admin/categories"
                        isLoading={loadingCats}
                    />
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: MESSAGES (Wider) */}
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">
                                        Bandeja de Entrada
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Últimas consultas recibidas
                                    </p>
                                </div>
                                <Link
                                    to="/admin/messages"
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-orange-600 transition-colors"
                                >
                                    <FaEllipsisH />
                                </Link>
                            </div>

                            <div className="flex-1 p-2">
                                {loadingMsgs ? (
                                    <div className="space-y-4 p-4">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="flex gap-4 animate-pulse"
                                            >
                                                <div className="w-10 h-10 bg-slate-100 rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                                                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : recentMessages.length > 0 ? (
                                    <div className="space-y-1">
                                        {recentMessages.map((msg) => (
                                            <MessageItem
                                                key={msg.id}
                                                msg={msg}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                            <FaEnvelope size={24} />
                                        </div>
                                        <h4 className="text-slate-900 font-medium">
                                            Bandeja limpia
                                        </h4>
                                        <p className="text-slate-400 text-sm mt-1">
                                            No tienes mensajes pendientes.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {recentMessages.length > 0 && (
                                <div className="p-4 border-t border-slate-50 bg-slate-50/50 text-center">
                                    <Link
                                        to="/admin/messages"
                                        className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors"
                                    >
                                        Ver todos los mensajes
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ACTIONS & INFO */}
                    <div className="flex flex-col gap-6">
                        {/* Company Card */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                            {/* Efectos de fondo */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10 group-hover:opacity-30 transition-opacity duration-500"></div>

                            <div className="relative z-10">
                                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                                    <FaBuilding className="text-orange-400" />
                                </div>

                                <h3 className="font-bold text-lg mb-2">
                                    Información Corporativa
                                </h3>
                                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                    Mantén actualizados los datos de contacto,
                                    dirección y redes sociales que se muestran
                                    en el sitio web.
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-xs text-slate-300">
                                        <FaPhone className="text-slate-500" />
                                        <span>+51 999 999 999</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-300">
                                        <FaMapMarkerAlt className="text-slate-500" />
                                        <span className="truncate">
                                            Av. Ejemplo 123, Arequipa
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    to="/admin/company"
                                    className="block w-full py-3 bg-white text-slate-900 hover:bg-orange-500 hover:text-white rounded-xl text-center text-sm font-bold transition-all"
                                >
                                    Gestionar Empresa
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wide text-opacity-70">
                                Accesos Rápidos
                            </h3>
                            <div className="space-y-3">
                                <QuickActionLink
                                    to="/admin/projects"
                                    icon={FaLayerGroup}
                                    label="Proyectos"
                                    colorClass="bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                                />
                                <QuickActionLink
                                    to="/admin/clients"
                                    icon={FaHandshake}
                                    label="Clientes"
                                    colorClass="bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100"
                                />
                                <QuickActionLink
                                    to="/admin/categories"
                                    icon={FaLayerGroup}
                                    label="Categorías"
                                    colorClass="bg-slate-50 text-slate-600 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
