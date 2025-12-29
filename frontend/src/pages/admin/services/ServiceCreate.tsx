import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createService } from '@/store/slices/companySlice';
import { ServiceForm } from '@/features/company/components/ServiceForm';

const ServiceCreate = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading } = useAppSelector((state) => state.company);

    const handleSubmit = async (formData: FormData) => {
        const result = await dispatch(createService(formData));
        if (createService.fulfilled.match(result)) {
            toast.success('¡Servicio creado con éxito!');
            navigate('/admin/services');
        } else {
            toast.error('Error al crear el servicio');
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Nuevo Servicio
                </h1>
                <p className="text-slate-500 mt-1">
                    Añade una nueva especialidad al portafolio.
                </p>
            </div>

            <ServiceForm
                onSubmit={handleSubmit}
                isLoading={loading}
                onCancel={() => navigate('/admin/services')}
            />
        </div>
    );
};

export default ServiceCreate;
