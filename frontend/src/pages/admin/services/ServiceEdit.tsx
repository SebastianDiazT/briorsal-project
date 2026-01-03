import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    FaEdit,
    FaArrowLeft,
    FaExclamationTriangle,
    FaExternalLinkAlt,
} from 'react-icons/fa';
import {
    useGetServiceByIdQuery,
    useUpdateServiceMutation,
} from '@/features/services/api/servicesApi';
import { ServiceForm } from '@/features/services/components/admin/ServiceForm';
import PageMeta from '@components/common/PageMeta';
import { PageHeader } from '@components/ui/PageHeader';

const ServiceEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const serviceId = Number(id);

    const {
        data: currentService,
        isLoading: isLoadingData,
        isError,
    } = useGetServiceByIdQuery(serviceId, { skip: !serviceId });

    const [updateService, { isLoading: isUpdating }] =
        useUpdateServiceMutation();

    const handleSubmit = async (formData: FormData) => {
        if (!serviceId) return;

        try {
            await updateService({ id: serviceId, data: formData }).unwrap();
            toast.success('Servicio actualizado correctamente');
            navigate('/admin/services');
        } catch (error) {
            console.error(error);
            toast.error('No se pudo actualizar el servicio');
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">
                    Cargando información del servicio...
                </p>
            </div>
        );
    }

    if (isError || !currentService) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-3xl text-red-500" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        Servicio no encontrado
                    </h2>
                    <p className="text-slate-500 mt-2">
                        El servicio que buscas no existe o fue eliminado.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/services')}
                    className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                    Volver al listado
                </button>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="EDITAR SERVICIO"
                description={`Editando: ${currentService.name}`}
            />

            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Editar Servicio"
                    breadcrumbs={[
                        'Administración',
                        'Servicios',
                        currentService.name,
                    ]}
                    icon={FaEdit}
                >
                    <div className="flex items-center gap-3">
                        <Link
                            to="/servicios"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold transition-all shadow-sm hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 group"
                            title="Ver en la web pública"
                        >
                            <FaExternalLinkAlt
                                size={12}
                                className="text-slate-400 group-hover:text-orange-500 transition-colors"
                            />
                            <span className="hidden sm:inline">Ver en Web</span>
                            <span className="sm:hidden">Ver</span>
                        </Link>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                        <button
                            onClick={() => navigate('/admin/services')}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
                        >
                            <FaArrowLeft size={12} />
                            <span>Volver</span>
                        </button>
                    </div>
                </PageHeader>

                <div className="max-w-7xl mx-auto">
                    <ServiceForm
                        initialData={currentService}
                        onSubmit={handleSubmit}
                        isLoading={isUpdating}
                        onCancel={() => navigate('/admin/services')}
                    />
                </div>
            </div>
        </>
    );
};

export default ServiceEdit;
