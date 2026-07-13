import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Avatar from '../components/user/Avatar';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../services/api';
import { getProfilePath } from '../utils/navigation';

const seedConversations = [
  {
    id: 'demo-maria',
    contacto: { id: 'demo-maria', name: 'María', lastName: 'García', career: 'Psicología', cycle: '4', profilePicture: '' },
    mensajes: [
      { id: 1, text: '¡Hola! ¿Tienes los apuntes de la clase de ayer?', sent: false, time: '10:30' },
      { id: 2, text: 'Sí, te los paso por aquí.', sent: true, time: '10:32' },
      { id: 3, text: '¡Genial, muchas gracias!', sent: false, time: '10:33' },
    ],
    unread: 1,
    online: true,
  },
  {
    id: 'demo-carlos',
    contacto: { id: 'demo-carlos', name: 'Carlos', lastName: 'López', career: 'Ingeniería Industrial', cycle: '5', profilePicture: '' },
    mensajes: [
      { id: 1, text: '¿Vamos a la biblioteca a estudiar?', sent: false, time: '09:15' },
      { id: 2, text: 'Dale, llego en 20 minutos.', sent: true, time: '09:18' },
    ],
    unread: 0,
    online: false,
  },
];

const getConversationPreview = (conversation) => {
  const lastMessage = conversation.mensajes.at(-1);
  return {
    text: lastMessage?.text || 'Inicia una conversación',
    time: lastMessage?.time || '',
  };
};

const ConversationItem = ({ conversation, active, onClick }) => {
  const preview = getConversationPreview(conversation);
  return (
    <button type="button" onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${active ? 'bg-primary-50 dark:bg-primary-900/20 shadow-sm translate-x-1' : 'hover:bg-gray-50 dark:hover:bg-dark-300 hover:translate-x-1'}`}>
      <div className="relative shrink-0">
        <Avatar person={conversation.contacto} />
        {conversation.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-dark-200 rounded-full" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm truncate ${conversation.unread > 0 ? 'font-black text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>{conversation.contacto.name} {conversation.contacto.lastName}</p>
          <span className={`text-[10px] shrink-0 ${conversation.unread > 0 ? 'text-primary-600 font-bold' : 'text-gray-400'}`}>{preview.time}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className={`text-xs truncate flex-1 ${conversation.unread > 0 ? 'text-gray-700 dark:text-gray-200 font-medium' : 'text-gray-400'}`}>{preview.text}</p>
          {conversation.unread > 0 && <span className="w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{conversation.unread}</span>}
        </div>
      </div>
    </button>
  );
};

const ChatPanel = ({ conversation, currentUser, onSend, onBack, onOpenProfile }) => {
  const [message, setMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [conversation?.mensajes.length]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage('');
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 rounded-3xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-4xl mb-4 animate-float">✉</div>
        <h3 className="text-lg font-black text-gray-700 dark:text-gray-300">Tus mensajes</h3>
        <p className="text-sm text-gray-400 max-w-xs mt-1">Selecciona una conversación o abre un chat desde la página de amigos.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-gray-100 dark:border-dark-400">
        <button type="button" onClick={onBack} className="lg:hidden w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 text-gray-500">←</button>
        <Avatar person={conversation.contacto} size="sm" onClick={onOpenProfile} />
        <button type="button" onClick={onOpenProfile} className="min-w-0 flex-1 text-left group">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-primary-600 transition-colors">{conversation.contacto.name} {conversation.contacto.lastName}</p>
          <p className="text-xs text-gray-400">{conversation.online ? 'En línea' : `${conversation.contacto.career || 'Estudiante'}${conversation.contacto.cycle ? ` · ${conversation.contacto.cycle}° ciclo` : ''}`}</p>
        </button>
        <span className="hidden sm:block text-[10px] px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-300 text-gray-400">Chat local</span>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-2 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_35%)]">
        <div className="flex justify-center mb-4"><span className="text-[10px] text-gray-400 bg-white dark:bg-dark-300 border border-gray-100 dark:border-dark-400 px-3 py-1 rounded-full shadow-sm">Hoy</span></div>
        {conversation.mensajes.length === 0 && <p className="text-xs text-gray-400 text-center py-8">Aún no hay mensajes. Saluda a {conversation.contacto.name}.</p>}
        {conversation.mensajes.map((item) => (
          <div key={item.id} className={`flex ${item.sent ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${item.sent ? 'bg-primary-600 text-white rounded-br-md' : 'bg-white dark:bg-dark-300 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-100 dark:border-dark-400'}`}>
              <p>{item.text}</p>
              <p className={`text-[9px] mt-1 text-right ${item.sent ? 'text-white/65' : 'text-gray-400'}`}>{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 sm:px-4 py-3 border-t border-gray-100 dark:border-dark-400 bg-white dark:bg-dark-200">
        <Avatar person={currentUser} size="sm" />
        <input value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} placeholder="Escribe un mensaje..." className="flex-1 bg-gray-100 dark:bg-dark-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 border border-transparent focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all" />
        <button type="submit" disabled={!message.trim()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white transition-all hover:-translate-y-0.5 shadow-md shadow-primary-600/20">➤</button>
      </form>
    </div>
  );
};

const MensajesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const storageKey = `ulimasocial_messages_${user?.id || 'anonymous'}`;
  const [conversations, setConversations] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || seedConversations; }
    catch { return seedConversations; }
  });
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(conversations));
  }, [conversations, storageKey]);

  useEffect(() => {
    const requestedUserId = searchParams.get('user');
    if (!requestedUserId) return;
    let mounted = true;

    const openRequestedConversation = async () => {
      const existing = conversations.find((conversation) => String(conversation.contacto.id) === String(requestedUserId));
      if (existing) {
        setActiveConversationId(existing.id);
        return;
      }

      const statePerson = location.state?.person;
      const person = String(statePerson?.id) === String(requestedUserId) ? statePerson : await getUserById(requestedUserId);
      if (!mounted || !person) return;

      const newConversation = {
        id: `user-${person.id}`,
        contacto: {
          id: person.id,
          name: person.name,
          lastName: person.lastName,
          career: person.career,
          cycle: person.cycle,
          profilePicture: person.profilePicture || '',
        },
        mensajes: [],
        unread: 0,
        online: false,
      };
      setConversations((current) => current.some((item) => String(item.contacto.id) === String(person.id)) ? current : [newConversation, ...current]);
      setActiveConversationId(newConversation.id);
    };

    openRequestedConversation();
    return () => { mounted = false; };
  }, [conversations, location.state, searchParams]);

  const selectConversation = (conversation) => {
    setActiveConversationId(conversation.id);
    setConversations((current) => current.map((item) => item.id === conversation.id ? { ...item, unread: 0 } : item));
  };

  const sendMessage = (text) => {
    const newMessage = {
      id: crypto.randomUUID(),
      text,
      sent: true,
      time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    };
    setConversations((current) => current.map((conversation) => conversation.id === activeConversationId ? { ...conversation, mensajes: [...conversation.mensajes, newMessage] } : conversation));
  };

  const filteredConversations = useMemo(() => conversations.filter((conversation) => `${conversation.contacto.name} ${conversation.contacto.lastName}`.toLowerCase().includes(search.toLowerCase())), [conversations, search]);
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) || null;
  const unreadTotal = conversations.reduce((total, conversation) => total + conversation.unread, 0);

  const openContactProfile = () => {
    if (!activeConversation) return;
    navigate(getProfilePath(activeConversation.contacto.id, user?.id), { state: { person: activeConversation.contacto } });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100 transition-colors duration-300">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-20 pb-24 md:pb-8 page-enter">
        <div className="mb-4 flex items-center gap-3">
          <div><h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">Mensajes</h1><p className="text-sm text-gray-400 mt-0.5">Conversa con tus compañeros de la comunidad ULima.</p></div>
          {unreadTotal > 0 && <span className="bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{unreadTotal} nuevos</span>}
        </div>

        <div className="card overflow-hidden flex shadow-md" style={{ height: 'calc(100vh - 190px)', minHeight: '500px' }}>
          <section className={`w-full lg:w-80 shrink-0 border-r border-gray-100 dark:border-dark-400 flex-col ${activeConversationId ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-3 border-b border-gray-100 dark:border-dark-400">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-300 rounded-xl px-3 py-2 border border-transparent focus-within:border-primary-300 transition-colors">
                <span className="text-gray-400">⌕</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar conversaciones..." className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none w-full" />
                {search && <button type="button" onClick={() => setSearch('')} className="text-gray-400">✕</button>}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredConversations.length > 0 ? filteredConversations.map((conversation) => <ConversationItem key={conversation.id} conversation={conversation} active={activeConversationId === conversation.id} onClick={() => selectConversation(conversation)} />) : <div className="text-center py-12"><p className="text-4xl">⌕</p><p className="text-sm text-gray-400 mt-3">No se encontraron conversaciones.</p></div>}
            </div>
          </section>

          <ChatPanel conversation={activeConversation} currentUser={user} onSend={sendMessage} onBack={() => setActiveConversationId(null)} onOpenProfile={openContactProfile} />
        </div>
      </main>
    </div>
  );
};

export default MensajesPage;
