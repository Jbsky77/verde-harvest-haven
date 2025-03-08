
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { CultivationProvider } from './context/CultivationContext';
import { Toaster } from './components/ui/toaster';
import './i18n/config'; // Import the i18n configuration
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CultivationProvider>
          <App />
          <Toaster />
        </CultivationProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
