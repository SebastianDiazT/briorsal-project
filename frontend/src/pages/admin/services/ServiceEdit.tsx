import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { updateService, fetchServices } from '@store/slices/companySlice';
import { ServiceForm } from '@features/company/components/ServiceForm';
import PageMeta from '@components/common/PageMeta';

const ServiceEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { services, loading } = useAppSelector((state) => state.company);
    const serviceToEdit = services.find((s) => s.id === Number(id));

    useEffect(() => {
        if (services.length === 0) {
            dispatch(fetchServices({ page: 1, pageSize: 100 }));
        }
    }, [dispatch, services.length]);

    const handleSubmit = async (formData: FormData) => {
        if (!id) return;
        const result = await dispatch(
            updateService({ id: Number(id), formData })
        );

        if (updateService.fulfilled.match(result)) {
            toast.success('Servicio actualizado correctamente');
            navigate('/admin/services');
        } else {
            toast.error('No se pudo actualizar el servicio');
        }
    };

    if (loading && !serviceToEdit)
        return <div className="p-10 text-center">Cargando...</div>;
    if (!serviceToEdit && !loading)
        return (
            <div className="p-10 text-center text-red-500">
                Servicio no encontrado
            </div>
        );

    return (
        <>
            <PageMeta
                title="Admin - Editar Servicio"
                description="Admin - Editar Servicio"
            />

            <div className="max-w-5xl mx-auto animate-fade-in-up">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Editar Servicio
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Modificando: {serviceToEdit?.title}
                    </p>
                </div>

                <ServiceForm
                    initialData={serviceToEdit}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    onCancel={() => navigate('/admin/services')}
                />
            </div>
        </>
    );
};

export default ServiceEdit;
