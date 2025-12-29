import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchClients } from '@store/slices/companySlice';

const ClientsMarquee: React.FC = () => {
    const dispatch = useAppDispatch();
    const { clients, loading } = useAppSelector((state) => state.company);

    useEffect(() => {
        if (clients.length === 0) {
            dispatch(fetchClients());
        }
    }, [dispatch, clients.length]);

    if (loading && clients.length === 0) return null;
    if (clients.length === 0) return null;

    const repetitions = clients.length < 6 ? 8 : 4;
    const marqueeList = Array(repetitions).fill(clients).flat();

    return (
        <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800">
                    Nuestros clientes
                </h2>
            </div>

            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

                <div className="flex w-max animate-infinite-scroll hover:pause items-center">
                    {marqueeList.map((client, index) => (
                        <div
                            key={`${client.id}-${index}`}
                            className="mx-4 md:mx-8 w-64 md:w-96 h-32 md:h-48 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                        >
                            <img
                                src={client.image}
                                alt={client.name}
                                title={client.name}
                                className="max-w-full max-h-full object-contain filter drop-shadow-sm hover:drop-shadow-xl transition-all"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes infinite-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-infinite-scroll {
                    animation: infinite-scroll 60s linear infinite;
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default ClientsMarquee;
