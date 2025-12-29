import React from 'react';
import { Toaster } from 'react-hot-toast';

type AppToastProps = {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

const BASE_BACKGROUND = '#1a1a1a';
const BASE_BORDER = '#333';
const TEXT_COLOR = '#ffffff';

const SUCCESS_COLOR = '#10B981';
const ERROR_COLOR = '#EF4444';

const baseStyle: React.CSSProperties = {
    background: BASE_BACKGROUND,
    color: TEXT_COLOR,
    border: `1px solid ${BASE_BORDER}`,
    padding: '16px',
    fontSize: '14px',
};

export const AppToast = React.memo(
    ({ position = 'bottom-right' }: AppToastProps) => {
        return (
            <Toaster
                position={position}
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 4000,
                    style: baseStyle,
                    ariaProps: {
                        role: 'status',
                        'aria-live': 'polite',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            borderLeft: `4px solid ${SUCCESS_COLOR}`,
                        },
                        iconTheme: {
                            primary: SUCCESS_COLOR,
                            secondary: BASE_BACKGROUND,
                        },
                    },
                    error: {
                        duration: 6000,
                        style: {
                            borderLeft: `4px solid ${ERROR_COLOR}`,
                        },
                        iconTheme: {
                            primary: ERROR_COLOR,
                            secondary: BASE_BACKGROUND,
                        },
                    },
                }}
            />
        );
    }
);

AppToast.displayName = 'AppToast';
