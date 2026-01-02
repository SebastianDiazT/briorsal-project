import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    FaEdit,
    FaArrowLeft,
    FaExclamationTriangle,
    FaSpinner,
    FaExternalLinkAlt,
} from 'react-icons/fa';
import {
    useGetProjectBySlugQuery,
    useUpdateProjectMutation,
} from '@/features/projects/api/projectsApi';
import { ProjectForm } from '@features/projects/components/admin/ProjectForm';
import PageMeta from '@components/common/PageMeta';
import { PageHeader } from '@components/ui/PageHeader';

const ProjectEdit = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const {
        data: currentProject,
        isLoading: isLoadingData,
        isError,
    } = useGetProjectBySlugQuery(slug!, { skip: !slug });

    const [updateProject, { isLoading: isUpdating }] =
        useUpdateProjectMutation();

    const handleSubmit = async (formData: FormData) => {
        if (!slug) return;

        try {
            await updateProject({ slug, data: formData }).unwrap();
            toast.success('Proyecto actualizado correctamente');
            navigate('/admin/projects');
        } catch (error) {
            console.error(error);
            toast.error('No se pudo actualizar el proyecto');
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in">
                <FaSpinner className="text-4xl text-orange-500 animate-spin" />
                <p className="text-slate-500 font-medium">
                    Cargando información del proyecto...
                </p>
            </div>
        );
    }

    if (isError || !currentProject) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-3xl text-red-500" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        Proyecto no encontrado
                    </h2>
                    <p className="text-slate-500 mt-2">
                        El proyecto no existe o hubo un error al cargarlo.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/projects')}
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
                title="EDITAR PROYECTO"
                description={`Editando ${currentProject.name}`}
            />

            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Editar Proyecto"
                    breadcrumbs={[
                        'Administración',
                        'Proyectos',
                        currentProject.name,
                    ]}
                    icon={FaEdit}
                >
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/projects/${currentProject.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold transition-all shadow-sm hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 group"
                            title="Ver cómo quedó en la página pública"
                        >
                            <FaExternalLinkAlt
                                size={12}
                                className="text-slate-400 group-hover:text-orange-500 transition-colors"
                            />
                            <span>Ver en Web</span>
                        </Link>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                        <button
                            onClick={() => navigate('/admin/projects')}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
                        >
                            <FaArrowLeft size={12} />
                            <span>Volver</span>
                        </button>
                    </div>
                </PageHeader>

                <div className="max-w-7xl mx-auto">
                    <ProjectForm
                        initialData={currentProject}
                        onSubmit={handleSubmit}
                        isLoading={isUpdating}
                        onCancel={() => navigate('/admin/projects')}
                    />
                </div>
            </div>
        </>
    );
};

export default ProjectEdit;
