import { getInitials } from '../../utils/validators';

const sizes = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

const AvatarContent = ({ person, alt }) => person?.profilePicture ? (
  <img src={person.profilePicture} alt={alt} className="w-full h-full object-cover" />
) : (
  getInitials(person?.name, person?.lastName)
);

const Avatar = ({ person, size = 'md', alt = 'Foto de perfil', className = '', onClick, title }) => {
  const baseClass = `${sizes[size]} rounded-full bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} title={title || `Ver perfil de ${person?.name || 'usuario'}`} className={`${baseClass} avatar-interactive focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300`}>
        <AvatarContent person={person} alt={alt} />
      </button>
    );
  }

  return <div className={baseClass}><AvatarContent person={person} alt={alt} /></div>;
};

export default Avatar;
