import { useEffect } from 'react';
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
    FaMapMarkedAlt,
    FaExternalLinkAlt,
    FaInfoCircle,
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

    useEffect(() => {
        if (response?.data) {
            const cleanData = {
                ...response.data,
                facebook: response.data.facebook || '',
                instagram: response.data.instagram || '',
                linkedin: response.data.linkedin || '',
                tiktok: response.data.tiktok || '',
                whatsapp: response.data.whatsapp || '',
                opening_hours: response.data.opening_hours || '',
                google_maps_url: response.data.google_maps_url || '',
                google_maps_link: response.data.google_maps_link || '',
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
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 ml-1 flex items-center gap-2">
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
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
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
            {hint && (
                <p className="text-xs text-slate-500 ml-1 leading-relaxed flex items-start gap-1.5">
                    <FaInfoCircle className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{hint}</span>
                </p>
            )}
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
            <div className="p-10 text-center text-red-500">
                Error al cargar datos.
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
                    title="Contacto y Sede"
                    breadcrumbs={['Administración', 'Gestión Web', 'Contacto']}
                    icon={FaMapMarkedAlt}
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
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 border-t-4 border-t-orange-400">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                                <span className="bg-orange-100 text-orange-600 p-2.5 rounded-xl shadow-sm">
                                    <FaMapMarkerAlt size={18} />
                                </span>
                                Ubicación y Horarios
                            </h2>

                            <div className="space-y-8">
                                <InputField
                                    label="Dirección Física Completa"
                                    name="address"
                                    icon={FaMapMarkerAlt}
                                    placeholder="Ej: Av. Ejército 123, Of. 405, Cayma, Arequipa"
                                    hint="Esta dirección aparecerá en el pie de página de la web."
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Teléfono Fijo o Celular"
                                        name="phone"
                                        icon={FaPhone}
                                        placeholder="Ej: (054) 254-456  o  +51 987 654 321"
                                    />
                                    <InputField
                                        label="Correo Electrónico de Contacto"
                                        name="email"
                                        icon={FaEnvelope}
                                        type="email"
                                        placeholder="Ej: contacto@briorsal.com"
                                    />
                                </div>

                                <InputField
                                    label="Horario de Atención al Público"
                                    name="opening_hours"
                                    icon={FaClock}
                                    isTextArea={true}
                                    placeholder={
                                        'Ej:\nLunes a Viernes: 9:00am - 6:00pm\nSábados: 9:00am - 1:00pm\nDomingos: Cerrado'
                                    }
                                    hint="Usa 'Enter' para escribir cada día en una línea diferente."
                                />

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-6">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">
                                        Configuración de Google Maps
                                    </h3>

                                    <InputField
                                        label="1. Mapa Visual (Para mostrar en la web)"
                                        name="google_maps_url"
                                        icon={FaMap}
                                        placeholder='Pega aquí el código que empieza con <iframe src="...">...'
                                        hint='Ve a Google Maps > Compartir > "Insertar un mapa" > Copiar HTML. Pégalo aquí completo.'
                                    />

                                    <InputField
                                        label="2. Enlace GPS (Botón 'Cómo llegar')"
                                        name="google_maps_link"
                                        icon={FaExternalLinkAlt}
                                        placeholder="Ej: https://maps.app.goo.gl/XyZ123..."
                                        hint='Ve a Google Maps > Compartir > "Enviar un vínculo". Copia el enlace corto.'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 border-t-4 border-t-blue-400 h-full">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                                <span className="bg-blue-100 text-blue-600 p-2.5 rounded-xl shadow-sm">
                                    <FaFacebook size={18} />
                                </span>
                                Redes Sociales
                            </h2>

                            <p className="text-sm text-slate-500 mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                Copia y pega el enlace completo de tu perfil
                                (ej: https://...). Si dejas un campo vacío, el
                                icono no aparecerá en la web.
                            </p>

                            <div className="space-y-6">
                                <InputField
                                    label="Enlace de WhatsApp (API)"
                                    name="whatsapp"
                                    icon={FaWhatsapp}
                                    placeholder="Ej: https://wa.me/51955123456"
                                    hint="Usa el formato: https://wa.me/ seguido de tu número con código de país (51)."
                                />

                                <InputField
                                    label="Perfil de Facebook"
                                    name="facebook"
                                    icon={FaFacebook}
                                    placeholder="Ej: https://www.facebook.com/briorsal"
                                />

                                <InputField
                                    label="Perfil de Instagram"
                                    name="instagram"
                                    icon={FaInstagram}
                                    placeholder="Ej: https://www.instagram.com/briorsal_constructora"
                                />

                                <InputField
                                    label="Perfil de LinkedIn"
                                    name="linkedin"
                                    icon={FaLinkedin}
                                    placeholder="Ej: https://www.linkedin.com/company/briorsal"
                                />

                                <InputField
                                    label="Perfil de TikTok"
                                    name="tiktok"
                                    icon={FaTiktok}
                                    placeholder="Ej: https://www.tiktok.com/@briorsal"
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
