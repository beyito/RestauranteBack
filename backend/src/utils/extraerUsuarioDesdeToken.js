import { ModeloAuth } from '../models/auth.js' // Ajusta la ruta a donde tengas la instancia Token

export const extraerUsuarioDesdeToken = (req) => {
  const tokenCookie = req.cookies?.access_token
  if (!tokenCookie) return null

  try {
    const payload = ModeloAuth.token.verificarToken(tokenCookie)
    return {
      id: payload.id,
      nombreUsuario: payload.nombreUsuario,
      rol: payload.rol
    }
  } catch (error) {
    console.error('Token inválido o expirado:', error.message)
    return null
  }
}
