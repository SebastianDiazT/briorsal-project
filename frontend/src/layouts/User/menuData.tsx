import {
    FaBuilding,
    FaUserFriends,
    FaHardHat,
    FaEnvelope,
} from 'react-icons/fa';
import { JSX } from 'react/jsx-runtime';

export type MenuItem = {
    name: string;
    path: string;
    icon: JSX.Element;
};

export const items: MenuItem[] = [
    {
        name: 'PROYECTOS',
        path: '/projects',
        icon: <FaBuilding />,
    },
    {
        name: 'NOSOTROS',
        path: '/about',
        icon: <FaUserFriends />,
    },
    {
        name: 'SERVICIOS',
        path: '/services',
        icon: <FaHardHat />,
    },
    {
        name: 'CONTACTO',
        path: '/contact',
        icon: <FaEnvelope />,
    },
];
