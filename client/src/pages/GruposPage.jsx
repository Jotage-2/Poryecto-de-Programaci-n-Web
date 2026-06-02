import { useState } from 'react';
import Navbar from '../components/common/Navbar';

// ============================================================
// Son datos de ejemplo, proximamente en el servidor
// ============================================================
const gruposEjemplo = [
  { id: 1, nombre: 'Programación Web', carrera: 'Ingeniería de Sistemas', miembros: 24, unido: false, emoji: '💻' },
  { id: 2, nombre: 'Cálculo II', carrera: 'Ingeniería Industrial', miembros: 18, unido: false, emoji: '📐' },
  { id: 3, nombre: 'Diseño UX/UI', carrera: 'Comunicaciones', miembros: 12, unido: false, emoji: '🎨' },
  { id: 4, nombre: 'Base de Datos', carrera: 'Ingeniería de Sistemas', miembros: 30, unido: false, emoji: '🗄️' },
  { id: 5, nombre: 'Marketing Digital', carrera: 'Administración', miembros: 20, unido: false, emoji: '📱' },
  { id: 6, nombre: 'Física III', carrera: 'Ingeniería Civil', miembros: 15, unido: false, emoji: '⚡' },
];

// ============================================================
// MODAL PARA CREAR GRUPO
// ============================================================
const CrearGrupoModal = ({ onClose, onCreate }) => {
  //guarda
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [emoji, setEmoji] = useState('📚');//por default son libros

  const handleCrear = () => {
    if (!nombre || !carrera) return;
    onCreate({ nombre, carrera, emoji });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold text-orange-500 mb-4">
          Crear nuevo grupo
        </h2>

        <div className="space-y-4">
          {/* Emoji */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ícono del grupo
            </label>
            <div className="flex gap-2 flex-wrap">
              {['📚', '💻', '🎨', '📐', '⚡', '🗄️', '📱', '🏫', '🔬', '📊'].map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-xl transition-colors ${
                    emoji === e
                      ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-300'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre del grupo
            </label>
            <input
              type="text"
              placeholder="Ej: Programación Web"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="input-base w-full"
            />
          </div>

          {/* Carrera */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Carrera
            </label>
            <input
              type="text"
              placeholder="Ej: Ingeniería de Sistemas"
              value={carrera}
              onChange={e => setCarrera(e.target.value)}
              className="input-base w-full"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-dark-400 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleCrear}
            disabled={!nombre || !carrera}
            className="flex-1 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors text-sm font-medium"
          >
            Crear grupo
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TARJETA DE GRUPO
// ============================================================
const GrupoCard = ({ grupo, onToggle }) => (
  <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    {/* Banner del grupo */}
    <div className="h-24 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
      <span className="text-5xl">{grupo.emoji}</span>
    </div>

    {/* Info */}
    <div className="p-4">
      <h3 className="font-bold text-gray-800 dark:text-white text-sm">
        {grupo.nombre}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {grupo.carrera}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        👥 {grupo.miembros} miembros
      </p>

      <button
        onClick={() => onToggle(grupo.id)}
        className={`w-full mt-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
          grupo.unido
            ? 'bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'
            : 'bg-primary-500 hover:bg-primary-600 text-white'
        }`}
      >
        {grupo.unido ? 'Salir' : 'Unirse'}
      </button>
    </div>
  </div>
);

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================
const GruposPage = () => {
  const [grupos, setGrupos] = useState(gruposEjemplo);//almacenar la lista de grupos
  const [busqueda, setBusqueda] = useState('');//guardar el texto del usuario 
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'misGrupos'

  const toggleUnirse = (id) => { 
    //IA ayuda, Unirse o salir del grupo
    setGrupos(grupos.map(g =>
      g.id === id ? { ...g, unido: !g.unido, miembros: g.unido ? g.miembros - 1 : g.miembros + 1 } : g
    ));
  };

  const crearGrupo = ({ nombre, carrera, emoji }) => {
    const nuevo = {
      id: grupos.length + 1,
      nombre,
      carrera,
      emoji,
      miembros: 1,//por defecto ponemos que cada grupo que se cree tenga un grupo(el que lo creo)
      unido: true,
    };
    setGrupos([nuevo, ...grupos]);
  };

  const gruposFiltrados = grupos
    .filter(g => filtro === 'misGrupos' ? g.unido : true)
    .filter(g => g.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100">
      <Navbar />

      {mostrarModal && (
        <CrearGrupoModal
          onClose={() => setMostrarModal(false)}
          onCreate={crearGrupo}
        />
      )}

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-8">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Grupos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Únete a grupos de estudio de tu carrera
            </p>
          </div>
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            + Crear grupo
          </button>
        </div>

        {/* Buscador y filtros */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar grupos..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="input-base flex-1"
          />
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filtro === 'todos'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-dark-200 text-gray-600 dark:text-gray-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('misGrupos')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filtro === 'misGrupos'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-dark-200 text-gray-600 dark:text-gray-300'
            }`}
          >
            Mis grupos
          </button>
        </div>

        {/* Grid de tarjetas */}
        {gruposFiltrados.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" >
            {gruposFiltrados.map(grupo => (
              <GrupoCard key={grupo.id} grupo={grupo} onToggle={toggleUnirse} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">😕</p>
            <p>No se encontraron grupos</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default GruposPage;