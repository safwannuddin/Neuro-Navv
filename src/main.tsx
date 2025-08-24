import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ToastProvider } from './components/ui/toast';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './contexts/theme-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <App />
          <Toaster />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
    ## hello 
  </StrictMode>
);