import React, { useState } from 'react';
import {
    FaPhone,
    FaMapLocationDot,
    FaClock,
    FaPaperPlane,
    FaWhatsapp,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';

import PageMeta from '@/components/common/PageMeta';
import FadeIn from '@/components/common/FadeIn';

import { useGetCompanyInfoQuery } from '@/features/company/api/companyApi';
import { useCreateContactMessageMutation } from '@/features/contact/api/contactApi';
import { ContactMessageRequest } from '@/features/contact/types';

const FormInput = ({
    label,
    id,
    type = 'text',
    required = false,
    value,
    onChange,
    placeholder,
}: any) => (
    <div className="space-y-2">
        <label
            htmlFor={id}
            className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"
        >
            {label} {required && <span className="text-orange-500">*</span>}
        </label>
        <input
            id={id}
            name={id}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
        />
    </div>
);

const ContactInfoItem = ({ icon: Icon, title, children, delay }: any) => (
    <FadeIn delay={delay} direction="right">
        <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                <Icon className="text-white text-xl" />
            </div>
            <div>
                <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                <div className="text-slate-400 font-light leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    </FadeIn>
);

const Contact = () => {
    const { data: companyResponse } = useGetCompanyInfoQuery();
    const companyInfo = companyResponse?.data;

    const [createMessage, { isLoading }] = useCreateContactMessageMutation();

    const [formData, setFormData] = useState<ContactMessageRequest>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMessage(formData).unwrap();
            toast.success('¡Mensaje enviado correctamente!');
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            console.error(error);
            toast.error('Error al enviar el mensaje.');
        }
    };

    return (
        <>
            <PageMeta
                title="CONTACTO – BRIORSAL CONSTRUCTORA"
                description="Contáctanos para diseñar o construir tu próximo proyecto."
            />

            <div className="min-h-screen bg-slate-900 font-sans">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">
                    <div className="lg:col-span-5 bg-slate-900 relative overflow-hidden p-8 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]"></div>
                            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]"></div>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                        </div>

                        <div className="relative z-10">
                            <FadeIn direction="down">
                                <span className="inline-block py-1 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
                                    Hablemos
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                                    Inicia tu <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
                                        Proyecto.
                                    </span>
                                </h1>
                                <p className="text-slate-400 text-lg mb-12 max-w-md">
                                    Estamos listos para escuchar tus ideas y
                                    convertirlas en realidad. Contáctanos por
                                    cualquiera de nuestros canales.
                                </p>
                            </FadeIn>

                            <div className="space-y-8">
                                <ContactInfoItem
                                    icon={FaMapLocationDot}
                                    title="Ubicación"
                                    delay={0.2}
                                >
                                    <p>
                                        {companyInfo?.address ||
                                            'Cargando dirección...'}
                                    </p>
                                </ContactInfoItem>

                                <ContactInfoItem
                                    icon={FaPhone}
                                    title="Contacto Directo"
                                    delay={0.3}
                                >
                                    <p className="mb-1">
                                        {companyInfo?.phone || '...'}
                                    </p>
                                    <p className="text-orange-400">
                                        {companyInfo?.email}
                                    </p>
                                </ContactInfoItem>

                                <ContactInfoItem
                                    icon={FaClock}
                                    title="Horario de Atención"
                                    delay={0.4}
                                >
                                    <div className="whitespace-pre-line">
                                        {companyInfo?.opening_hours ||
                                            'Lunes a Viernes: 9am - 6pm'}
                                    </div>
                                </ContactInfoItem>

                                {companyInfo?.whatsapp && (
                                    <FadeIn delay={0.5} direction="up">
                                        <a
                                            href={companyInfo.whatsapp}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-3 mt-4 text-white hover:text-orange-400 transition-colors font-bold group"
                                        >
                                            <FaWhatsapp className="text-2xl group-hover:scale-110 transition-transform" />
                                            <span>Chatear por WhatsApp</span>
                                        </a>
                                    </FadeIn>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-slate-950 p-8 lg:p-20 flex flex-col justify-center relative">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent lg:hidden"></div>

                        <div className="max-w-2xl mx-auto w-full">
                            <FadeIn direction="up" delay={0.1}>
                                <h2 className="text-3xl font-bold text-white mb-8">
                                    Envíanos un mensaje
                                </h2>
                            </FadeIn>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FadeIn direction="up" delay={0.2}>
                                        <FormInput
                                            id="first_name"
                                            label="Nombres"
                                            required
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="Ej. Juan Carlos"
                                        />
                                    </FadeIn>
                                    <FadeIn direction="up" delay={0.25}>
                                        <FormInput
                                            id="last_name"
                                            label="Apellidos"
                                            required
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            placeholder="Ej. Pérez"
                                        />
                                    </FadeIn>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FadeIn direction="up" delay={0.3}>
                                        <FormInput
                                            id="email"
                                            label="E-mail"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </FadeIn>
                                    <FadeIn direction="up" delay={0.35}>
                                        <FormInput
                                            id="phone"
                                            label="Teléfono"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+51 999 999 999"
                                        />
                                    </FadeIn>
                                </div>

                                <FadeIn direction="up" delay={0.4}>
                                    <FormInput
                                        id="subject"
                                        label="Asunto"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Ej. Cotización de Proyecto (Opcional)"
                                    />
                                </FadeIn>

                                <FadeIn direction="up" delay={0.45}>
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="message"
                                            className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"
                                        >
                                            Tu Mensaje{' '}
                                            <span className="text-orange-500">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Cuéntanos detalles sobre tu proyecto..."
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300 resize-none"
                                        ></textarea>
                                    </div>
                                </FadeIn>

                                <FadeIn direction="up" delay={0.5}>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full md:w-auto px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl uppercase tracking-widest transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/40 hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Enviando...
                                            </span>
                                        ) : (
                                            <>
                                                Enviar Solicitud{' '}
                                                <FaPaperPlane />
                                            </>
                                        )}
                                    </button>
                                </FadeIn>
                            </form>
                        </div>
                    </div>
                </div>

                {companyInfo?.google_maps_url && (
                    <div className="w-full h-[400px] bg-slate-800 relative border-t border-slate-800">
                        <iframe
                            title="Ubicación"
                            src={companyInfo.google_maps_url}
                            width="100%"
                            height="100%"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>
                )}
            </div>
        </>
    );
};

export default Contact;
