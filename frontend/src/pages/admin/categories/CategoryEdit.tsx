import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    FaLayerGroup,
    FaArrowLeft,
    FaExclamationTriangle,
} from 'react-icons/fa';
import {
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
} from '@/features/categories/api/categoriesApi';
import { CategoryForm } from '@/features/categories/components/admin/CategoryForm';
import PageMeta from '@components/common/PageMeta';
import { PageHeader } from '@components/ui/PageHeader';

const CategoryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const categoryId = Number(id);

    const {
        data: category,
        isLoading: isLoadingData,
        isError,
    } = useGetCategoryByIdQuery(categoryId, { skip: !categoryId });
    const [updateCategory, { isLoading: isUpdating }] =
        useUpdateCategoryMutation();

    const handleSubmit = async (data: { name: string }) => {
        if (!categoryId) return;
        try {
            await updateCategory({ id: categoryId, data }).unwrap();
            toast.success('Categoría actualizada');
            navigate('/admin/categories');
        } catch (error) {
            toast.error('Error al actualizar la categoría');
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isError || !category) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                    Categoría no encontrada
                </h2>
                <button
                    onClick={() => navigate('/admin/categories')}
                    className="text-slate-500 hover:text-slate-800 underline"
                >
                    Volver al listado
                </button>
            </div>
        );
    }

    return (
        <>
            <PageMeta title="EDITAR CATEGORÍA" description="Editar categoría" />
            <div className="w-full animate-fade-in-up pb-10">
                <PageHeader
                    title="Editar Categoría"
                    breadcrumbs={[
                        'Administración',
                        'Categorías',
                        category.name,
                    ]}
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

                <CategoryForm
                    initialData={category}
                    onSubmit={handleSubmit}
                    isLoading={isUpdating}
                    onCancel={() => navigate('/admin/categories')}
                />
            </div>
        </>
    );
};

export default CategoryEdit;
