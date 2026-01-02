import React from 'react';
import { Toaster } from 'react-hot-toast';

const COLORS = {
    background: '#1E1810',
    border: '#46403E',
    text: '#FFFFFF',
    textMuted: '#B6B1AD',
    success: '#12B76A',
    error: '#F04438',
    loading: '#FF7A3D',
};

const baseStyle: React.CSSProperties = {
    background: 'rgba(30, 24, 16, 0.95)',
    backdropFilter: 'blur(8px)',
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '8px',
    boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    fontFamily: 'inherit',
};

export const AppToast = React.memo(() => {
    return (
        <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={12}
            toastOptions={{
                duration: 4000,
                style: baseStyle,

                ariaProps: {
                    role: 'status',
                    'aria-live': 'polite',
                },

                success: {
                    duration: 4000,
                    style: {
                        ...baseStyle,
                        borderLeft: `4px solid ${COLORS.success}`,
                    },
                    iconTheme: {
                        primary: COLORS.success,
                        secondary: COLORS.background,
                    },
                },

                error: {
                    duration: 5000,
                    style: {
                        ...baseStyle,
                        borderLeft: `4px solid ${COLORS.error}`,
                    },
                    iconTheme: {
                        primary: COLORS.error,
                        secondary: COLORS.background,
                    },
                },

                loading: {
                    style: {
                        ...baseStyle,
                        borderLeft: `4px solid ${COLORS.loading}`,
                    },
                    iconTheme: {
                        primary: COLORS.loading,
                        secondary: COLORS.background,
                    },
                },
            }}
        />
    );
});

AppToast.displayName = 'AppToast';
