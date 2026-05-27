// pages/VerifyEmailPage.jsx - Página de verificación de correo institucional
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { LoadingButton, Alert } from '../components/common/UIComponents';
import { verifyEmail, resendVerificationCode } from '../services/api';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener email desde el estado de navegación o formulario local
  const [email, setEmail] = useState(location.state?.email || '');
  const [emailInput, setEmailInput] = useState(email);
  const [showEmailInput, setShowEmailInput] = useState(!email);

  // Estado del código de verificación (6 dígitos individuales)
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Temporizador de enfriamiento para reenvío
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Manejar entrada de código (navegación automática entre inputs)
  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Solo números

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Solo último dígito
    setCode(newCode);

    // Avanzar al siguiente input automáticamente
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Manejar retroceso entre inputs
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Pegar código completo
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // Verificar código
  const handleVerify = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length < 6) {
      setAlert({ type: 'warning', message: 'Ingresa el código completo de 6 dígitos' });
      return;
    }

    if (!email && !emailInput) {
      setAlert({ type: 'error', message: 'Ingresa tu correo institucional' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      await verifyEmail(email || emailInput, fullCode);
      setAlert({ type: 'success', message: '¡Cuenta verificada! Redirigiendo al inicio de sesión...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
      // Limpiar código en error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código
  const handleResend = async () => {
    const targetEmail = email || emailInput;
    if (!targetEmail) {
      setAlert({ type: 'error', message: 'Ingresa tu correo para reenviar el código' });
      return;
    }

    setResendLoading(true);
    setAlert(null);

    try {
      await resendVerificationCode(targetEmail);
      setAlert({ type: 'success', message: 'Código reenviado exitosamente. Revisa tu correo.' });
      setResendCooldown(60); // 60 segundos de espera
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verifica tu correo 📬"
      subtitle={`Te enviamos un código de 6 dígitos a ${email || 'tu correo institucional'}`}
    >
      <form onSubmit={handleVerify} className="space-y-5">
        {alert && (
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        )}

        {/* Input de email si no vino de registro */}
        {showEmailInput && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo institucional
            </label>
            <input
              type="email"
              className="input-base"
              placeholder="usuario@aloe.ulima.edu.pe"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>
        )}

        {/* Inputs del código de 6 dígitos */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Código de verificación
          </label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2
                  ${digit
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-dark-400 bg-white dark:bg-dark-200 text-gray-900 dark:text-gray-100'
                  }
                  focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30
                  transition-all duration-150`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Puedes pegar el código directamente
          </p>
        </div>

        {/* Botón de verificar */}
        <LoadingButton loading={loading} type="submit">
          Verificar cuenta
        </LoadingButton>

        {/* Reenviar código */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿No recibiste el código?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resendLoading}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
          >
            {resendLoading
              ? 'Enviando...'
              : resendCooldown > 0
              ? `Reenviar en ${resendCooldown}s`
              : 'Reenviar código'}
          </button>
        </div>

        {/* Nota sobre modo desarrollo */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <strong>💡 Modo desarrollo:</strong> Si no tienes Nodemailer configurado, el código aparece en la consola del servidor.
          </p>
        </div>

        {/* Volver al login */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
            ← Volver al inicio de sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
