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
            <div className="p-10 text-center">Cargando configuración...</div>
        );
    return (
        <>
            <PageMeta title="Configuración de la Empresa" description="Configuración de la Empresa" />

            <div className="max-w-5xl mx-auto animate-fade-in-up pb-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/20">
                        <FaBuilding size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Información de la Empresa
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Gestiona los datos de contacto y redes sociales.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-brand-500" /> Datos
                            de Contacto
                        </h3>

                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Dirección Física
                                </label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="group">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                        Teléfono
                                    </label>
                                    <div className="relative">
                                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                        WhatsApp
                                    </label>
                                    <div className="relative">
                                        <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
                                        <input
                                            type="text"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleChange}
                                            placeholder="519..."
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
                            Redes Sociales
                        </h3>

                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Facebook URL
                                </label>
                                <div className="relative">
                                    <FaFacebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                                    <input
                                        type="url"
                                        name="facebook"
                                        value={formData.facebook}
                                        onChange={handleChange}
                                        placeholder="https://facebook.com/..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    Instagram URL
                                </label>
                                <div className="relative">
                                    <FaInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600" />
                                    <input
                                        type="url"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com/..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    LinkedIn URL
                                </label>
                                <div className="relative">
                                    <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700" />
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                                    TikTok URL
                                </label>
                                <div className="relative">
                                    <FaTiktok className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                                    <input
                                        type="url"
                                        name="tiktok"
                                        value={formData.tiktok}
                                        onChange={handleChange}
                                        placeholder="https://tiktok.com/@..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-10 py-4 rounded-xl bg-brand-600 text-white font-bold text-lg shadow-xl shadow-brand-600/30 hover:bg-brand-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                'Guardando...'
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
