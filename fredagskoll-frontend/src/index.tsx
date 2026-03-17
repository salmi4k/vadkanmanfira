import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { getActiveContentPack } from './contentPack';
import { resolveInitialDateFromUrl } from './features/shareability/shareability';
import { registerServiceWorker } from './registerServiceWorker';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const initialDate =
  typeof window === 'undefined'
    ? undefined
    : resolveInitialDateFromUrl(
        window.location.search,
        getActiveContentPack(),
        new Date(),
        window.location.pathname
      ) ?? undefined;

registerServiceWorker();

root.render(
  <React.StrictMode>
    <App initialDate={initialDate} />
  </React.StrictMode>
);
