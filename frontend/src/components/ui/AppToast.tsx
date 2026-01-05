import React from 'react';
import { Toaster } from 'react-hot-toast';

export const AppToast = React.memo(() => {
    return (
        <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={12}
            toastOptions={{
                duration: 4000,

                className:
                    '!bg-slate-900/95 !backdrop-blur-md !border !border-slate-700/50 !text-white !px-4 !py-3 !rounded-xl !shadow-2xl !text-sm !font-semibold',

                ariaProps: {
                    role: 'status',
                    'aria-live': 'polite',
                },

                success: {
                    duration: 4000,
                    iconTheme: {
                        primary: '#10B981',
                        secondary: '#ffffff',
                    },
                    className:
                        '!bg-slate-900/95 !backdrop-blur-md !border !border-emerald-500/30 !text-white !px-4 !py-3 !rounded-xl !shadow-2xl !text-sm !font-semibold',
                },

                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: '#EF4444',
                        secondary: '#ffffff',
                    },
                    className:
                        '!bg-slate-900/95 !backdrop-blur-md !border !border-red-500/30 !text-white !px-4 !py-3 !rounded-xl !shadow-2xl !text-sm !font-semibold',
                },

                loading: {
                    iconTheme: {
                        primary: '#F97316',
                        secondary: 'transparent',
                    },
                    className:
                        '!bg-slate-900/95 !backdrop-blur-md !border !border-orange-500/30 !text-white !px-4 !py-3 !rounded-xl !shadow-2xl !text-sm !font-semibold',
                },
            }}
        />
    );
});

AppToast.displayName = 'AppToast';
