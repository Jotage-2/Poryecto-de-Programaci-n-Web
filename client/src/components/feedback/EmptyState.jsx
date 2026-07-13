const EmptyState = ({ icon, title, description, actionLabel, onAction, className = '' }) => (
  <div className={`card p-10 text-center ${className}`}>
    <div className="text-5xl mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto">{description}</p>}
    {actionLabel && onAction && (
      <button onClick={onAction} className="mt-4 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
