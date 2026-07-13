import { useState } from 'react';

const emojis = ['📚','💻','🎨','📐','⚡','🗄️','📱','🏫','🔬','📊'];
const CreateGroupModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState(''); const [career, setCareer] = useState(''); const [emoji, setEmoji] = useState('📚');
  const submit = () => { if (!name.trim() || !career.trim()) return; onCreate({ nombre: name.trim(), carrera: career.trim(), emoji }); onClose(); };
  return <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white dark:bg-dark-200 rounded-2xl p-6 w-full max-w-md shadow-xl">
    <h2 className="text-lg font-bold text-primary-600 mb-4">Crear nuevo grupo</h2><div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">Ícono del grupo</label><div className="flex gap-2 flex-wrap">{emojis.map(item => <button key={item} type="button" onClick={() => setEmoji(item)} className={`text-2xl p-2 rounded-xl ${emoji === item ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500' : 'hover:bg-gray-100 dark:hover:bg-dark-300'}`}>{item}</button>)}</div></div>
      <div><label className="block text-sm font-medium mb-1">Nombre del grupo</label><input className="input-base w-full" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Programación Web" /></div>
      <div><label className="block text-sm font-medium mb-1">Carrera</label><input className="input-base w-full" value={career} onChange={e => setCareer(e.target.value)} placeholder="Ej: Ingeniería de Sistemas" /></div>
    </div><div className="flex gap-3 mt-6"><button onClick={onClose} className="flex-1 py-2 rounded-xl border text-sm font-medium">Cancelar</button><button onClick={submit} disabled={!name.trim() || !career.trim()} className="flex-1 py-2 rounded-xl bg-primary-500 disabled:opacity-50 text-white text-sm font-medium">Crear grupo</button></div>
  </div></div>;
};
export default CreateGroupModal;
