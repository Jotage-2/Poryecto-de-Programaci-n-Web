const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const confirmClass = tone === 'danger'
    ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
    : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-300';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm card p-5 shadow-2xl animate-pop-in">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl mb-4 ${tone === 'danger' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-primary-50 dark:bg-primary-900/20'}`}>
          {tone === 'danger' ? '⚠' : '✓'}
        </div>
        <h2 className="text-lg font-black text-gray-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all focus:outline-none focus:ring-4 ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
