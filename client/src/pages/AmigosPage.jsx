// pages/AmigosPage.jsx - Página de gestión de amigos
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import { getInitials } from '../utils/validators';

// ============================================================
// DATOS ESTÁTICOS DE EJEMPLO
// ============================================================
const usuariosEjemplo = [
  { id: 1, nombre: 'María', apellido: 'García', carrera: 'Psicología', ciclo: '4', esAmigo: true, estado: 'en línea' },
  { id: 2, nombre: 'Carlos', apellido: 'López', carrera: 'Ingeniería Industrial', ciclo: '5', esAmigo: true, estado: 'hace 5 min' },
  { id: 3, nombre: 'Ana', apellido: 'Torres', carrera: 'Derecho', ciclo: '3', esAmigo: false, estado: 'hace 20 min' },
  { id: 4, nombre: 'Luis', apellido: 'Mendoza', carrera: 'Administración', ciclo: '6', esAmigo: true, estado: 'en línea' },
  { id: 5, nombre: 'Valeria', apellido: 'Ramos', carrera: 'Ingeniería de Sistemas', ciclo: '4', esAmigo: false, estado: 'hace 1 hora' },
  { id: 6, nombre: 'Diego', apellido: 'Flores', carrera: 'Economía', ciclo: '7', esAmigo: false, estado: 'en línea' },
  { id: 7, nombre: 'Camila', apellido: 'Herrera', carrera: 'Comunicaciones', ciclo: '5', esAmigo: true, estado: 'hace 10 min' },
  { id: 8, nombre: 'Andrés', apellido: 'Vargas', carrera: 'Ingeniería Civil', ciclo: '8', esAmigo: false, estado: 'hace 2 horas' },
];

const solicitudesEjemplo = [
  { id: 101, nombre: 'Sofía', apellido: 'Castillo', carrera: 'Marketing', ciclo: '3', mensaje: 'Hola, estamos en el mismo curso de Estadística 😊' },
  { id: 102, nombre: 'Rodrigo', apellido: 'Paredes', carrera: 'Ingeniería de Sistemas', ciclo: '6', mensaje: 'Te vi en el grupo de Programación Web' },
  { id: 103, nombre: 'Isabella', apellido: 'Quispe', carrera: 'Arquitectura', ciclo: '4', mensaje: '' },
];

// ============================================================
// TARJETA DE SOLICITUD PENDIENTE
// ============================================================
const SolicitudCard = ({ solicitud, onAceptar, onRechazar }) => (
  <div className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow animate-fade-in">
    {/* Avatar */}
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
      {solicitud.nombre.charAt(0)}{solicitud.apellido.charAt(0)}
    </div>

    {/* Info */}
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
        {solicitud.nombre} {solicitud.apellido}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
        {solicitud.carrera} · {solicitud.ciclo}° ciclo
      </p>
      {solicitud.mensaje && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic truncate">
          "{solicitud.mensaje}"
        </p>
      )}
    </div>

    {/* Botones */}
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => onAceptar(solicitud.id)}
        className="px-3 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold transition-colors"
      >
        Aceptar
      </button>
      <button
        onClick={() => onRechazar(solicitud.id)}
        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 text-xs font-semibold transition-colors"
      >
        Rechazar
      </button>
    </div>
  </div>
);

// ============================================================
// TARJETA DE USUARIO / AMIGO (sin banner naranja)
// ============================================================
const UsuarioCard = ({ usuario, onToggle }) => (
  <div className="card p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
    {/* Avatar con indicador de estado */}
    <div className="relative mb-3">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-dark-400 dark:to-dark-300 flex items-center justify-center text-white font-bold text-lg">
        {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
      </div>
      {usuario.estado === 'en línea' && (
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white dark:border-dark-200 rounded-full" />
      )}
    </div>

    {/* Info */}
    <h3 className="font-bold text-gray-800 dark:text-white text-sm truncate w-full">
      {usuario.nombre} {usuario.apellido}
    </h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate w-full">
      {usuario.carrera}
    </p>
    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">
      {usuario.ciclo}° ciclo
    </p>
    {usuario.estado !== 'en línea' && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        🕐 {usuario.estado}
      </p>
    )}

    {/* Botón agregar / amigos */}
    <button
      onClick={() => onToggle(usuario.id)}
      className={`w-full mt-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
        usuario.esAmigo
          ? 'bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400'
          : 'bg-primary-500 hover:bg-primary-600 text-white'
      }`}
    >
      {usuario.esAmigo ? '✓ Amigos' : '+ Agregar'}
    </button>
  </div>
);

// ============================================================
// PÁGINA PRINCIPAL DE AMIGOS
// ============================================================
const AmigosPage = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState(usuariosEjemplo);
  const [solicitudes, setSolicitudes] = useState(solicitudesEjemplo);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'misAmigos' | 'solicitudes'

  // Toggle agregar/eliminar amigo
  const toggleAmigo = (id) => {
    setUsuarios(usuarios.map(u =>
      u.id === id ? { ...u, esAmigo: !u.esAmigo } : u
    ));
  };

  // Aceptar solicitud
  const aceptarSolicitud = (id) => {
    const solicitud = solicitudes.find(s => s.id === id);
    if (solicitud) {
      const nuevoUsuario = {
        id: solicitud.id,
        nombre: solicitud.nombre,
        apellido: solicitud.apellido,
        carrera: solicitud.carrera,
        ciclo: solicitud.ciclo,
        esAmigo: true,
        estado: 'en línea',
      };
      setUsuarios(prev => [nuevoUsuario, ...prev]);
      setSolicitudes(prev => prev.filter(s => s.id !== id));
    }
  };

  // Rechazar solicitud
  const rechazarSolicitud = (id) => {
    setSolicitudes(prev => prev.filter(s => s.id !== id));
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios
    .filter(u => filtro === 'misAmigos' ? u.esAmigo : true)
    .filter(u =>
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.carrera.toLowerCase().includes(busqueda.toLowerCase())
    );

  const totalAmigos = usuarios.filter(u => u.esAmigo).length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-8">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              👥 Amigos
              <span className="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold px-2.5 py-0.5 rounded-full">
                {totalAmigos}
              </span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Conecta con otros estudiantes de la Universidad de Lima
            </p>
          </div>
        </div>

        {/* Buscador y filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o carrera..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="input-base flex-1"
          />
          <div className="flex gap-2">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'misAmigos', label: 'Mis amigos' },
              { id: 'solicitudes', label: `Solicitudes (${solicitudes.length})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  filtro === f.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── VISTA: SOLICITUDES PENDIENTES ── */}
        {filtro === 'solicitudes' && (
          <div className="space-y-3">
            {solicitudes.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Tienes <span className="font-semibold text-primary-600 dark:text-primary-400">{solicitudes.length}</span> solicitud{solicitudes.length !== 1 ? 'es' : ''} pendiente{solicitudes.length !== 1 ? 's' : ''}
                </p>
                {solicitudes.map(solicitud => (
                  <SolicitudCard
                    key={solicitud.id}
                    solicitud={solicitud}
                    onAceptar={aceptarSolicitud}
                    onRechazar={rechazarSolicitud}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p className="text-4xl mb-3">✉️</p>
                <p className="font-medium text-gray-500 dark:text-gray-400">No tienes solicitudes pendientes</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Cuando alguien te envíe una solicitud, aparecerá aquí</p>
              </div>
            )}
          </div>
        )}

        {/* ── VISTA: GRID DE USUARIOS ── */}
        {filtro !== 'solicitudes' && (
          <>
            {usuariosFiltrados.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {usuariosFiltrados.map(usuario => (
                  <UsuarioCard key={usuario.id} usuario={usuario} onToggle={toggleAmigo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p className="text-4xl mb-3">😕</p>
                <p className="font-medium text-gray-500 dark:text-gray-400">No se encontraron usuarios</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Intenta con otro nombre o carrera</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AmigosPage;
