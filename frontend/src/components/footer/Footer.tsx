import {
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaLinkedin,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from 'react-icons/fa';
import logoBriorsal from '@assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-brand-dark-900 text-white py-5 font-sans">
            <div className="max-w-[88%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10">
                    <div className="flex justify-center items-center h-32">
                        <img
                            src={logoBriorsal}
                            alt="Briorsal Constructora"
                            className="h-12 w-auto object-contain"
                        />
                    </div>

                    <div className="text-center lg:text-left flex flex-col items-center lg:items-center">
                        <h3 className="text-white font-bold text-xl uppercase tracking-wide mb-6 text-center">
                            CONTACTO
                        </h3>

                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-brand-400 text-lg flex-shrink-0" />{' '}
                                <a
                                    href="https://wa.me/51952322024"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="uppercase hover:text-brand-400 transition-colors"
                                >
                                    CELULAR: 952 322 024
                                </a>
                            </li>

                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-brand-400 text-lg flex-shrink-0" />{' '}
                                <a
                                    href="mailto:constructora@grupobriorsal.com"
                                    className="uppercase hover:text-brand-400 transition-colors"
                                >
                                    CORREO: CONSTRUCTORA@GRUPOBRIORSAL.COM
                                </a>
                            </li>

                            <li className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-brand-400 text-lg flex-shrink-0" />{' '}
                                <a
                                    href="https://www.google.com/maps/place/16%C2%B023'29.0%22S+71%C2%B032'56.3%22W/@-16.3913977,-71.5496247,19z/data=!3m1!4b1!4m4!3m3!8m2!3d-16.391399!4d-71.548981?entry=ttu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="uppercase hover:text-brand-400 transition-colors"
                                >
                                    DIRECCIÓN: LEON XIII, D1 - CAYMA - AREQUIPA
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center lg:text-right flex flex-col items-center lg:items-center">
                        <h3 className="text-white font-bold text-xl uppercase tracking-wide mb-6">
                            REDES SOCIALES
                        </h3>

                        <div className="flex gap-6">
                            <a
                                href="https://www.facebook.com/BriorsalConstructora"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-brand-dark-900 rounded-full p-2 hover:bg-brand-400 hover:text-white transition-all duration-300"
                            >
                                <FaFacebook size={20} />
                            </a>
                            <a
                                href="https://www.instagram.com/briorsalconstructora/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-brand-dark-900 rounded-full p-2 hover:bg-brand-400 hover:text-white transition-all duration-300"
                            >
                                <FaInstagram size={20} />
                            </a>
                            <a
                                href="https://www.tiktok.com/@briorsalconstructora"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-brand-dark-900 rounded-full p-2 hover:bg-brand-400 hover:text-white transition-all duration-300"
                            >
                                <FaTiktok size={20} />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/briorsalconstructora/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-brand-dark-900 rounded-full p-2 hover:bg-brand-400 hover:text-white transition-all duration-300"
                            >
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
