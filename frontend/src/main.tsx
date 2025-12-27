import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';

import App from './App.tsx';

import './index.css';

import { AppWrapper } from '@components/common/PageMeta.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <AppWrapper>
                <App />
            </AppWrapper>
        </Provider>
    </StrictMode>
);
