import { useGetProjectsQuery } from '@/features/projects/api/projectsApi';
import { useGetClientsQuery } from '@/features/clients/api/clientsApi';

const FOUNDING_YEAR = 2017;

const StatItem = ({ number, label, suffix = '' }: any) => (
    <div className="text-center group">
        <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 group-hover:to-orange-400 transition-all">
            {number}
            {suffix}
        </div>
        <div className="text-xs font-bold text-orange-500 uppercase tracking-widest">
            {label}
        </div>
    </div>
);

export const HomeStats = () => {
    const { data: projectsData } = useGetProjectsQuery({ pageSize: 1 });
    const { data: clientsData } = useGetClientsQuery({ pageSize: 1 });

    const totalProjects = projectsData?.meta?.total_records || 0;
    const totalClients = clientsData?.meta?.total_records || 0;
    const experienceYears = new Date().getFullYear() - FOUNDING_YEAR;

    return (
        <div className="bg-slate-950 border-y border-white/5 py-16 relative z-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    <StatItem
                        number={experienceYears}
                        suffix="+"
                        label="Años de Experiencia"
                    />
                    <StatItem
                        number={totalProjects}
                        suffix="+"
                        label="Proyectos Ejecutados"
                    />
                    <StatItem
                        number={totalClients}
                        suffix="+"
                        label="Aliados Estratégicos"
                    />
                    <StatItem
                        number={100}
                        suffix="%"
                        label="Compromiso y Calidad"
                    />
                </div>
            </div>
        </div>
    );
};
