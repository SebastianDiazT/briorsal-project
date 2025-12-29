import {
    FaEnvelope,
    FaThLarge,
    FaBuilding,
    FaLayerGroup,
    FaHardHat,
    FaUsersCog,
    FaCogs,
    FaUserFriends,
} from 'react-icons/fa';

export const menuGroups = [
    {
        name: 'GESTIÓN',
        items: [
            {
                name: 'Dashboard',
                path: '/admin/dashboard',
                icon: <FaThLarge />,
            },
            {
                name: 'Mensajes',
                path: '/admin/messages',
                icon: <FaEnvelope />,
            },
        ],
    },
    {
        name: 'PORTAFOLIO',
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
            {
                name: 'Nosotros',
                path: '/admin/about',
                icon: <FaUserFriends />,
            },
        ],
    },
    {
        name: 'SISTEMA',
        items: [
            {
                name: 'Usuarios',
                path: '/admin/users',
                icon: <FaUsersCog />,
            },
            {
                name: 'Configuración',
                path: '/admin/settings',
                icon: <FaCogs />,
            },
        ],
    },
];
