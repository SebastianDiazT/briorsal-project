import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaBuilding, FaArrowLeft } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    updateProject,
    fetchProjectBySlug,
    clearCurrentProject,
} from '@store/slices/projectSlice';
import { ProjectForm } from './ProjectForm';
import PageMeta from '@components/common/PageMeta';

const ProjectEdit = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { currentProject, loading } = useAppSelector(
        (state) => state.projects
    );

    useEffect(() => {
        if (slug) {
            dispatch(fetchProjectBySlug(slug));
        }
        // Limpiamos el proyecto actual al desmontar para evitar parpadeos en futuras navegaciones
        return () => {
            dispatch(clearCurrentProject());
        };
    }, [dispatch, slug]);

    const handleSubmit = async (formData: FormData) => {
        if (!slug) return;

        const result = await dispatch(updateProject({ slug, data: formData }));

        if (updateProject.fulfilled.match(result)) {
            toast.success('Proyecto actualizado correctamente');
            navigate('/admin/projects');
        } else {
            toast.error('No se pudo actualizar el proyecto');
        }
    };

    if (loading && !currentProject)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400 font-medium animate-pulse">
                    Cargando información del proyecto...
                </div>
            </div>
        );

    if (!currentProject && !loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-red-500 font-bold text-lg">
                    Proyecto no encontrado
                </div>
                <button
                    onClick={() => navigate('/admin/projects')}
                    className="text-orange-600 hover:underline"
                >
                    Volver al listado
                </button>
            </div>
        );

    return (
        <>
            <PageMeta
                title="EDITAR PROYECTO"
                description={`Editando ${currentProject?.name}`}
            />

            <div className="w-full animate-fade-in-up pb-10">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-white text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm shadow-orange-100/50">
                            <FaBuilding size={28} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                Editar Proyecto
                            </h1>
                            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                                Modificando:
                                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 text-xs">
                                    {currentProject?.name}
                                </span>
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
                        initialData={currentProject}
                        onSubmit={handleSubmit}
                        isLoading={loading}
                        onCancel={() => navigate('/admin/projects')}
                    />
                </div>
            </div>
        </>
    );
};

export default ProjectEdit;
