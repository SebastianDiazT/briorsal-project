import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaBuilding, FaArrowLeft } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { createProject } from '@store/slices/projectSlice';
import { ProjectForm } from './ProjectForm';
import PageMeta from '@components/common/PageMeta';

const ProjectCreate = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading } = useAppSelector((state) => state.projects);

    const handleSubmit = async (formData: FormData) => {
        const result = await dispatch(createProject(formData));

        if (createProject.fulfilled.match(result)) {
            toast.success('¡Proyecto creado con éxito!');
            navigate('/admin/projects');
        } else {
            toast.error('Error al crear el proyecto');
            // Opcional: Mostrar error específico del backend si existe
            // if (result.payload) toast.error(JSON.stringify(result.payload));
        }
    };

    return (
        <>
            <PageMeta
                title="CREAR PROYECTO"
                description="Formulario para añadir un nuevo proyecto al portafolio"
            />

            <div className="w-full animate-fade-in-up pb-10">
                {/* Encabezado */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-white text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm shadow-orange-100/50">
                            <FaBuilding size={28} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                Nuevo Proyecto
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Añade una nueva obra o diseño al portafolio de
                                la empresa.
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto relative z-10">
                        <button
                            onClick={() => navigate('/admin/projects')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all text-sm shadow-sm"
                        >
                            <FaArrowLeft size={12} />
                            Volver al Listado
                        </button>
                    </div>
                </div>

                {/* Formulario */}
                <div className="w-full animate-fade-in-up pb-10">
                    <ProjectForm
                        onSubmit={handleSubmit}
                        isLoading={loading}
                        onCancel={() => navigate('/admin/projects')}
                    />
                </div>
            </div>
        </>
    );
};

export default ProjectCreate;
