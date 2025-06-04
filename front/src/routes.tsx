// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

import Login from './components/Login/Login';
import FuncionarioList from './components/funcionario/FuncionarioList';
import CreateFuncionario from './components/funcionario/FuncionarioCreate';
import UpdateFuncionario from './components/funcionario/FuncionarioUpdate';
import ListPonto from './components/ponto/PontoList';
import CreatePonto from './components/ponto/PontoCreate';
import UpdatePonto from './components/ponto/PontoUpdate';
import PontoFuncionarioCreate from './components/ponto/PontoFuncionarioCreate';
import PontoFuncionarioList from './components/ponto/PontoFuncionarioList';

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { authenticated } = useAuth();
  return authenticated ? <>{children}</> : <Navigate to="/user" />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    {/* rota de login */}
    <Route path="/user" element={<Login />} />

    {/* ao acessar "/", redireciona para /funcionario */}
    <Route path="/" element={<Navigate to="/funcionario" replace />} />

    {/* Rotas de funcionário (protegidas) */}
    <Route
      path="/funcionario"
      element={
        <PrivateRoute>
          <FuncionarioList />
        </PrivateRoute>
      }
    />
    <Route
      path="/funcionario/create"
      element={
        <PrivateRoute>
          <CreateFuncionario />
        </PrivateRoute>
      }
    />
    <Route
      path="/funcionario/update/:id"
      element={
        <PrivateRoute>
          <UpdateFuncionario />
        </PrivateRoute>
      }
    />

    {/* Rotas de ponto (protegidas) */}
    <Route
      path="/ponto"
      element={
        <PrivateRoute>
          <ListPonto />
        </PrivateRoute>
      }
    />
    <Route
      path="/ponto/update/:id"
      element={
        <PrivateRoute>
          <UpdatePonto />
        </PrivateRoute>
      }
    />
    <Route
      path="/ponto/create/funcionario/:id"
      element={
        <PrivateRoute>
          <PontoFuncionarioCreate />
        </PrivateRoute>
      }
    />
    <Route
      path="/ponto/funcionario/:id"
      element={
        <PrivateRoute>
          <PontoFuncionarioList />
        </PrivateRoute>
      }
    />

    {/* fallback: qualquer outra rota redireciona para /funcionario */}
    <Route path="*" element={<Navigate to="/funcionario" replace />} />
  </Routes>
);

export default AppRoutes;
