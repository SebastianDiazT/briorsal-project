import {
    FaEnvelope,
    FaThLarge,
    FaBuilding,
    FaHandshake,
    FaLayerGroup,
    FaHardHat,
    FaInfoCircle, // Icono para Nosotros
    FaMapMarkedAlt, // Icono para Contacto
} from 'react-icons/fa';

export const menuGroups = [
    {
        name: 'PRINCIPAL',
        items: [
            {
                name: 'Dashboard',
                path: '/admin/dashboard',
                icon: <FaThLarge />,
            },
            {
                name: 'Buzón de Mensajes',
                path: '/admin/messages',
                icon: <FaEnvelope />,
            },
        ],
    },
    {
        name: 'CATÁLOGO Y OBRAS',
        items: [
            {
                name: 'Proyectos',
                path: '/admin/projects',
                icon: <FaBuilding />,
            },
            {
                name: 'Categorías',
                path: '/admin/categories',
                icon: <FaLayerGroup />,
            },
            {
                name: 'Servicios',
                path: '/admin/services',
                icon: <FaHardHat />,
            },
        ],
    },
    {
        name: 'GESTIÓN WEB',
        items: [
            {
                name: 'Nosotros',
                path: '/admin/about',
                icon: <FaInfoCircle />,
            },
            {
                name: 'Contacto y Sede',
                path: '/admin/company',
                icon: <FaMapMarkedAlt />,
            },
            {
                name: 'Aliados / Clientes',
                path: '/admin/clients',
                icon: <FaHandshake />,
            },
        ],
    },
];
