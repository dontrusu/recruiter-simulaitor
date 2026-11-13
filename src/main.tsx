import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import '@fontsource-variable/ibm-plex-sans';
import '@fontsource/ibm-plex-serif/400.css';
import '@fontsource/ibm-plex-serif/400-italic.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/700.css';
import '@/global.css';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
