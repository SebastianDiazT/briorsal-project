import {
    FaFacebookF,
    FaInstagram,
    FaTiktok,
    FaLinkedinIn,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from 'react-icons/fa';
import logoBriorsal from '@assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-brand-dark-950 text-white py-12 font-sans border-t border-brand-dark-800">
            <div className="w-full max-w-[90%] mx-auto px-4">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-8">
                    {/* COLUMNA 1: LOGO */}
                    <div className="flex justify-center items-center lg:justify-start">
                        <img
                            src={logoBriorsal}
                            alt="Briorsal Constructora"
                            className="h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                        />
                    </div>

                    {/* COLUMNA 2: CONTACTO */}
                    <div className="text-center lg:text-left">
                        <h3 className="font-extrabold text-base uppercase tracking-widest mb-6 relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 lg:after:left-0 lg:after:translate-x-0 after:w-12 after:h-[3px] after:bg-brand-500">
                            Contacto
                        </h3>

                        <ul className="space-y-5 text-sm font-medium text-gray-300">
                            <li className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-3 group">
                                <FaPhoneAlt className="text-brand-500 text-lg mt-0.5 group-hover:scale-110 transition-transform" />
                                <a
                                    href="https://wa.me/51952322024"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="uppercase hover:text-white transition-colors"
                                >
                                    Celular:{' '}
                                    <span className="text-white font-bold">
                                        952 322 024
                                    </span>
                                </a>
                            </li>

                            <li className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-3 group">
                                <FaEnvelope className="text-brand-500 text-lg mt-0.5 group-hover:scale-110 transition-transform" />
                                <a
                                    href="mailto:constructora@grupobriorsal.com"
                                    className="uppercase hover:text-white transition-colors"
                                >
                                    Correo:{' '}
                                    <span className="text-white font-bold">
                                        constructora@grupobriorsal.com
                                    </span>
                                </a>
                            </li>

                            <li className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-3 group">
                                <FaMapMarkerAlt className="text-brand-500 text-lg mt-0.5 group-hover:scale-110 transition-transform" />
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="uppercase hover:text-white transition-colors max-w-xs text-center lg:text-left"
                                >
                                    Dirección:{' '}
                                    <span className="text-white">
                                        Leon XIII, D1 - Cayma - Arequipa
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMNA 3: REDES */}
                    <div className="text-center lg:text-right flex flex-col items-center lg:items-end">
                        <h3 className="font-extrabold text-base uppercase tracking-widest mb-6 relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 lg:after:right-0 lg:after:left-auto lg:after:translate-x-0 after:w-12 after:h-[3px] after:bg-brand-500">
                            Síguenos
                        </h3>

                        <div className="flex gap-4">
                            {[
                                {
                                    href: 'https://www.facebook.com/BriorsalConstructora',
                                    icon: <FaFacebookF />,
                                },
                                {
                                    href: 'https://www.instagram.com/briorsalconstructora/',
                                    icon: <FaInstagram />,
                                },
                                {
                                    href: 'https://www.tiktok.com/@briorsalconstructora',
                                    icon: <FaTiktok />,
                                },
                                {
                                    href: 'https://www.linkedin.com/company/briorsalconstructora/',
                                    icon: <FaLinkedinIn />,
                                },
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-brand-dark-800 text-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="mt-12 pt-8 border-t border-brand-dark-800 text-center text-xs text-gray-500">
                    <p>
                        &copy; {new Date().getFullYear()} Grupo Briorsal. Todos
                        los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
