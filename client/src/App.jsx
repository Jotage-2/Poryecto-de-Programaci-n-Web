// App.jsx - Configuración principal de rutas de la aplicación
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';

/**
 * Componente raíz de la aplicación
 * Configura proveedores de contexto y sistema de rutas
 */
const App = () => {
  return (
    // ThemeProvider: maneja modo claro/oscuro globalmente
    <ThemeProvider>
      {/* AuthProvider: maneja la sesión del usuario globalmente */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta raíz: redirigir al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* ============================================================
                RUTAS PÚBLICAS (sin autenticación)
                ============================================================ */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* ============================================================
                RUTAS PROTEGIDAS (requieren autenticación)
                ============================================================ */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* Ruta 404: redirigir al login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
