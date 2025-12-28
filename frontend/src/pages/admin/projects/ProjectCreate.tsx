import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProjectForm } from '@components/projects/ProjectForm';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { createProject } from '@store/slices/projectSlice';

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
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Nuevo Proyecto
                </h1>
                <p className="text-slate-500">
                    Agrega una nueva obra a tu portafolio.
                </p>
            </div>
            <ProjectForm
                onSubmit={handleSubmit}
                isLoading={loading}
                onCancel={() => navigate('/admin/projects')}
            />
        </div>
    );
};

export default ProjectCreate;
