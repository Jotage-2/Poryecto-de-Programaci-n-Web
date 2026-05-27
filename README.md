# 🎓 ULimaSocial

> Red social exclusiva para estudiantes de la Universidad de Lima

![Version](https://img.shields.io/badge/versión-1.0.0--MVP-orange)
![Status](https://img.shields.io/badge/estado-funcional-green)
![License](https://img.shields.io/badge/licencia-MIT-blue)

---

## 📋 Descripción del Proyecto

**ULimaSocial** es una plataforma de red social diseñada exclusivamente para la comunidad estudiantil de la Universidad de Lima. Este primer avance (MVP) implementa el sistema completo de autenticación: registro, verificación de correo institucional, inicio de sesión, recuperación de contraseña y persistencia de sesión.

---

## 🎯 Objetivo

Desarrollar una base sólida y escalable que permita en el futuro implementar funcionalidades sociales como publicaciones, perfiles completos, sistema de amigos, mensajería instantánea y grupos de estudio.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| **React** | 18.x | Librería principal de UI |
| **Vite** | 5.x | Bundler y servidor de desarrollo |
| **TailwindCSS** | 3.x | Framework de estilos utility-first |
| **React Router DOM** | 6.x | Sistema de rutas SPA |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| **Node.js** | 18+ | Entorno de ejecución del servidor |
| **Express** | 4.x | Framework web minimalista |
| **Nodemailer** | 6.x | Envío de correos electrónicos |
| **UUID** | 9.x | Generación de IDs únicos |

### Persistencia
- **JSON local** (`server/data/users.json`): almacenamiento de usuarios
- **localStorage**: persistencia de sesión entre recargas de página
- **sessionStorage**: capa adicional de sesión durante la ventana activa

---

## 📁 Estructura de Carpetas

```
ULimaSocial/
├── client/                         # Aplicación React (Frontend)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/                 # Imágenes, fuentes estáticas
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx    # Guard de rutas privadas
│   │   │   ├── common/
│   │   │   │   └── UIComponents.jsx      # Componentes reutilizables
│   │   │   └── layout/             # (preparado para Navbar, Footer, etc.)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Estado global de autenticación
│   │   │   └── ThemeContext.jsx    # Estado global de tema claro/oscuro
│   │   ├── hooks/                  # Custom hooks (preparado para expansión)
│   │   ├── layouts/
│   │   │   └── AuthLayout.jsx      # Layout compartido de páginas auth
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx       # Inicio de sesión
│   │   │   ├── RegisterPage.jsx    # Registro de usuario
│   │   │   ├── VerifyEmailPage.jsx # Verificación de correo
│   │   │   ├── ForgotPasswordPage.jsx  # Recuperar contraseña
│   │   │   └── HomePage.jsx        # Pantalla principal
│   │   ├── services/
│   │   │   └── api.js              # Capa de comunicación con el backend
│   │   ├── styles/
│   │   │   └── globals.css         # Estilos globales + Tailwind
│   │   ├── utils/
│   │   │   └── validators.js       # Validaciones y constantes
│   │   ├── App.jsx                 # Configuración de rutas
│   │   └── main.jsx                # Punto de entrada React
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/                         # Servidor Express (Backend)
│   ├── controllers/
│   │   └── authController.js       # Lógica de los endpoints
│   ├── data/
│   │   └── users.json              # Base de datos local en JSON
│   ├── middleware/
│   │   └── errorHandler.js         # Manejo global de errores
│   ├── routes/
│   │   └── authRoutes.js           # Definición de endpoints REST
│   ├── services/
│   │   ├── emailService.js         # Integración con Nodemailer
│   │   └── userService.js          # Operaciones CRUD sobre usuarios
│   ├── utils/
│   │   └── cryptoUtils.js          # Hash de contraseñas
│   ├── .env                        # Variables de entorno (no subir al repo)
│   ├── .env.example                # Plantilla de variables de entorno
│   ├── package.json
│   └── server.js                   # Punto de entrada del servidor
│
├── .gitignore
└── README.md
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- **Node.js** v18 o superior
- **npm** v9 o superior

### Paso 1: Instalar dependencias del backend
```bash
cd ULimaSocial/server
npm install
```

### Paso 2: Instalar dependencias del frontend
```bash
cd ULimaSocial/client
npm install
```

### Paso 3: Configurar variables de entorno
```bash
# En la carpeta server/
cp .env.example .env
# Editar .env con tus credenciales de correo
```

### Paso 4: Iniciar el backend
```bash
# En ULimaSocial/server/
npm run dev
# El servidor iniciará en http://localhost:3000
```

### Paso 5: Iniciar el frontend
```bash
# En ULimaSocial/client/
npm run dev
# La aplicación iniciará en http://localhost:5173
```

### ✅ Cuenta de prueba disponible
- **Correo:** `demo@aloe.ulima.edu.pe`
- **Contraseña:** `123456`

---

## 📧 Configuración de Nodemailer

Para que el envío de correos funcione, necesitas una **contraseña de aplicación** de Gmail:

1. Activa la **verificación en dos pasos** en tu cuenta Google
2. Ve a **Configuración > Seguridad > Contraseñas de aplicación**
3. Genera una contraseña para "Correo > Windows PC" (o similar)
4. Copia esa contraseña de 16 caracteres en `EMAIL_PASS` del `.env`

```env
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # contraseña de aplicación (sin espacios)
```

> **Modo desarrollo:** Si no configuras Nodemailer, el código de verificación aparece directamente en la **consola del servidor**. Esto permite probar el flujo sin necesidad de correo real.

---

## 💾 Explicación de localStorage y sessionStorage

### localStorage
```javascript
// Guarda datos que persisten indefinidamente (incluso después de cerrar el navegador)
localStorage.setItem('clave', JSON.stringify(datos));
const datos = JSON.parse(localStorage.getItem('clave'));
localStorage.removeItem('clave');
```
**En ULimaSocial:** Se usa para guardar la sesión del usuario. Permite que al recargar la página, el usuario siga autenticado.

### sessionStorage
```javascript
// Guarda datos solo durante la ventana/pestaña activa
sessionStorage.setItem('clave', valor);
// Se borra automáticamente al cerrar la pestaña
```
**En ULimaSocial:** Se usa como capa adicional de seguridad durante la sesión activa.

---

## 🔐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor Express | `3000` |
| `EMAIL_USER` | Correo Gmail para envío | `mi@gmail.com` |
| `EMAIL_PASS` | Contraseña de aplicación Google | `abcdefghijklmnop` |
| `JWT_SECRET` | Secreto para tokens (uso futuro) | `secreto_seguro` |

> ⚠️ **NUNCA** subas el archivo `.env` al repositorio. Está incluido en `.gitignore`.

---

## 🔄 Flujo de Autenticación

```
REGISTRO
├── Usuario llena formulario (nombre, código, correo @aloe.ulima.edu.pe, etc.)
├── Backend valida y crea usuario con verified: false
├── Se genera código de 6 dígitos y se envía al correo
└── Usuario ingresa código → verified: true → puede hacer login

LOGIN
├── Usuario ingresa correo o código universitario + contraseña
├── Backend verifica existencia, verificación y contraseña (hash SHA-256)
└── Se retorna datos del usuario → se guarda en localStorage → redirige a /home

RECUPERAR CONTRASEÑA
├── Usuario ingresa correo institucional
├── Backend genera código y lo envía
├── Usuario verifica código
└── Usuario establece nueva contraseña → hash → se guarda en JSON

PERSISTENCIA DE SESIÓN
├── Al cargar la app, se lee localStorage
├── Si hay sesión guardada → usuario autenticado sin necesidad de re-login
└── Cerrar sesión limpia localStorage y sessionStorage
```

---

## 🔐 Hash de Contraseñas

Las contraseñas se hashean con **SHA-256 sin salt** para simplicidad del proyecto universitario.

```javascript
import { createHash } from 'crypto';
const hash = createHash('sha256').update(password).digest('hex');
```

> ⚠️ **Nota de seguridad:** En producción real, se debe usar **bcrypt con salt** (`bcrypt.hash(password, 12)`) para proteger contra ataques de diccionario y tablas rainbow.

---

## 📦 Dependencias Explicadas

| Paquete | Lado | Descripción |
|---|---|---|
| `react-router-dom` | Frontend | Sistema de navegación SPA sin recargar la página |
| `tailwindcss` | Frontend | Estilos via clases CSS utility-first, sin escribir CSS |
| `nodemailer` | Backend | Librería para envío de correos desde Node.js |
| `express` | Backend | Framework HTTP minimalista para crear APIs REST |
| `cors` | Backend | Middleware que permite peticiones cross-origin del frontend |
| `dotenv` | Backend | Carga variables de entorno desde archivo `.env` |
| `uuid` | Backend | Genera identificadores únicos para cada usuario |

---

## 🗺️ Roadmap Futuro

- [ ] **Perfil de usuario** completo con edición de datos
- [ ] **Sistema de publicaciones** con texto, imágenes y reacciones
- [ ] **Sistema de amigos** con solicitudes y confirmaciones
- [ ] **Mensajería privada** en tiempo real (WebSockets)
- [ ] **Grupos de estudio** por carrera y ciclo
- [ ] **Migración a base de datos** (PostgreSQL o MongoDB)
- [ ] **JWT para autenticación** más segura
- [ ] **Notificaciones push**
- [ ] **Búsqueda de usuarios**

---

## 👥 Integrantes del Proyecto

| # | Nombre |
|---|---|
| 1 | Integrante 1 |
| 2 | Integrante 2 |
| 3 | Integrante 3 |
| 4 | Integrante 4 |
| 5 | Integrante 5 |

**Profesor:** [Nombre del profesor]

**Curso:** Desarrollo de Aplicaciones Web  
**Universidad:** Universidad de Lima  
**Año:** 2024

---

## 📸 Capturas de Pantalla

> *(Capturas disponibles tras ejecutar el proyecto)*

| Página | Descripción |
|---|---|
| `/login` | Inicio de sesión con correo o código |
| `/register` | Formulario de registro completo |
| `/verify-email` | Verificación con código de 6 dígitos |
| `/forgot-password` | Flujo de recuperación en 3 pasos |
| `/home` | Pantalla principal estilo red social |

---

*Desarrollado con ❤️ para la comunidad de la Universidad de Lima*
