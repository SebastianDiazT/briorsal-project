import PageMeta from '@components/common/PageMeta';
import FadeIn from '@components/common/FadeIn';

const Contact = () => {
    return (
        <>
            <PageMeta
                title="Contacto"
                description="Contactanos para cualquier consulta"
            />

            <div className="min-h-screen bg-brand-dark-900 text-white flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8">
                <FadeIn direction="down" className="text-center mb-16">
                    <p className="text-brand-400 text-lg md:text-xl font-medium tracking-wide mb-2">
                        ¿Estas pensando en diseñar o construir algún proyecto?
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wider text-white">
                        ¡CONTACTANOS!
                    </h1>
                </FadeIn>

                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-center">
                    <FadeIn
                        delay={0.2}
                        direction="up"
                        className="flex flex-col items-center"
                    >
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold mb-2">
                                Encuéntranos
                            </h3>
                            <div className="w-20 h-1 bg-brand-400 mx-auto rounded-full"></div>
                        </div>
                        <p className="text-brand-dark-200 font-light leading-relaxed text-lg">
                            Leon XIII D-1 <br />
                            Cayma - Arequipa - Perú
                        </p>
                    </FadeIn>

                    <FadeIn
                        delay={0.3}
                        direction="up"
                        className="flex flex-col items-center"
                    >
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold mb-2">
                                Contáctanos
                            </h3>
                            <div className="w-20 h-1 bg-brand-400 mx-auto rounded-full"></div>
                        </div>
                        <p className="text-brand-dark-200 font-light leading-relaxed text-lg">
                            952 322 024 <br />
                            constructora@grupobriorsal.com
                        </p>
                    </FadeIn>

                    <FadeIn
                        delay={0.4}
                        direction="up"
                        className="flex flex-col items-center"
                    >
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold mb-2">
                                Horario De Atención
                            </h3>
                            <div className="w-20 h-1 bg-brand-400 mx-auto rounded-full"></div>
                        </div>
                        <p className="text-brand-dark-200 font-light leading-relaxed text-lg">
                            Lunes a Viernes: 8 am - 5 pm <br />
                            Sábados: 8 am - 1 pm
                        </p>
                    </FadeIn>
                </div>

                <div className="w-full max-w-5xl mb-10">
                    <form className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {/* Input: Nombre */}
                            <div className="group relative">
                                <label className="block text-xs font-bold text-brand-dark-500 uppercase mb-2 tracking-widest group-focus-within:text-brand-400 transition-colors">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-b border-brand-dark-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-brand-400 transition-colors"
                                />
                            </div>

                            {/* Input: Apellido */}
                            <div className="group relative">
                                <label className="block text-xs font-bold text-brand-dark-500 uppercase mb-2 tracking-widest group-focus-within:text-brand-400 transition-colors">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-b border-brand-dark-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-brand-400 transition-colors"
                                />
                            </div>

                            {/* Input: E-mail */}
                            <div className="group relative">
                                <label className="block text-xs font-bold text-brand-dark-500 uppercase mb-2 tracking-widest group-focus-within:text-brand-400 transition-colors">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    className="w-full bg-transparent border-b border-brand-dark-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-brand-400 transition-colors"
                                />
                            </div>

                            {/* Input: Teléfono */}
                            <div className="group relative">
                                <label className="block text-xs font-bold text-brand-dark-500 uppercase mb-2 tracking-widest group-focus-within:text-brand-400 transition-colors">
                                    Número de Teléfono
                                </label>
                                <input
                                    type="tel"
                                    className="w-full bg-transparent border-b border-brand-dark-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-brand-400 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Textarea: Mensaje */}
                        <div className="group relative">
                            <label className="block text-xs font-bold text-brand-dark-500 uppercase mb-2 tracking-widest group-focus-within:text-brand-400 transition-colors">
                                Tu Mensaje
                            </label>
                            <textarea
                                rows={4}
                                className="w-full bg-transparent border-b border-brand-dark-600 py-2 text-white placeholder-transparent focus:outline-none focus:border-brand-400 transition-colors resize-none"
                            ></textarea>
                        </div>

                        {/* Botón Enviar (Naranja completo) */}
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                className="bg-brand-400 hover:bg-brand-500 text-white font-bold py-3 px-16 uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-brand-400/20"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="w-full h-[450px] bg-gray-800">
                <iframe
                    title="Ubicación Briorsal"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d30621.263396430455!2d-71.5491!3d-16.391379!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424a682cb96881%3A0xf7829e00c9f4207f!2sUrb.%20Le%C3%B3n%20XIII%202%2C%20Cayma%2004000%2C%20Per%C3%BA!5e0!3m2!1ses-419!2sus!4v1765875717922!5m2!1ses-419!2sus"
                    width="100%"
                    height="100%"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </>
    );
};

export default Contact;
