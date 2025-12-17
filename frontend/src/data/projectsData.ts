export type CategoryType =
    | 'vivienda'
    | 'departamento'
    | 'comercio'
    | 'estructura';

export interface Project {
    id: number;
    title: string;
    category: CategoryType;
    images: string[];
    // Ficha Técnica
    location: string;
    buildingType: string;
    levels: string;
    area: string;
    status: string;
    extraInfo: string;
}

export const projectsData: Project[] = [
    // =========================================
    //               VIVIENDAS
    // =========================================
    {
        id: 1,
        title: 'Casa Bella',
        category: 'vivienda',
        images: [
            '/images/projects/vivienda/casa-bella-1.jpg',
            '/images/projects/vivienda/casa-bella-2.jpg',
        ],
        location: 'Cayma, Arequipa',
        buildingType: 'Vivienda Unifamiliar',
        levels: '2 Niveles + Azotea',
        area: '240 m²',
        status: 'Terminado',
        extraInfo: 'Diseño moderno con acabados en piedra.',
    },
    {
        id: 2,
        title: 'Fundo Santa Rosa',
        category: 'vivienda',
        images: [
            '/images/projects/vivienda/santa-rosa-1.jpg',
            '/images/projects/vivienda/santa-rosa-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Vivienda de Campo',
        levels: '1 Nivel',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 3,
        title: 'Fundo Santa Rosa E15',
        category: 'vivienda',
        images: [
            '/images/projects/vivienda/santa-rosa-e15-1.jpg',
            '/images/projects/vivienda/santa-rosa-e15-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Vivienda',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 4,
        title: 'Casa de Playa Cerrillos',
        category: 'vivienda',
        images: [
            '/images/projects/vivienda/cerrillos-1.jpg',
            '/images/projects/vivienda/cerrillos-2.jpg',
        ],
        location: 'Camaná',
        buildingType: 'Casa de Playa',
        levels: '2 Niveles',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 5,
        title: 'Casa de Playa Mejía',
        category: 'vivienda',
        images: [
            '/images/projects/vivienda/mejia-1.jpg',
            '/images/projects/vivienda/mejia-2.jpg',
        ],
        location: 'Mejía',
        buildingType: 'Casa de Playa',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 6,
        title: 'Casa Lago',
        category: 'vivienda',
        images: [
            '/images/projects/vivienda/lago-1.jpg',
            '/images/projects/vivienda/lago-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Vivienda',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 7,
        title: 'Casa Socabaya',
        category: 'vivienda',
        images: [
            '/images/projects/vivienda/socabaya-1.jpg',
            '/images/projects/vivienda/socabaya-2.jpg',
        ],
        location: 'Socabaya, Arequipa',
        buildingType: 'Vivienda',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },

    // =========================================
    //             DEPARTAMENTOS
    // =========================================
    {
        id: 8,
        title: 'Dptos. Bolognesi',
        category: 'departamento',
        images: [
            '/images/projects/departamento/bolognesi-1.jpg',
            '/images/projects/departamento/bolognesi-2.jpg',
        ],
        location: 'Yanahuara/Cayma', // Ejemplo
        buildingType: 'Edificio Multifamiliar',
        levels: '5 Niveles',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 9,
        title: 'Cerro Verde',
        category: 'departamento',
        images: [
            '/images/projects/departamento/cerro-verde-1.jpg',
            '/images/projects/departamento/cerro-verde-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Complejo Habitacional',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'En Ejecución', // Ejemplo
        extraInfo: '',
    },
    {
        id: 10,
        title: 'El Dorado',
        category: 'departamento',
        images: [
            '/images/projects/departamento/dorado-1.jpg',
            '/images/projects/departamento/dorado-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Edificio Residencial',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },

    // =========================================
    //               COMERCIOS
    // =========================================
    {
        id: 11,
        title: 'Concesionaria de Comida',
        category: 'comercio',
        images: [
            '/images/projects/comercio/concesionaria-1.jpg',
            '/images/projects/comercio/concesionaria-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Local Comercial',
        levels: '1 Nivel',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 12,
        title: 'Intercolca Sport',
        category: 'comercio',
        images: [
            '/images/projects/comercio/intercolca-1.jpg',
            '/images/projects/comercio/intercolca-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Local Deportivo/Comercial',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 13,
        title: 'Mercado Acomare',
        category: 'comercio',
        images: [
            '/images/projects/comercio/acomare-1.jpg',
            '/images/projects/comercio/acomare-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Mercado / Puestos',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 14,
        title: 'Mall Plaza Lexus',
        category: 'comercio',
        images: [
            '/images/projects/comercio/lexus-1.jpg',
            '/images/projects/comercio/lexus-2.jpg',
        ],
        location: 'Mall Plaza Arequipa',
        buildingType: 'Retail / Tienda',
        levels: '1 Nivel',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: 'Habilitación de tienda comercial.',
    },
    {
        id: 15,
        title: 'Mall Plaza Lego',
        category: 'comercio',
        images: [
            '/images/projects/comercio/lego-1.jpg',
            '/images/projects/comercio/lego-2.jpg',
        ],
        location: 'Mall Plaza Arequipa',
        buildingType: 'Retail / Tienda',
        levels: '1 Nivel',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 16,
        title: 'Oficinas Adra',
        category: 'comercio',
        images: [
            '/images/projects/comercio/adra-1.jpg',
            '/images/projects/comercio/adra-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Oficinas Corporativas',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 17,
        title: 'Parque Lambramani – Dulci Crepa',
        category: 'comercio',
        images: [
            '/images/projects/comercio/dulci-1.jpg',
            '/images/projects/comercio/dulci-2.jpg',
        ],
        location: 'Parque Lambramani',
        buildingType: 'Módulo Comercial',
        levels: '1 Nivel',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 18,
        title: 'Puerta Mar',
        category: 'comercio',
        images: [
            '/images/projects/comercio/puerta-mar-1.jpg',
            '/images/projects/comercio/puerta-mar-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Restaurante',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 19,
        title: 'Puerta Mar – Fuego',
        category: 'comercio',
        images: [
            '/images/projects/comercio/puerta-fuego-1.jpg',
            '/images/projects/comercio/puerta-fuego-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Restaurante / Zona Parrilla',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 20,
        title: 'Restaurante Picanta',
        category: 'comercio',
        images: [
            '/images/projects/comercio/picanta-1.jpg',
            '/images/projects/comercio/picanta-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Restaurante',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 21,
        title: 'Real Plaza Fest Perú',
        category: 'comercio',
        images: [
            '/images/projects/comercio/fest-1.jpg',
            '/images/projects/comercio/fest-2.jpg',
        ],
        location: 'Real Plaza Arequipa',
        buildingType: 'Retail',
        levels: '1 Nivel',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },
    {
        id: 22,
        title: 'Real Plaza Nebula',
        category: 'comercio',
        images: [
            '/images/projects/comercio/nebula-1.jpg',
            '/images/projects/comercio/nebula-2.jpg',
        ],
        location: 'Real Plaza Arequipa',
        buildingType: 'Retail',
        levels: '1 Nivel',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: '',
    },

    // =========================================
    //         ESTRUCTURAS METÁLICAS
    // =========================================
    {
        id: 23,
        title: 'Clínica A1',
        category: 'estructura',
        images: [
            '/images/projects/estructura/clinica-1.jpg',
            '/images/projects/estructura/clinica-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Infraestructura de Salud',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: 'Estructuras metálicas de soporte y techado.',
    },
    {
        id: 24,
        title: 'Colegio Sagrados Corazones',
        category: 'estructura',
        images: [
            '/images/projects/estructura/sagrados-1.jpg',
            '/images/projects/estructura/sagrados-2.jpg',
        ],
        location: 'Arequipa',
        buildingType: 'Infraestructura Educativa',
        levels: 'Consultar',
        area: 'Consultar',
        status: 'Terminado',
        extraInfo: 'Techado de patio principal / Coliseo.',
    },
];
