import {
    FaEnvelope,
    FaThLarge,
    FaBuilding,
    FaHandshake,
    FaLayerGroup,
    FaHardHat,
    FaUsersCog,
    FaCogs,
    FaUserFriends,
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
        name: 'CONTENIDO WEB',
        items: [
            {
                name: 'Info. Empresa',
                path: '/admin/about',
                icon: <FaUserFriends />,
            },
            {
                name: 'Aliados / Clientes',
                path: '/admin/clients',
                icon: <FaHandshake />,
            },
        ],
    },
    {
        name: 'ADMINISTRACIÓN',
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
