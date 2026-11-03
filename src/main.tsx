import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './v2/ui/shell/App';
import './styles.css';
import './animations.css';
import './desk.css';
import './world.css';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
