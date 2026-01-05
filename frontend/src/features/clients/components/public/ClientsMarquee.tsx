import React from 'react';
import { useGetClientsQuery } from '@/features/clients/api/clientsApi';

const ClientsMarquee: React.FC = () => {
    const { data: response, isLoading } = useGetClientsQuery({
        no_page: true,
    });

    const clients = response?.data || [];

    if (isLoading || clients.length === 0) return null;

    const repetitions = clients.length < 5 ? 8 : 4;
    const duplicatedClients = Array(repetitions).fill(clients).flat();

    return (
        <section className="py-20 bg-white border-y border-slate-100 overflow-hidden relative">
            <div className="container mx-auto px-4 mb-12 text-center">
                <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                    Respaldo
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase">
                    Nuestros Clientes
                </h2>
            </div>

            <div className="relative w-full max-w-[1920px] mx-auto">
                <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
                    {duplicatedClients.map((client, index) => (
                        <div
                            key={`${client.id}-${index}`}
                            className="mx-8 md:mx-14 w-32 md:w-48 h-24 flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer"
                        >
                            <img
                                src={client.image}
                                alt={client.name}
                                title={client.name}
                                className="max-w-full max-h-full object-contain select-none filter drop-shadow-sm"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClientsMarquee;
