import { useRef, useState } from 'react';
import Avatar from '../user/Avatar';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ProfileEditorModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    career: user?.career || '',
    cycle: user?.cycle || '',
    entryYear: user?.entryYear || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen válido.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('La imagen debe pesar como máximo 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField('profilePicture', String(reader.result || ''));
      setError('');
    };
    reader.onerror = () => setError('No se pudo leer la imagen seleccionada.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.lastName.trim() || !form.career.trim()) {
      setError('Nombre, apellido y carrera son obligatorios.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        career: form.career.trim(),
        bio: form.bio.trim(),
      });
      onClose();
    } catch (saveError) {
      setError(saveError.message || 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="w-full max-w-xl max-h-[90vh] overflow-y-auto card p-5 sm:p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Editar perfil</h2>
            <p className="text-xs text-gray-400 mt-0.5">Estos campos podrán conectarse luego al backend.</p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-400 transition-colors">✕</button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/20 dark:to-dark-300 border border-primary-100 dark:border-primary-900/30 mb-5">
          <Avatar person={{ ...user, ...form }} size="xl" className="ring-4 ring-white dark:ring-dark-200 shadow-lg" />
          <div className="text-center sm:text-left">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-sm">
              Cambiar foto
            </button>
            {form.profilePicture && (
              <button type="button" onClick={() => updateField('profilePicture', '')} className="ml-2 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors">
                Quitar
              </button>
            )}
            <p className="text-xs text-gray-400 mt-2">JPG, PNG o WebP · máximo 2 MB</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Nombre
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} maxLength={50} className="input-base mt-1.5 py-2.5 text-sm" />
          </label>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Apellido
            <input value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} maxLength={60} className="input-base mt-1.5 py-2.5 text-sm" />
          </label>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 sm:col-span-2">Carrera
            <input value={form.career} onChange={(e) => updateField('career', e.target.value)} maxLength={100} className="input-base mt-1.5 py-2.5 text-sm" />
          </label>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Ciclo
            <input type="number" min="1" max="12" value={form.cycle} onChange={(e) => updateField('cycle', e.target.value)} className="input-base mt-1.5 py-2.5 text-sm" />
          </label>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Año de ingreso
            <input type="number" min="1990" max="2100" value={form.entryYear} onChange={(e) => updateField('entryYear', e.target.value)} className="input-base mt-1.5 py-2.5 text-sm" />
          </label>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 sm:col-span-2">Presentación
            <textarea value={form.bio} onChange={(e) => updateField('bio', e.target.value)} maxLength={180} rows={3} placeholder="Cuéntales algo académico o profesional a tus compañeros..." className="input-base mt-1.5 py-2.5 text-sm resize-none" />
            <span className="block mt-1 text-right text-[11px] text-gray-400">{form.bio.length}/180</span>
          </label>
        </div>

        {error && <p className="mt-4 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors">Cancelar</button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 transition-all shadow-md hover:-translate-y-0.5">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditorModal;
