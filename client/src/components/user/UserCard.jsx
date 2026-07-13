import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfilePath } from '../../utils/navigation';
import Avatar from './Avatar';

const UserCard = ({ person, actions, className = '', onPersonClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const openProfile = () => {
    if (onPersonClick) {
      onPersonClick(person);
      return;
    }
    navigate(getProfilePath(person.id, user?.id), { state: { person } });
  };

  return (
    <div className={`flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-300 transition-all duration-200 group ${className}`}>
      <button type="button" onClick={openProfile} className="flex items-center gap-3 min-w-0 text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
        <Avatar person={person} className="group-hover:ring-4 group-hover:ring-primary-100 dark:group-hover:ring-primary-900/30 transition-all" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{person.name} {person.lastName}</p>
          <p className="text-xs text-gray-400 truncate">{person.career}{person.cycle ? ` · ${person.cycle}° ciclo` : ''}</p>
        </div>
      </button>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};

export default UserCard;
