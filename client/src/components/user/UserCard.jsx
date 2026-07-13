import Avatar from './Avatar';

const UserCard = ({ person, actions, className = '' }) => (
  <div className={`flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors ${className}`}>
    <div className="flex items-center gap-3 min-w-0">
      <Avatar person={person} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{person.name} {person.lastName}</p>
        <p className="text-xs text-gray-400 truncate">{person.career}{person.cycle ? ` · ${person.cycle}° ciclo` : ''}</p>
      </div>
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);

export default UserCard;
