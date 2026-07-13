# ULimaSocial — Frontend académico

Red social universitaria desarrollada como proyecto académico para estudiantes de la Universidad de Lima.

## Tecnologías

- React 18
- Vite 5
- React Router 6
- Tailwind CSS 3
- Persistencia temporal con `localStorage`

## Ejecutar el proyecto

```bash
cd client
npm install
npm run dev
```

## Funcionalidades del frontend

- Registro, verificación y acceso en modo local.
- Inicio con creación, eliminación, likes, comentarios y enlaces para compartir publicaciones.
- Perfil propio editable, incluida foto, carrera, ciclo, año de ingreso y presentación.
- Perfiles públicos con ruta preparada para IDs reales: `/perfil/:userId`.
- Solicitudes de amistad y administración de amigos.
- Acceso a conversaciones desde las tarjetas de amigos y perfiles.
- Grupos académicos locales.
- Navegación móvil inferior.
- Modo claro y oscuro con identidad visual blanca, naranja y negra.
- Notificaciones de solicitudes de amistad.

## Preparación para backend

Las rutas usan identificadores de usuario y el acceso a usuarios se concentra en `src/services/api.js`. Para conectar un backend posteriormente, se pueden reemplazar las funciones locales (`getUserById`, `updateUserProfile`, `searchUsers`, etc.) por peticiones HTTP sin cambiar la estructura principal de las páginas.

Los datos actuales son demostrativos y permanecen únicamente en el navegador mediante `localStorage`.
