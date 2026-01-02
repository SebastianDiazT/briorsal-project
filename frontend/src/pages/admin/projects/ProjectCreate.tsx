import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaBuilding, FaArrowLeft } from 'react-icons/fa';
import { useCreateProjectMutation } from '@/features/projects/api/projectsApi'; // <--- USAMOS TU API
import { ProjectForm } from '@features/projects/components/admin/ProjectForm';
import PageMeta from '@components/common/PageMeta';
import { PageHeader } from '@components/ui/PageHeader';

const ProjectCreate = () => {
    const navigate = useNavigate();

    // Hook generado por RTK Query
    const [createProject, { isLoading }] = useCreateProjectMutation();

    const handleSubmit = async (formData: FormData) => {
        try {
            // .unwrap() es clave en RTK Query: lanza un error si la promesa falla (catch)
            // o devuelve la data limpia si es exitosa.
            await createProject(formData).unwrap();

            toast.success('¡Proyecto creado con éxito!');
            navigate('/admin/projects');
        } catch (error) {
            console.error(error);
            toast.error('Error al crear el proyecto');
        }
    };

    return (
        <>
            <PageMeta title="CREAR PROYECTO" description="..." />

            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Nuevo Proyecto"
                    breadcrumbs={['Administración', 'Proyectos', 'Crear']}
                    icon={FaBuilding}
                >
                    <button
                        onClick={() => navigate('/admin/projects')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
                    >
                        <FaArrowLeft size={12} />
                        <span>Volver al Listado</span>
                    </button>
                </PageHeader>

                <div className="max-w-7xl mx-auto">
                    <ProjectForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        onCancel={() => navigate('/admin/projects')}
                    />
                </div>
            </div>
        </>
    );
};

export default ProjectCreate;
