// pages/RegisterPage.jsx - Página de registro de nuevos usuarios
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { InputField, PasswordInput, SelectField, LoadingButton, Alert } from '../components/common/UIComponents';
import { registerUser } from '../services/api';
import { isValidUlimaEmail, isValidStudentCode, isValidPassword, CAREERS, CYCLES } from '../utils/validators';

const RegisterPage = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    studentCode: '',
    email: '',
    password: '',
    confirmPassword: '',
    career: '',
    cycle: '',
    profilePicture: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  // Estado para preview de foto de perfil
  const [photoPreview, setPhotoPreview] = useState(null);

  // Manejador de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Simular carga de foto de perfil (convierte a base64)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profilePicture: 'La imagen no puede superar 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Validación completa del formulario
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';

    if (!formData.studentCode) {
      newErrors.studentCode = 'El código universitario es obligatorio';
    } else if (!isValidStudentCode(formData.studentCode)) {
      newErrors.studentCode = 'El código debe tener exactamente 8 dígitos numéricos';
    }

    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!isValidUlimaEmail(formData.email)) {
      newErrors.email = 'El correo debe ser @aloe.ulima.edu.pe';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.career) newErrors.career = 'Selecciona tu carrera';
    if (!formData.cycle) newErrors.cycle = 'Selecciona tu ciclo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setAlert(null);

    try {
      const { confirmPassword, ...userData } = formData;
      await registerUser(userData);

      // Redirigir a verificación de correo
      navigate('/verify-email', {
        state: { email: formData.email, fromRegister: true },
      });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta 🎓"
      subtitle="Únete a la comunidad exclusiva de estudiantes de la Universidad de Lima"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Alerta */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Foto de perfil */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-md"
            onClick={() => document.getElementById('photo-input').click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">📷</span>
            )}
          </div>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <button
            type="button"
            onClick={() => document.getElementById('photo-input').click()}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            {photoPreview ? 'Cambiar foto' : 'Agregar foto de perfil (opcional)'}
          </button>
          {errors.profilePicture && (
            <p className="text-xs text-red-500">{errors.profilePicture}</p>
          )}
        </div>

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Nombre"
            name="name"
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="Apellido"
            name="lastName"
            type="text"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        {/* Código universitario */}
        <InputField
          label="Código universitario"
          name="studentCode"
          type="text"
          placeholder="Ej: 20240001 (8 dígitos)"
          value={formData.studentCode}
          onChange={handleChange}
          error={errors.studentCode}
          maxLength={8}
        />

        {/* Correo institucional */}
        <InputField
          label="Correo institucional"
          name="email"
          type="email"
          placeholder="usuario@aloe.ulima.edu.pe"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        {/* Contraseña */}
        <PasswordInput
          label="Contraseña"
          name="password"
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {/* Confirmar contraseña */}
        <PasswordInput
          label="Confirmar contraseña"
          name="confirmPassword"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        {/* Carrera y Ciclo */}
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Carrera"
            name="career"
            value={formData.career}
            onChange={handleChange}
            error={errors.career}
            options={CAREERS}
            placeholder="Selecciona"
          />
          <SelectField
            label="Ciclo"
            name="cycle"
            value={formData.cycle}
            onChange={handleChange}
            error={errors.cycle}
            options={CYCLES.map((c) => ({ value: c, label: `${c}° ciclo` }))}
            placeholder="Ciclo"
          />
        </div>

        {/* Botón de registro */}
        <LoadingButton loading={loading} type="submit" className="mt-2">
          Crear cuenta
        </LoadingButton>

        {/* Enlace a login */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
