import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaHardHat, FaArrowLeft } from 'react-icons/fa';
import { useCreateServiceMutation } from '@/features/services/api/servicesApi';
import { ServiceForm } from '@/features/services/components/admin/ServiceForm';
import PageMeta from '@components/common/PageMeta';
import { PageHeader } from '@components/ui/PageHeader';

const ServiceCreate = () => {
    const navigate = useNavigate();
    const [createService, { isLoading }] = useCreateServiceMutation();

    const handleSubmit = async (formData: FormData) => {
        try {
            await createService(formData).unwrap();
            toast.success('¡Servicio creado con éxito!');
            navigate('/admin/services');
        } catch (error) {
            toast.error('Error al crear el servicio');
        }
    };

    return (
        <>
            <PageMeta
                title="CREAR SERVICIO"
                description="Crear un nuevo servicio"
            />

            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Nuevo Servicio"
                    breadcrumbs={['Administración', 'Servicios', 'Crear']}
                    icon={FaHardHat}
                >
                    <button
                        onClick={() => navigate('/admin/services')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
                    >
                        <FaArrowLeft size={12} />
                        <span>Volver al Listado</span>
                    </button>
                </PageHeader>

                <div className="max-w-7xl mx-auto">
                    <ServiceForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        onCancel={() => navigate('/admin/services')}
                    />
                </div>
            </div>
        </>
    );
};

export default ServiceCreate;
