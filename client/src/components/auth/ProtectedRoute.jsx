// components/auth/ProtectedRoute.jsx - Componente para rutas protegidas
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Envuelve rutas que requieren autenticación
 * Si el usuario no está autenticado, lo redirige al login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se verifica la sesión guardada, mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-md">
            U
          </div>
          <div className="flex items-center gap-2 justify-center">
            <span className="spinner border-primary-400 border-t-primary-600" />
            <span className="text-sm text-gray-400 dark:text-gray-500">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
