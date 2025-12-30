import React, { useEffect, useState } from 'react';
import {
    FaLayerGroup,
    FaPlus,
    FaTrash,
    FaEdit,
    FaSearch,
    FaAngleDown,
    FaChartPie,
    FaTimes,
    FaSave,
    FaChevronLeft,
    FaChevronRight,
    FaFolderOpen,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// --- USANDO TUS ALIAS ---
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@store/slices/categorySlice';
import { Category } from '@/types';
import { ConfirmModal } from '@components/ui/ConfirmModal';
import PageMeta from '@components/common/PageMeta';

const CategoriesList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { categories, loading } = useAppSelector((state) => state.categories);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [formName, setFormName] = useState('');

    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const count = filteredCategories.length;
    const totalPages = Math.ceil(count / pageSize);

    useEffect(() => {
        if (page > totalPages && totalPages > 0) setPage(totalPages);
        if (page === 0 && totalPages > 0) setPage(1);
        if (count > 0 && page === 0) setPage(1);
    }, [count, page, totalPages]);

    const paginatedCategories = filteredCategories.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormName(category.name);
        } else {
            setEditingCategory(null);
            setFormName('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormName('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) return;

        let result;
        if (editingCategory) {
            result = await dispatch(
                updateCategory({ id: editingCategory.id, name: formName })
            );
        } else {
            result = await dispatch(createCategory(formName));
        }

        if (
            createCategory.fulfilled.match(result) ||
            updateCategory.fulfilled.match(result)
        ) {
            toast.success(
                editingCategory ? 'Categoría actualizada' : 'Categoría creada'
            );
            closeModal();
        } else {
            toast.error('Error al guardar');
        }
    };

    const handleDelete = async () => {
        if (deleteId) {
            const result = await dispatch(deleteCategory(deleteId));
            if (deleteCategory.fulfilled.match(result)) {
                toast.success('Categoría eliminada');
                if (paginatedCategories.length === 1 && page > 1) {
                    setPage(page - 1);
                }
            } else {
                toast.error('No se puede eliminar (en uso)');
            }
            setDeleteId(null);
        }
    };

    return (
        <>
            <PageMeta
                title="GESTIÓN DE CATEGORÍAS"
                description="GESTIÓN Y ADMINISTRACIÓN DE LAS CATEGORÍAS DE PROYECTOS"
            />

            <div className="w-full animate-fade-in-up pb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-white text-brand-600 flex items-center justify-center border border-brand-100 shadow-sm shadow-brand-100/50">
                            <FaLayerGroup size={28} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                Gestión de Categorías
                            </h1>

                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200">
                                    <FaChartPie
                                        size={10}
                                        className="text-slate-400"
                                    />
                                    {categories.length} Registros
                                </span>

                                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-green-100">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Etiquetas Activas
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto relative z-10">
                        <button
                            onClick={() => openModal()}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all active:scale-95 text-sm"
                        >
                            <FaPlus size={14} />
                            Nueva Categoría
                        </button>
                    </div>
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:max-w-xs group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-xl leading-5 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 sm:text-sm transition-all font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end px-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide hidden sm:inline">
                            Mostrar:
                        </span>
                        <div className="relative">
                            <select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                className="appearance-none bg-slate-50 border border-slate-200 hover:border-brand-300 text-slate-700 text-sm font-bold rounded-lg pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                            >
                                <option value="5">5 filas</option>
                                <option value="10">10 filas</option>
                                <option value="20">20 filas</option>
                                <option value="50">50 filas</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                <FaAngleDown size={12} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6">
                        {loading && categories.length === 0 ? (
                            <div className="py-20 text-center text-slate-400">
                                <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-brand-500 rounded-full animate-spin mb-4"></div>
                                <p>Cargando categorías...</p>
                            </div>
                        ) : filteredCategories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="relative mb-6 group">
                                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-500">
                                        {searchTerm ? (
                                            <FaSearch className="text-5xl text-slate-300" />
                                        ) : (
                                            <FaFolderOpen className="text-5xl text-slate-300" />
                                        )}
                                    </div>
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-brand-500 rounded-full blur-xl opacity-20 animate-pulse"></div>

                                    <div className="absolute bottom-2 right-2 z-20 bg-white p-2 rounded-full shadow-md border border-slate-100">
                                        {searchTerm ? (
                                            <FaTimes
                                                className="text-red-400"
                                                size={14}
                                            />
                                        ) : (
                                            <FaPlus
                                                className="text-brand-500"
                                                size={14}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="text-center max-w-md mx-auto space-y-2">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {searchTerm
                                            ? 'No hay coincidencias'
                                            : 'El catálogo está vacío'}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed">
                                        {searchTerm ? (
                                            <>
                                                No encontramos categorías que
                                                coincidan con{' '}
                                                <span className="font-bold text-slate-700">
                                                    "{searchTerm}"
                                                </span>
                                                .
                                                <br />
                                                Revisa la ortografía o intenta
                                                con otro término.
                                            </>
                                        ) : (
                                            'Aún no has creado ninguna categoría. ¡Empieza ahora para organizar tus proyectos!'
                                        )}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    {searchTerm ? (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-brand-600 hover:border-brand-300 transition-all shadow-sm active:scale-95"
                                        >
                                            <FaTimes /> Limpiar búsqueda
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => openModal()}
                                            className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:-translate-y-1 transition-all"
                                        >
                                            <FaPlus /> Crear mi primera
                                            categoría
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {paginatedCategories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-200 transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-brand-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform pointer-events-none"></div>

                                        <div className="flex items-start justify-between mb-4 relative z-10">
                                            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg border border-brand-100 shadow-sm">
                                                {cat.name
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() =>
                                                        openModal(cat)
                                                    }
                                                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteId(cat.id)
                                                    }
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-brand-700 transition-colors truncate">
                                            {cat.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-mono">
                                            ID: #{cat.id}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {count > 0 && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="text-xs text-slate-500 font-medium">
                                Mostrando{' '}
                                <span className="font-bold text-slate-700">
                                    {Math.min((page - 1) * pageSize + 1, count)}
                                </span>{' '}
                                -{' '}
                                <span className="font-bold text-slate-700">
                                    {Math.min(page * pageSize, count)}
                                </span>{' '}
                                de{' '}
                                <span className="font-bold text-slate-700">
                                    {count}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page === 1}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:text-brand-600 hover:border-brand-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                >
                                    <FaChevronLeft size={10} />
                                    <span className="hidden sm:inline">
                                        Anterior
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        setPage((p) =>
                                            p < totalPages ? p + 1 : p
                                        )
                                    }
                                    disabled={page >= totalPages}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:text-brand-600 hover:border-brand-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                >
                                    <span className="hidden sm:inline">
                                        Siguiente
                                    </span>
                                    <FaChevronRight size={10} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up border border-slate-100">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">
                                    {editingCategory
                                        ? 'Renombrar Categoría'
                                        : 'Nueva Categoría'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                    Nombre
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={formName}
                                    onChange={(e) =>
                                        setFormName(e.target.value)
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all font-bold text-slate-700 mb-6 placeholder-slate-300"
                                    placeholder="Ej: Residencial"
                                />
                                <button
                                    type="submit"
                                    disabled={!formName.trim() || loading}
                                    className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 disabled:opacity-50 shadow-lg shadow-brand-600/20 flex justify-center items-center gap-2"
                                >
                                    {editingCategory ? (
                                        <>
                                            {' '}
                                            <FaSave /> Guardar Cambios{' '}
                                        </>
                                    ) : (
                                        <>
                                            {' '}
                                            <FaPlus /> Crear Categoría{' '}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <ConfirmModal
                    isOpen={!!deleteId}
                    title="¿Eliminar Categoría?"
                    message="Asegúrate de que no haya proyectos usando esta categoría."
                    confirmText="Borrar"
                    isDestructive
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            </div>
        </>
    );
};

export default CategoriesList;
