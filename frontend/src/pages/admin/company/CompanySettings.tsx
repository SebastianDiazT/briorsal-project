import React, { useEffect, useState } from 'react';
import {
    FaSave,
    FaBuilding,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTiktok,
    FaWhatsapp,
    FaGlobe,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
    fetchCompanyInfo,
    updateCompanyInfo,
} from '@store/slices/companySlice';
import PageMeta from '@/components/common/PageMeta';

const CompanySettings: React.FC = () => {
    const dispatch = useAppDispatch();
    const { companyInfo, loading } = useAppSelector((state) => state.company);

    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        address: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        tiktok: '',
        whatsapp: '',
    });

    useEffect(() => {
        dispatch(fetchCompanyInfo());
    }, [dispatch]);

    useEffect(() => {
        if (companyInfo) {
            setFormData({
                phone: companyInfo.phone || '',
                email: companyInfo.email || '',
                address: companyInfo.address || '',
                facebook: companyInfo.facebook || '',
                instagram: companyInfo.instagram || '',
                linkedin: companyInfo.linkedin || '',
                tiktok: companyInfo.tiktok || '',
                whatsapp: companyInfo.whatsapp || '',
            });
        }
    }, [companyInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await dispatch(updateCompanyInfo(formData));

        if (updateCompanyInfo.fulfilled.match(result)) {
            toast.success('Información guardada correctamente');
            dispatch(fetchCompanyInfo());
        } else {
            toast.error('Error al guardar cambios');
        }
    };

    if (loading && !companyInfo)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400 font-medium animate-pulse">
                    Cargando configuración...
                </div>
            </div>
        );

    return (
        <>
            <PageMeta
                title="CONFIGURACIÓN EMPRESA"
                description="Gestiona los datos de contacto y redes sociales de tu empresa."
            />

            <div className="w-full animate-fade-in-up pb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none opacity-50"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-white text-brand-600 flex items-center justify-center border border-brand-100 shadow-sm shadow-brand-100/50">
                            <FaBuilding size={28} />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                                Información de la Empresa
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Gestiona los datos de contacto y enlaces a redes
                                sociales que aparecerán en el pie de página.
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <span className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                                <FaMapMarkerAlt size={16} />
                            </span>
                            <h3 className="text-lg font-bold text-slate-800">
                                Datos de Contacto
                            </h3>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Dirección Física
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaMapMarkerAlt className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                                        placeholder="Ej: Av. Principal 123, Oficina 404"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                                        placeholder="contacto@tuempresa.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="group">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                        Teléfono
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaPhone className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                                            placeholder="+51 987 654 321"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                        WhatsApp
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaWhatsapp className="text-slate-400 group-focus-within:text-green-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                                            placeholder="51987654321"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            <span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <FaGlobe size={16} />
                            </span>
                            <h3 className="text-lg font-bold text-slate-800">
                                Redes Sociales
                            </h3>
                        </div>

                        <div className="space-y-5 flex-1">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Facebook
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaFacebook className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        name="facebook"
                                        value={formData.facebook}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Instagram
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaInstagram className="text-slate-400 group-focus-within:text-pink-600 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    LinkedIn
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLinkedin className="text-slate-400 group-focus-within:text-blue-700 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                                        placeholder="https://linkedin.com/company/..."
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    TikTok
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaTiktok className="text-slate-400 group-focus-within:text-black transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        name="tiktok"
                                        value={formData.tiktok}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                                        placeholder="https://tiktok.com/@..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-10 py-4 rounded-xl bg-brand-600 text-white font-bold text-lg shadow-xl shadow-brand-600/20 hover:bg-brand-700 hover:shadow-brand-600/30 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <FaSave /> Guardar Configuración
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CompanySettings;
