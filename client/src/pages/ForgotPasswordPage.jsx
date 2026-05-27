// pages/ForgotPasswordPage.jsx - Flujo completo de recuperación de contraseña
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { InputField, PasswordInput, LoadingButton, Alert } from '../components/common/UIComponents';
import { forgotPassword, resetPassword } from '../services/api';
import { isValidUlimaEmail, isValidPassword } from '../utils/validators';

/**
 * Flujo de recuperación en 3 pasos:
 * 1. Ingresar correo
 * 2. Verificar código recibido
 * 3. Ingresar nueva contraseña
 */
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Paso actual del flujo
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});

  // ============================================================
  // PASO 1: Enviar correo de recuperación
  // ============================================================
  const handleSendCode = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: 'Ingresa tu correo institucional' });
      return;
    }
    if (!isValidUlimaEmail(email)) {
      setErrors({ email: 'El correo debe ser @aloe.ulima.edu.pe' });
      return;
    }

    setLoading(true);
    setAlert(null);
    try {
      await forgotPassword(email);
      setAlert({ type: 'success', message: 'Se envió el código de recuperación a tu correo.' });
      setTimeout(() => { setAlert(null); setStep(2); }, 1500);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PASO 2: Verificar código (avanzar al paso 3)
  // ============================================================
  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setErrors({ code: 'Ingresa el código de 6 dígitos' });
      return;
    }
    setErrors({});
    setStep(3);
  };

  // ============================================================
  // PASO 3: Restablecer contraseña
  // ============================================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!isValidPassword(newPassword)) {
      setErrors({ newPassword: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    setAlert(null);
    try {
      await resetPassword(email, code, newPassword);
      setAlert({ type: 'success', message: '¡Contraseña actualizada! Redirigiendo al inicio de sesión...' });
      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
      if (error.message.includes('Código')) {
        setStep(2); // Volver al paso 2 si el código es incorrecto
      }
    } finally {
      setLoading(false);
    }
  };

  // Indicadores de progreso
  const steps = ['Correo', 'Código', 'Contraseña'];

  return (
    <AuthLayout
      title={
        step === 1 ? '¿Olvidaste tu contraseña? 🔐' :
        step === 2 ? 'Verifica el código 📬' :
        'Nueva contraseña 🔑'
      }
      subtitle={
        step === 1 ? 'Ingresa tu correo institucional para recuperar el acceso' :
        step === 2 ? `Ingresa el código de 6 dígitos enviado a ${email}` :
        'Crea una nueva contraseña segura'
      }
    >
      {/* Indicador de pasos */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
              i + 1 < step ? 'bg-green-500 text-white' :
              i + 1 === step ? 'bg-primary-600 text-white shadow-md' :
              'bg-gray-200 dark:bg-dark-400 text-gray-500'
            }`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${
              i + 1 === step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
            }`}>{label}</span>
            {i < 2 && <div className={`w-6 h-px ${i + 1 < step ? 'bg-green-400' : 'bg-gray-200 dark:bg-dark-400'}`} />}
          </div>
        ))}
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* PASO 1: Ingreso de correo */}
      {step === 1 && (
        <form onSubmit={handleSendCode} className="space-y-4 mt-4">
          <InputField
            label="Correo institucional"
            name="email"
            type="email"
            placeholder="usuario@aloe.ulima.edu.pe"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <LoadingButton loading={loading} type="submit">
            Enviar código de recuperación
          </LoadingButton>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              ← Volver al inicio de sesión
            </Link>
          </p>
        </form>
      )}

      {/* PASO 2: Verificar código */}
      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="space-y-4 mt-4">
          <InputField
            label="Código de recuperación"
            name="code"
            type="text"
            inputMode="numeric"
            placeholder="Ej: 123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            error={errors.code}
            maxLength={6}
          />
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              💡 En modo desarrollo, el código aparece en la consola del servidor.
            </p>
          </div>
          <LoadingButton loading={false} type="submit">
            Verificar código
          </LoadingButton>
          <div className="flex gap-4 justify-center text-sm">
            <button type="button" onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ← Cambiar correo
            </button>
          </div>
        </form>
      )}

      {/* PASO 3: Nueva contraseña */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
          <PasswordInput
            label="Nueva contraseña"
            name="newPassword"
            placeholder="Mínimo 6 caracteres"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
          />
          <PasswordInput
            label="Confirmar contraseña"
            name="confirmPassword"
            placeholder="Repite tu nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
          <LoadingButton loading={loading} type="submit">
            Actualizar contraseña
          </LoadingButton>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
