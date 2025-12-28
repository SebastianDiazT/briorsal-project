import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProjectForm } from '@components/projects/ProjectForm';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    fetchProjectBySlug,
    updateProject,
    clearCurrentProject,
} from '@store/slices/projectSlice';

const ProjectEdit = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { currentProject, loading, error } = useAppSelector(
        (state) => state.projects
    );

    // 1. Cargar datos del proyecto al entrar
    useEffect(() => {
        if (slug) {
            dispatch(fetchProjectBySlug(slug));
        }
        return () => {
            dispatch(clearCurrentProject()); // Limpiar al salir
        };
    }, [dispatch, slug]);

    // 2. Manejar el guardado
    const handleSubmit = async (formData: FormData) => {
        if (!currentProject) return;

        // El thunk espera { id, data }
        const result = await dispatch(
            updateProject({
                slug: currentProject.slug,
                data: formData,
            })
        );

        if (updateProject.fulfilled.match(result)) {
            toast.success('Proyecto actualizado correctamente');
            navigate('/admin/projects');
        } else {
            toast.error('No se pudo actualizar el proyecto');
        }
    };

    if (loading && !currentProject)
        return <div className="p-10 text-center">Cargando datos...</div>;
    if (error)
        return (
            <div className="p-10 text-center text-red-500">Error: {error}</div>
        );

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Editar Proyecto
                </h1>
                <p className="text-slate-500">
                    Actualiza la información y multimedia de la obra.
                </p>
            </div>

            {/* Reutilizamos el formulario pasándole los datos iniciales */}
            {currentProject && (
                <ProjectForm
                    initialData={currentProject}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    onCancel={() => navigate('/admin/projects')}
                />
            )}
        </div>
    );
};

export default ProjectEdit;
