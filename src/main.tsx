import React from 'react';
import { createRoot } from 'react-dom/client';
import { RootApp } from './RootApp';
import './styles.css';
import './animations.css';
import './desk.css';
import './world.css';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
