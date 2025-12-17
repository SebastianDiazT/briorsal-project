export interface Service {
    id: number;
    title: string;
    description: string;
    image: string;
}

export const servicesData: Service[] = [
    {
        id: 1,
        title: 'ARQUITECTURA',
        description:
            'En Briorsal Constructora, ofrecemos servicios de planos y arquitectura. Nuestro equipo de expertos trabaja desde la concepción inicial hasta los detalles finales, nos aseguramos de que cada proyecto refleje las necesidades y visiones únicas de cada cliente.',
        image: 'src/assets/services/Arquitectura.png',
    },
    {
        id: 2,
        title: 'CONSTRUCCIÓN CIVIL',
        description:
            'Con 7 años de experiencia en la industria, nuestra empresa es sinónimo de calidad y confiabilidad en construcción civil. Ya sea un proyecto residencial o comercial, nos comprometemos a entregar resultados impecables en cada etapa del proceso.',
        image: '/src/assets/services/ConstruccionCivil.png',
    },
    {
        id: 3,
        title: 'DISEÑO DE INTERIORES',
        description:
            'Ofrecemos servicios de diseño de interiores que elevan cada espacio a nuevos niveles de elegancia y funcionalidad. Nuestro equipo de diseñadores trabaja en estrecha colaboración con el cliente para crear ambientes que reflejen tu estilo y personalidad.',
        image: 'src/assets/services/Diseno-de-interiores.png',
    },
    {
        id: 4,
        title: 'ESTRUCTURAS METÁLICAS',
        description:
            'Las estructuras metálicas son la columna vertebral de muchos proyectos de construcción, y en nuestra empresa, nos destacamos en este campo. Nuestras estructuras metálicas de alta calidad son duraderas, seguras y eficientes. Ya sea para edificios industriales, comerciales o residenciales.',
        image: 'src/assets/services/estructuras-metalicas.png',
    },
];
