// config/authConfig.js

// Carga variables de entorno con valores por defecto
export const PALABRA_SECRETA = process.env.PALABRA_SECRETA || 'clave_Secreta_para_el_restaurante_de_la_universidad'

export const expiresIn = process.env.EXPIRES_IN || '1h'

// Configuración de cookies, sin intentar leer objeto desde env (que es string)
export const cookieOptions = {
  httpOnly: true,
  secure: true, // necesario si estás en https
  sameSite: 'None', // IMPORTANTE para que funcione en cross-origin
  maxAge: 1000 * 60 * 60 * 24 // 1 día
}
