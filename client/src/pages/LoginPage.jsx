// pages/LoginPage.jsx - Página de inicio de sesión
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { InputField, PasswordInput, LoadingButton, Alert, Divider } from '../components/common/UIComponents';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Manejador de cambio de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validación del formulario
  const validate = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = 'Ingresa tu correo o código universitario';
    if (!formData.password) newErrors.password = 'Ingresa tu contraseña';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setAlert(null);

    try {
      const response = await loginUser(formData.identifier.trim(), formData.password);
      // Guardar sesión del usuario
      login(response.user);
      // Redirigir al home
      navigate('/home');
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta 👋"
      subtitle="Inicia sesión con tu correo institucional o código universitario"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Alerta de error */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Campo identificador */}
        <InputField
          label="Correo institucional o código universitario"
          name="identifier"
          type="text"
          placeholder="usuario@aloe.ulima.edu.pe o 20240001"
          value={formData.identifier}
          onChange={handleChange}
          error={errors.identifier}
          autoComplete="username"
        />

        {/* Campo contraseña */}
        <PasswordInput
          label="Contraseña"
          name="password"
          placeholder="Ingresa tu contraseña"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        {/* Enlace de recuperar contraseña */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón de inicio de sesión */}
        <LoadingButton loading={loading} type="submit">
          Iniciar sesión
        </LoadingButton>

        <Divider text="o" />

        {/* Enlace de registro */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link
            to="/register"
            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>

        {/* Datos de demo para facilitar pruebas */}
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
          <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-1">
            🎯 Cuenta demo para pruebas
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-500">
            📧 demo@aloe.ulima.edu.pe<br />
            🔐 123456
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
