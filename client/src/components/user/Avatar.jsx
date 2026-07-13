import { getInitials } from '../../utils/validators';

const sizes = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

const Avatar = ({ person, size = 'md', alt = 'Foto de perfil', className = '' }) => (
  <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden ${className}`}>
    {person?.profilePicture ? (
      <img src={person.profilePicture} alt={alt} className="w-full h-full object-cover" />
    ) : (
      getInitials(person?.name, person?.lastName)
    )}
  </div>
);

export default Avatar;
