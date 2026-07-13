const USERS_KEY = 'ulimasocial_local_users';
const VERIFICATION_KEY = 'ulimasocial_pending_verifications';

const demoUser = {
  id: 'demo-001', name: 'Usuario', lastName: 'Demo', studentCode: '20240001',
  email: 'demo@aloe.ulima.edu.pe', password: '123456', career: 'Ingeniería de Sistemas',
  cycle: '5', entryYear: '2024', profilePicture: '', verified: true,
};


const demoDirectoryUsers = [
  {
    id: 'demo-maria', name: 'María', lastName: 'García', studentCode: '20231024',
    email: 'maria.garcia@aloe.ulima.edu.pe', career: 'Psicología', cycle: '4', entryYear: '2023',
    profilePicture: '', bio: 'Interesada en psicología educativa, bienestar estudiantil y proyectos de investigación.', verified: true,
  },
  {
    id: 'demo-carlos', name: 'Carlos', lastName: 'López', studentCode: '20220518',
    email: 'carlos.lopez@aloe.ulima.edu.pe', career: 'Ingeniería Industrial', cycle: '5', entryYear: '2022',
    profilePicture: '', bio: 'Me interesan la mejora de procesos, analítica y los grupos de estudio.', verified: true,
  },
  {
    id: 'demo-ana', name: 'Ana', lastName: 'Torres', studentCode: '20240137',
    email: 'ana.torres@aloe.ulima.edu.pe', career: 'Derecho', cycle: '3', entryYear: '2024',
    profilePicture: '', bio: 'Estudiante de Derecho con interés en investigación, debate y responsabilidad social.', verified: true,
  },
  {
    id: 'demo-valeria', name: 'Valeria', lastName: 'Ramos', studentCode: '20230209',
    email: 'valeria.ramos@aloe.ulima.edu.pe', career: 'Ingeniería de Sistemas', cycle: '4', entryYear: '2023',
    profilePicture: '', bio: 'Desarrollo frontend, experiencia de usuario y proyectos tecnológicos universitarios.', verified: true,
  },
  {
    id: 'demo-luis', name: 'Luis', lastName: 'Mendoza', studentCode: '20210366',
    email: 'luis.mendoza@aloe.ulima.edu.pe', career: 'Administración', cycle: '6', entryYear: '2021',
    profilePicture: '', bio: 'Emprendimiento, marketing y organización de actividades académicas.', verified: true,
  },
];

const delay = (value, ms = 250) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const publicUser = ({ password, ...user }) => user;

const getUsers = () => {
  const users = read(USERS_KEY, []);
  return users.some((user) => user.id === demoUser.id) ? users : [demoUser, ...users];
};

const getDirectoryUsers = () => {
  const localUsers = getUsers();
  const localIds = new Set(localUsers.map((user) => String(user.id)));
  const localEmails = new Set(localUsers.map((user) => user.email?.toLowerCase()));
  return [
    ...localUsers,
    ...demoDirectoryUsers.filter((user) => !localIds.has(String(user.id)) && !localEmails.has(user.email.toLowerCase())),
  ];
};

export const registerUser = async (userData) => {
  const users = getUsers();
  if (users.some((user) => user.email.toLowerCase() === userData.email.toLowerCase())) throw new Error('El correo ya está registrado.');
  if (users.some((user) => user.studentCode === userData.studentCode)) throw new Error('El código universitario ya está registrado.');
  const user = { ...userData, id: crypto.randomUUID(), entryYear: userData.studentCode.slice(0, 4), verified: false };
  write(USERS_KEY, [...users.filter((item) => item.id !== demoUser.id), user]);
  const pending = read(VERIFICATION_KEY, {});
  pending[user.email.toLowerCase()] = '123456';
  write(VERIFICATION_KEY, pending);
  return delay({ message: 'Registro local creado.', verificationCode: '123456' });
};

export const verifyEmail = async (email, code) => {
  const pending = read(VERIFICATION_KEY, {});
  if (pending[email.toLowerCase()] !== code) throw new Error('Código de verificación incorrecto. Usa 123456 en el modo local.');
  const users = getUsers().map((user) => user.email.toLowerCase() === email.toLowerCase() ? { ...user, verified: true } : user);
  write(USERS_KEY, users.filter((user) => user.id !== demoUser.id));
  delete pending[email.toLowerCase()];
  write(VERIFICATION_KEY, pending);
  return delay({ message: 'Cuenta verificada.' });
};

export const resendVerificationCode = async (email) => {
  const pending = read(VERIFICATION_KEY, {});
  pending[email.toLowerCase()] = '123456';
  write(VERIFICATION_KEY, pending);
  return delay({ message: 'Código local regenerado.', verificationCode: '123456' });
};

export const loginUser = async (identifier, password) => {
  const normalized = identifier.toLowerCase();
  const user = getUsers().find((item) => item.email.toLowerCase() === normalized || item.studentCode === identifier);
  if (!user || user.password !== password) throw new Error('Correo, código o contraseña incorrectos.');
  if (!user.verified) throw new Error('Primero verifica tu cuenta con el código local 123456.');
  return delay({ user: publicUser(user) });
};

export const forgotPassword = async (email) => {
  if (!getUsers().some((user) => user.email.toLowerCase() === email.toLowerCase())) throw new Error('No existe una cuenta con ese correo.');
  const pending = read(VERIFICATION_KEY, {});
  pending[`reset:${email.toLowerCase()}`] = '123456';
  write(VERIFICATION_KEY, pending);
  return delay({ message: 'Código local generado.', resetCode: '123456' });
};

export const resetPassword = async (email, code, newPassword) => {
  const pending = read(VERIFICATION_KEY, {});
  if (pending[`reset:${email.toLowerCase()}`] !== code) throw new Error('Código incorrecto. Usa 123456 en el modo local.');
  const users = getUsers().map((user) => user.email.toLowerCase() === email.toLowerCase() ? { ...user, password: newPassword } : user);
  write(USERS_KEY, users.filter((user) => user.id !== demoUser.id));
  delete pending[`reset:${email.toLowerCase()}`];
  write(VERIFICATION_KEY, pending);
  return delay({ message: 'Contraseña actualizada.' });
};


export const getUserById = async (userId) => {
  const user = getDirectoryUsers().find((item) => String(item.id) === String(userId));
  return delay(user ? publicUser(user) : null, 120);
};

export const updateUserProfile = async (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex((item) => String(item.id) === String(userId));
  if (index === -1) throw new Error('No se encontró el usuario que deseas actualizar.');

  const allowedFields = ['name', 'lastName', 'career', 'cycle', 'entryYear', 'bio', 'profilePicture'];
  const safeUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  );

  const updatedUser = { ...users[index], ...safeUpdates };
  const nextUsers = users.map((item, itemIndex) => itemIndex === index ? updatedUser : item);
  write(USERS_KEY, nextUsers);
  return delay({ user: publicUser(updatedUser) }, 180);
};

export const searchUsers = async (query) => {
  const term = query.trim().toLowerCase();
  const users = getDirectoryUsers().filter((user) => `${user.name} ${user.lastName} ${user.studentCode} ${user.career}`.toLowerCase().includes(term));
  return delay(users.map(publicUser), 120);
};

export const checkHealth = () => delay({ status: 'local-demo' });
