// server.js - Punto de entrada del servidor Express
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARES GLOBALES
// ============================================================

// CORS: permitir peticiones desde el frontend (Vite en puerto 5173)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Parsear JSON en el body de las peticiones
app.use(express.json({ limit: '10mb' }));

// Parsear URL-encoded data
app.use(express.urlencoded({ extended: true }));

// ============================================================
// RUTAS DE LA API
// ============================================================

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ULimaSocial API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/groups', groupRoutes);

// ============================================================
// MANEJO DE ERRORES
// ============================================================

// Ruta no encontrada
app.use(notFound);

// Manejador global de errores
app.use(errorHandler);

// ============================================================
// INICIAR SERVIDOR
// ============================================================
app.listen(PORT, () => {
  console.log('');
  console.log('🎓 ============================================');
  console.log('   ULimaSocial - Backend iniciado');
  console.log(`   ✅ Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`   📧 Email configurado: ${process.env.EMAIL_USER || 'No configurado (modo DEV)'}`);
  console.log('   🔗 Endpoints disponibles:');
  console.log(`      POST /api/auth/register`);
  console.log(`      POST /api/auth/verify`);
  console.log(`      POST /api/auth/resend-code`);
  console.log(`      POST /api/auth/login`);
  console.log(`      POST /api/auth/forgot-password`);
  console.log(`      POST /api/auth/reset-password`);
  console.log('🎓 ============================================');
  console.log('');
});

export default app;
