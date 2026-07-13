import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import CreateGroupModal from '../components/groups/CreateGroupModal';
import GroupCard from '../components/groups/GroupCard';
import EmptyState from '../components/feedback/EmptyState';

const defaultGroups = [
  { id: 1, nombre: 'Programación Web', carrera: 'Ingeniería de Sistemas', miembros: 24, unido: false, emoji: '💻' },
  { id: 2, nombre: 'Cálculo II', carrera: 'Ingeniería Industrial', miembros: 18, unido: false, emoji: '📐' },
  { id: 3, nombre: 'Diseño UX/UI', carrera: 'Comunicaciones', miembros: 12, unido: false, emoji: '🎨' },
  { id: 4, nombre: 'Base de Datos', carrera: 'Ingeniería de Sistemas', miembros: 30, unido: false, emoji: '🗄️' },
  { id: 5, nombre: 'Marketing Digital', carrera: 'Administración', miembros: 20, unido: false, emoji: '📱' },
  { id: 6, nombre: 'Física III', carrera: 'Ingeniería Civil', miembros: 15, unido: false, emoji: '⚡' },
];

const STORAGE_KEY = 'ulimasocial_groups';

const GruposPage = () => {
  const [groups, setGroups] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultGroups; }
    catch { return defaultGroups; }
  });
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const updateGroups = (nextGroups) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextGroups));
    setGroups(nextGroups);
  };

  const toggleMembership = (id) => updateGroups(groups.map(group => group.id === id
    ? { ...group, unido: !group.unido, miembros: group.unido ? group.miembros - 1 : group.miembros + 1 }
    : group));

  const createGroup = (data) => updateGroups([{ id: crypto.randomUUID(), ...data, miembros: 1, unido: true }, ...groups]);

  const visibleGroups = groups
    .filter(group => filter === 'mine' ? group.unido : true)
    .filter(group => group.nombre.toLowerCase().includes(search.toLowerCase()));

  return <div className="min-h-screen bg-gray-100 dark:bg-dark-100"><Navbar />
    {isModalOpen && <CreateGroupModal onClose={() => setIsModalOpen(false)} onCreate={createGroup} />}
    <main className="max-w-5xl mx-auto px-4 pt-20 pb-24 md:pb-8 page-enter">
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-gray-800 dark:text-white">Grupos</h1><p className="text-sm text-gray-500">Únete a grupos de estudio de tu carrera</p></div><button onClick={() => setIsModalOpen(true)} className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-md shadow-primary-600/20">+ Crear grupo</button></div>
      <div className="flex gap-3 mb-6"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar grupos..." className="input-base flex-1" />
        {[['all','Todos'],['mine','Mis grupos']].map(([id,label]) => <button key={id} onClick={() => setFilter(id)} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === id ? 'bg-primary-500 text-white' : 'bg-white dark:bg-dark-200 text-gray-600 dark:text-gray-300'}`}>{label}</button>)}
      </div>
      {visibleGroups.length ? <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{visibleGroups.map(group => <GroupCard key={group.id} group={group} onToggle={toggleMembership} />)}</div> : <EmptyState icon="😕" title="No se encontraron grupos" description="Prueba con otro término o crea un grupo nuevo." />}
    </main>
  </div>;
};
export default GruposPage;
