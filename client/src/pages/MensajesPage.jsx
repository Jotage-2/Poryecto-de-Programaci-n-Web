// pages/MensajesPage.jsx - Página de mensajes entre estudiantes
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/validators';

// ============================================================
// DATOS ESTÁTICOS DE EJEMPLO (próximamente en el servidor)
// ============================================================
const conversacionesEjemplo = [
  {
    id: 1,
    contacto: { id: 101, nombre: 'María', apellido: 'García', carrera: 'Psicología', ciclo: '4', foto: null },
    mensajes: [
      { id: 1, texto: '¡Hola! ¿Tienes los apuntes de la clase de ayer?', enviado: false, hora: '10:30 AM' },
      { id: 2, texto: 'Sí, te los paso por aquí 📎', enviado: true, hora: '10:32 AM' },
      { id: 3, texto: '¡Genial, muchas gracias! 🙌', enviado: false, hora: '10:33 AM' },
    ],
    ultimoMensaje: '¡Genial, muchas gracias! 🙌',
    horaUltimo: '10:33 AM',
    sinLeer: 1,
    online: true,
  },
  {
    id: 2,
    contacto: { id: 102, nombre: 'Carlos', apellido: 'López', carrera: 'Ingeniería Industrial', ciclo: '5', foto: null },
    mensajes: [
      { id: 1, texto: '¿Vamos a la biblioteca a estudiar?', enviado: false, hora: '9:15 AM' },
      { id: 2, texto: 'Dale, llego en 20 min', enviado: true, hora: '9:18 AM' },
    ],
    ultimoMensaje: 'Dale, llego en 20 min',
    horaUltimo: '9:18 AM',
    sinLeer: 0,
    online: false,
  },
  {
    id: 3,
    contacto: { id: 103, nombre: 'Ana', apellido: 'Torres', carrera: 'Derecho', ciclo: '3', foto: null },
    mensajes: [
      { id: 1, texto: '¿Ya enviaste el trabajo de investigación?', enviado: true, hora: 'Ayer' },
      { id: 2, texto: 'Todavía no, me falta la conclusión 😅', enviado: false, hora: 'Ayer' },
      { id: 3, texto: '¿Necesitas ayuda? Puedo revisar tu borrador', enviado: true, hora: 'Ayer' },
      { id: 4, texto: '¡Sería increíble! Te lo mando esta noche', enviado: false, hora: 'Ayer' },
    ],
    ultimoMensaje: '¡Sería increíble! Te lo mando esta noche',
    horaUltimo: 'Ayer',
    sinLeer: 2,
    online: true,
  },
  {
    id: 4,
    contacto: { id: 104, nombre: 'Luis', apellido: 'Mendoza', carrera: 'Administración', ciclo: '6', foto: null },
    mensajes: [
      { id: 1, texto: '¿Cuándo es el parcial de estadística?', enviado: false, hora: 'Lun' },
      { id: 2, texto: 'Creo que es el jueves de la próxima semana', enviado: true, hora: 'Lun' },
    ],
    ultimoMensaje: 'Creo que es el jueves de la próxima semana',
    horaUltimo: 'Lun',
    sinLeer: 0,
    online: false,
  },
  {
    id: 5,
    contacto: { id: 105, nombre: 'Valeria', apellido: 'Ramos', carrera: 'Ingeniería de Sistemas', ciclo: '4', foto: null },
    mensajes: [
      { id: 1, texto: '¿Ya viste la nota del proyecto final?', enviado: false, hora: 'Dom' },
      { id: 2, texto: '¡Sí! Nos fue muy bien 🎉', enviado: true, hora: 'Dom' },
      { id: 3, texto: 'Sacamos 18, ¡el mejor grupo!', enviado: false, hora: 'Dom' },
    ],
    ultimoMensaje: 'Sacamos 18, ¡el mejor grupo!',
    horaUltimo: 'Dom',
    sinLeer: 0,
    online: true,
  },
];

// ============================================================
// COMPONENTE: ITEM DE CONVERSACIÓN (lista lateral)
// ============================================================
const ConversacionItem = ({ conversacion, activa, onClick }) => {
  const { contacto, ultimoMensaje, horaUltimo, sinLeer, online } = conversacion;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
        activa
          ? 'bg-primary-50 dark:bg-primary-900/20 shadow-sm'
          : 'hover:bg-gray-50 dark:hover:bg-dark-300'
      }`}
    >
      {/* Avatar con indicador online */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden shadow-sm">
          {contacto.foto ? (
            <img src={contacto.foto} alt={contacto.nombre} className="w-full h-full object-cover" />
          ) : (
            getInitials(contacto.nombre, contacto.apellido)
          )}
        </div>
        {online && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-dark-200 rounded-full" />
        )}
      </div>

      {/* Info de la conversación */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`text-sm font-semibold truncate ${
            sinLeer > 0
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {contacto.nombre} {contacto.apellido}
          </p>
          <span className={`text-xs shrink-0 ml-2 ${
            sinLeer > 0
              ? 'text-primary-600 dark:text-primary-400 font-semibold'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            {horaUltimo}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className={`text-xs truncate ${
            sinLeer > 0
              ? 'text-gray-700 dark:text-gray-200 font-medium'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            {ultimoMensaje}
          </p>
          {sinLeer > 0 && (
            <span className="ml-2 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
              {sinLeer}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

// ============================================================
// COMPONENTE: BURBUJA DE MENSAJE
// ============================================================
const BurbujaMensaje = ({ mensaje }) => (
  <div className={`flex ${mensaje.enviado ? 'justify-end' : 'justify-start'} mb-2`}>
    <div
      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        mensaje.enviado
          ? 'bg-primary-600 text-white rounded-br-md'
          : 'bg-gray-100 dark:bg-dark-300 text-gray-800 dark:text-gray-200 rounded-bl-md'
      }`}
    >
      <p>{mensaje.texto}</p>
      <p className={`text-[10px] mt-1 text-right ${
        mensaje.enviado
          ? 'text-white/60'
          : 'text-gray-400 dark:text-gray-500'
      }`}>
        {mensaje.hora}
      </p>
    </div>
  </div>
);

// ============================================================
// COMPONENTE: PANEL DE CHAT (conversación activa)
// ============================================================
const PanelChat = ({ conversacion, user, onEnviar, onVolver }) => {
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll al final cuando cambia la conversación o llegan mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversacion]);

  const handleEnviar = (e) => {
    e.preventDefault();
    const trimmed = nuevoMensaje.trim();
    if (!trimmed) return;
    onEnviar(trimmed);
    setNuevoMensaje('');
  };

  if (!conversacion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <p className="text-6xl mb-4">💬</p>
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
          Tus mensajes
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
          Selecciona una conversación de la lista para empezar a chatear con tus compañeros
        </p>
      </div>
    );
  }

  const { contacto, mensajes, online } = conversacion;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header del chat */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-dark-400">
        {/* Botón volver (solo móvil) */}
        <button
          onClick={onVolver}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors text-gray-500 dark:text-gray-400 text-sm"
        >
          ← 
        </button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden shadow-sm">
            {contacto.foto ? (
              <img src={contacto.foto} alt={contacto.nombre} className="w-full h-full object-cover" />
            ) : (
              getInitials(contacto.nombre, contacto.apellido)
            )}
          </div>
          {online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-dark-200 rounded-full" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
            {contacto.nombre} {contacto.apellido}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {online ? '🟢 En línea' : `${contacto.carrera} · ${contacto.ciclo}° ciclo`}
          </p>
        </div>

        {/* Acciones del chat */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            disabled
            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors cursor-not-allowed opacity-50"
            title="Llamada (próximamente)"
          >
            📞
          </button>
          <button
            disabled
            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors cursor-not-allowed opacity-50"
            title="Videollamada (próximamente)"
          >
            📹
          </button>
        </div>
      </div>

      {/* Mensajes */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-1"
      >
        {/* Indicador de fecha */}
        <div className="flex justify-center mb-4">
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-dark-300 px-3 py-1 rounded-full">
            Hoy
          </span>
        </div>

        {mensajes.map((msg) => (
          <BurbujaMensaje key={msg.id} mensaje={msg} />
        ))}
      </div>

      {/* Input de mensaje */}
      <form
        onSubmit={handleEnviar}
        className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-dark-400 bg-white dark:bg-dark-200"
      >
        <button
          type="button"
          disabled
          className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors cursor-not-allowed opacity-50 shrink-0"
          title="Adjuntar archivo (próximamente)"
        >
          📎
        </button>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          className="flex-1 bg-gray-100 dark:bg-dark-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          disabled={!nuevoMensaje.trim()}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors shrink-0 shadow-sm"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL - MENSAJES PAGE
// ============================================================
const MensajesPage = () => {
  const { user } = useAuth();
  const [conversaciones, setConversaciones] = useState(conversacionesEjemplo);
  const [conversacionActiva, setConversacionActiva] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Seleccionar conversación y marcar como leída
  const seleccionarConversacion = (conv) => {
    setConversacionActiva(conv.id);
    // Marcar mensajes como leídos
    setConversaciones((prev) =>
      prev.map((c) =>
        c.id === conv.id ? { ...c, sinLeer: 0 } : c
      )
    );
  };

  // Enviar un nuevo mensaje
  const enviarMensaje = (texto) => {
    const nuevoMsg = {
      id: Date.now(),
      texto,
      enviado: true,
      hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    };

    setConversaciones((prev) =>
      prev.map((c) =>
        c.id === conversacionActiva
          ? {
              ...c,
              mensajes: [...c.mensajes, nuevoMsg],
              ultimoMensaje: texto,
              horaUltimo: nuevoMsg.hora,
            }
          : c
      )
    );
  };

  // Filtrar conversaciones por búsqueda
  const conversacionesFiltradas = conversaciones.filter((c) => {
    const nombreCompleto = `${c.contacto.nombre} ${c.contacto.apellido}`.toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  // Obtener la conversación activa completa
  const convActiva = conversaciones.find((c) => c.id === conversacionActiva) || null;

  // Total de mensajes sin leer
  const totalSinLeer = conversaciones.reduce((sum, c) => sum + c.sinLeer, 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-8">

        {/* Encabezado */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mensajes</h1>
            {totalSinLeer > 0 && (
              <span className="bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {totalSinLeer} {totalSinLeer === 1 ? 'nuevo' : 'nuevos'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Chatea con tus compañeros de la Universidad de Lima
          </p>
        </div>

        {/* Layout principal del chat */}
        <div className="card overflow-hidden flex" style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>

          {/* ── LISTA DE CONVERSACIONES (izquierda) ── */}
          <div className={`w-full lg:w-80 shrink-0 border-r border-gray-100 dark:border-dark-400 flex flex-col ${
            conversacionActiva ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Buscador */}
            <div className="p-3 border-b border-gray-100 dark:border-dark-400">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-300 rounded-xl px-3 py-2">
                <span className="text-gray-400 text-sm shrink-0">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar conversaciones..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none w-full"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda('')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Lista de chats */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversacionesFiltradas.length > 0 ? (
                conversacionesFiltradas.map((conv) => (
                  <ConversacionItem
                    key={conv.id}
                    conversacion={conv}
                    activa={conversacionActiva === conv.id}
                    onClick={() => seleccionarConversacion(conv)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">😕</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {busqueda ? 'No se encontraron conversaciones' : 'Aún no tienes mensajes'}
                  </p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                    {busqueda ? 'Intenta con otro nombre' : 'Busca estudiantes para empezar a chatear'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── PANEL DE CHAT (derecha) ── */}
          <PanelChat
            conversacion={convActiva}
            user={user}
            onEnviar={enviarMensaje}
            onVolver={() => setConversacionActiva(null)}
          />
        </div>
      </main>
    </div>
  );
};

export default MensajesPage;
