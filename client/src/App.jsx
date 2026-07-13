// App.jsx - Configuración principal de rutas de la aplicación
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FriendsProvider } from './context/FriendsContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FriendsPage from './pages/FriendsPage';


// Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import GruposPage from './pages/GruposPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import MensajesPage from './pages/MensajesPage';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* FriendsProvider va DENTRO de AuthProvider porque necesita al usuario */}
        <FriendsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Rutas públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Rutas protegidas */}
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/perfil/:userId" element={<ProtectedRoute><PublicProfilePage /></ProtectedRoute>} />
              <Route path="/grupos" element={<ProtectedRoute><GruposPage /></ProtectedRoute>} />
              <Route path="/amigos" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
              <Route path="/mensajes" element={<ProtectedRoute><MensajesPage /></ProtectedRoute>} />


              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </FriendsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;