// middleware/errorHandler.js - Middleware de manejo de errores
/**
 * Middleware global de manejo de errores
 * Captura errores no manejados y devuelve respuesta consistente
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error no manejado:', err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFound = (req, res) => {
  res.status(404).json({ message: `Ruta ${req.originalUrl} no encontrada` });
};
