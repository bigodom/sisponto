// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar/Navbar';
import { ThemeProvider } from './components/menu/ThemeProvider';
import AppRoutes from './routes';
import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Navbar />
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);