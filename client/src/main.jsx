// main.jsx - Punto de entrada de React
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';

// Montar la aplicación React en el div#root del index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
