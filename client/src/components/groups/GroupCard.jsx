const GroupCard = ({ group, onToggle }) => (
  <article className="bg-white dark:bg-dark-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-24 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center"><span className="text-5xl">{group.emoji}</span></div>
    <div className="p-4"><h3 className="font-bold text-gray-800 dark:text-white text-sm">{group.nombre}</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{group.carrera}</p><p className="text-xs text-gray-400 mt-1">👥 {group.miembros} miembros</p>
      <button onClick={() => onToggle(group.id)} className={`w-full mt-3 py-2 rounded-xl text-sm font-semibold transition-colors ${group.unido ? 'bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500' : 'bg-primary-500 hover:bg-primary-600 text-white'}`}>{group.unido ? 'Salir' : 'Unirse'}</button>
    </div>
  </article>
);
export default GroupCard;
