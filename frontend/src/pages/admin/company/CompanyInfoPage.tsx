import React from 'react';
import { useForm } from 'react-hook-form';
import {
    FaSave,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaMap,
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTiktok,
    FaWhatsapp,
    FaSpinner,
    FaBuilding,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

import {
    useGetCompanyInfoQuery,
    useUpdateCompanyInfoMutation,
} from '@/features/company/api/companyApi';
import { CompanyInfo } from '@/features/company/types';

import PageMeta from '@components/common/PageMeta';
import { PageHeader } from '@components/ui/PageHeader';

export const CompanyInfoPage = () => {
    const {
        data: response,
        isLoading: isLoadingData,
        isError,
    } = useGetCompanyInfoQuery();
    const [updateCompany, { isLoading: isUpdating }] =
        useUpdateCompanyInfoMutation();

    const { register, handleSubmit, reset } = useForm<CompanyInfo>();

    React.useEffect(() => {
        if (response?.data) {
            const cleanData = {
                ...response.data,
                facebook: response.data.facebook || '',
                instagram: response.data.instagram || '',
                linkedin: response.data.linkedin || '',
                tiktok: response.data.tiktok || '',
                whatsapp: response.data.whatsapp || '',
                opening_hours: response.data.opening_hours || '',
            };
            reset(cleanData);
        }
    }, [response, reset]);

    const extractGoogleMapsUrl = (inputValue: string) => {
        if (!inputValue) return '';
        const iframeRegex = /src="([^"]+)"/;
        const match = inputValue.match(iframeRegex);
        return match && match[1] ? match[1] : inputValue;
    };

    const onSubmit = async (data: CompanyInfo) => {
        try {
            const cleanData = {
                ...data,
                google_maps_url: extractGoogleMapsUrl(data.google_maps_url),
            };

            await updateCompany(cleanData).unwrap();

            reset(cleanData);

            toast.success('Información actualizada correctamente');
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar la información');
        }
    };

    const InputField = ({
        label,
        name,
        icon: Icon,
        placeholder,
        type = 'text',
        hint,
        isTextArea = false,
    }: any) => (
        <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
                {label}
            </label>
            <div className="relative group">
                <div
                    className={`absolute left-0 pl-3 flex pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors ${isTextArea ? 'top-3' : 'inset-y-0 items-center'}`}
                >
                    <Icon />
                </div>

                {isTextArea ? (
                    <textarea
                        {...register(name)}
                        placeholder={placeholder}
                        rows={4}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none"
                    />
                ) : (
                    <input
                        type={type}
                        {...register(name)}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                    />
                )}
            </div>
            {hint && <p className="text-xs text-slate-400 ml-1">{hint}</p>}
        </div>
    );

    if (isLoadingData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-orange-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-500 font-bold mb-2">
                    Error al cargar la información.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-sm text-slate-600 hover:text-slate-900 underline"
                >
                    Intentar recargar
                </button>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="INFORMACIÓN DE EMPRESA"
                description="Gestión de datos de contacto"
            />

            <div className="w-full animate-fade-in-up pb-20">
                <PageHeader
                    title="Información de Empresa"
                    breadcrumbs={['Administración', 'Configuración', 'Empresa']}
                    icon={FaBuilding}
                >
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isUpdating}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5
                            rounded-xl bg-slate-900 text-white text-sm font-bold
                            shadow-lg shadow-slate-900/20
                            hover:bg-orange-600 hover:shadow-orange-600/30 hover:-translate-y-0.5
                            transition-all duration-300 active:scale-95
                            disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isUpdating ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <FaSave size={14} />
                        )}
                        <span>Guardar Cambios</span>
                    </button>
                </PageHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                                    <FaMapMarkerAlt size={16} />
                                </span>
                                Datos de Contacto
                            </h2>

                            <div className="space-y-6">
                                <InputField
                                    label="Dirección Física"
                                    name="address"
                                    icon={FaMapMarkerAlt}
                                    placeholder="Ej: Av. Ejército 123, Cayma"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Teléfono / Celular"
                                        name="phone"
                                        icon={FaPhone}
                                        placeholder="+51 999 999 999"
                                    />
                                    <InputField
                                        label="Correo Electrónico"
                                        name="email"
                                        icon={FaEnvelope}
                                        type="email"
                                        placeholder="contacto@briorsal.com"
                                    />
                                </div>

                                <InputField
                                    label="Horario de Atención"
                                    name="opening_hours"
                                    icon={FaClock}
                                    isTextArea={true}
                                    placeholder="Ej: Lunes a Viernes: 9:00am - 6:00pm&#10;Sábados: 9:00am - 1:00pm"
                                    hint="Usa saltos de línea para separar los días."
                                />

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                        Link Google Maps
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <FaMap />
                                        </div>
                                        <input
                                            {...register('google_maps_url')}
                                            placeholder='Pega aquí el código "Insertar mapa" o el enlace...'
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 placeholder:no-underline placeholder:text-slate-400"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 ml-1">
                                        Puedes pegar el código HTML del iframe
                                        completo, nosotros extraeremos el
                                        enlace.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 h-full">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                    <FaFacebook size={16} />
                                </span>
                                Redes Sociales
                            </h2>

                            <div className="space-y-5">
                                <InputField
                                    label="WhatsApp (Enlace)"
                                    name="whatsapp"
                                    icon={FaWhatsapp}
                                    placeholder="https://wa.me/51955123456"
                                    hint="Usa el formato de enlace corto de WhatsApp."
                                />

                                <InputField
                                    label="Facebook"
                                    name="facebook"
                                    icon={FaFacebook}
                                    placeholder="https://facebook.com/briorsal"
                                />

                                <InputField
                                    label="Instagram"
                                    name="instagram"
                                    icon={FaInstagram}
                                    placeholder="https://instagram.com/briorsal"
                                />

                                <InputField
                                    label="LinkedIn"
                                    name="linkedin"
                                    icon={FaLinkedin}
                                    placeholder="https://linkedin.com/in/briorsal"
                                />

                                <InputField
                                    label="TikTok"
                                    name="tiktok"
                                    icon={FaTiktok}
                                    placeholder="https://tiktok.com/@briorsal"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CompanyInfoPage;
