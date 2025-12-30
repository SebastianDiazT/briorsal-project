import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaHardHat, FaArrowLeft } from 'react-icons/fa';
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
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400 font-medium animate-pulse">
                    Cargando información del servicio...
                </div>
            </div>
        );

    if (!serviceToEdit && !loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-red-500 font-bold text-lg">
                    Servicio no encontrado
                </div>
                <button
                    onClick={() => navigate('/admin/services')}
                    className="text-brand-600 hover:underline"
                >
                    Volver al listado
                </button>
            </div>
        );

    return (
        <>
            <PageMeta
                title="EDITAR SERVICIO"
                description={`Editando ${serviceToEdit?.title}`}
            />

            <div className="w-full animate-fade-in-up pb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-white text-brand-600 flex items-center justify-center border border-brand-100 shadow-sm shadow-brand-100/50">
                            <FaHardHat size={28} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                Editar Servicio
                            </h1>
                            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                                Modificando:
                                <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 text-xs">
                                    {serviceToEdit?.title}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto relative z-10">
                        <button
                            onClick={() => navigate('/admin/services')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all text-sm shadow-sm"
                        >
                            <FaArrowLeft size={12} />
                            Volver al Listado
                        </button>
                    </div>
                </div>

                <div className="w-full animate-fade-in-up pb-10">
                    <ServiceForm
                        initialData={serviceToEdit}
                        onSubmit={handleSubmit}
                        isLoading={loading}
                        onCancel={() => navigate('/admin/services')}
                    />
                </div>
            </div>
        </>
    );
};

export default ServiceEdit;
