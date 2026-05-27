// services/emailService.js - Servicio de envío de correos con Nodemailer
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Crea el transportador de Nodemailer
 * Usa variables de entorno para credenciales seguras
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Contraseña de aplicación de Google
    },
  });
};

/**
 * Envía correo de verificación de cuenta
 * @param {string} to - Correo destinatario
 * @param {string} name - Nombre del usuario
 * @param {string} code - Código de verificación
 * @returns {Promise} Resultado del envío
 */
export const sendVerificationEmail = async (to, name, code) => {
  // Si no hay credenciales configuradas, simular envío en desarrollo
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'tu_correo@gmail.com') {
    console.log(`[DEV MODE] Código de verificación para ${to}: ${code}`);
    return { success: true, dev: true };
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"ULimaSocial" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✅ Verifica tu cuenta en ULimaSocial',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #e85d04, #f48c06); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px; }
          .header p { color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 14px; }
          .body { padding: 30px; }
          .body h2 { color: #1a1a1a; margin-top: 0; }
          .code-box { background: #fff8f0; border: 2px dashed #e85d04; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 36px; font-weight: bold; color: #e85d04; letter-spacing: 8px; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee; }
          .footer p { color: #888; font-size: 12px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ULimaSocial</h1>
            <p>Red social exclusiva para estudiantes de la Universidad de Lima</p>
          </div>
          <div class="body">
            <h2>¡Hola, ${name}! 👋</h2>
            <p>Gracias por registrarte en ULimaSocial. Para activar tu cuenta, usa el siguiente código de verificación:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p>Este código es válido por <strong>30 minutos</strong>. Si no solicitaste este correo, ignóralo.</p>
          </div>
          <div class="footer">
            <p>© 2024 ULimaSocial · Universidad de Lima</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw new Error('No se pudo enviar el correo de verificación');
  }
};

/**
 * Envía correo de recuperación de contraseña
 * @param {string} to - Correo destinatario
 * @param {string} name - Nombre del usuario
 * @param {string} code - Código de recuperación
 * @returns {Promise} Resultado del envío
 */
export const sendPasswordResetEmail = async (to, name, code) => {
  // Modo desarrollo: mostrar código en consola
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'tu_correo@gmail.com') {
    console.log(`[DEV MODE] Código de recuperación para ${to}: ${code}`);
    return { success: true, dev: true };
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"ULimaSocial" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🔐 Recupera tu contraseña en ULimaSocial',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1a1a1a, #333); padding: 30px; text-align: center; }
          .header h1 { color: #e85d04; margin: 0; font-size: 28px; }
          .header p { color: rgba(255,255,255,0.7); margin: 5px 0 0; font-size: 14px; }
          .body { padding: 30px; }
          .code-box { background: #fff8f0; border: 2px dashed #e85d04; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 36px; font-weight: bold; color: #e85d04; letter-spacing: 8px; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee; }
          .footer p { color: #888; font-size: 12px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ULimaSocial</h1>
            <p>Recuperación de contraseña</p>
          </div>
          <div class="body">
            <h2>Hola, ${name}</h2>
            <p>Recibimos una solicitud para recuperar tu contraseña. Usa este código:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p>Si no solicitaste esto, ignora este correo. Tu contraseña permanecerá igual.</p>
          </div>
          <div class="footer">
            <p>© 2024 ULimaSocial · Universidad de Lima</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw new Error('No se pudo enviar el correo de recuperación');
  }
};
