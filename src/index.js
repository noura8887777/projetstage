import React from 'react';
import ReactDOM from 'react-dom/client';
import router from './router';
import {RouterProvider } from 'react-router-dom';
import { AuthProvider } from "./Authentification/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);