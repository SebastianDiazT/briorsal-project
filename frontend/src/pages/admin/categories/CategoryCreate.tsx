import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaLayerGroup, FaArrowLeft } from 'react-icons/fa';
import { useCreateCategoryMutation } from '@/features/categories/api/categoriesApi';
import { CategoryForm } from '@/features/categories/components/admin/CategoryForm';
import PageMeta from '@components/common/PageMeta';
import { PageHeader } from '@components/ui/PageHeader';

const CategoryCreate = () => {
    const navigate = useNavigate();
    const [createCategory, { isLoading }] = useCreateCategoryMutation();

    const handleSubmit = async (data: { name: string }) => {
        try {
            await createCategory(data).unwrap();
            toast.success('Categoría creada exitosamente');
            navigate('/admin/categories');
        } catch (error) {
            toast.error('Error al crear la categoría');
        }
    };

    return (
        <>
            <PageMeta title="NUEVA CATEGORÍA" description="Crear nueva categoría" />
            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Nueva Categoría"
                    breadcrumbs={['Administración', 'Categorías', 'Crear']}
                    icon={FaLayerGroup}
                >
                    <button
                        onClick={() => navigate('/admin/categories')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <FaArrowLeft size={12} />
                        <span>Volver</span>
                    </button>
                </PageHeader>

                <div className="max-w-7xl">
                    <CategoryForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        onCancel={() => navigate('/admin/categories')}
                    />
                </div>
            </div>
        </>
    );
};

export default CategoryCreate;
