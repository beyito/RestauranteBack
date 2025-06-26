import { Router } from 'express'
import { ControladorAuth } from '../controllers/auth.js'
import { autenticacion, clearToken } from '../../middleware/authPermiso.js'

export const crearAuthRutas = ({ modeloAuth, modeloBitacora }) => {
  const Authruta = Router()
  const middleware = autenticacion(modeloAuth.token)
  const controladorAuth = new ControladorAuth({ modeloAuth, modeloBitacora })
  Authruta.post('/login', controladorAuth.login)
  Authruta.get('/logout', clearToken)
  Authruta.get('/verificar', middleware, controladorAuth.perfil)
  return Authruta
}
