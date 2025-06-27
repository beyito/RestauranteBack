import { Router } from 'express'
import { ControladorUsuario } from '../controllers/usuario.js'

export const crearRutaUsuarios = ({ modeloUsuario, modeloBitacora }) => {
  const usuarioRuta = Router()
  const controladorUsuario = new ControladorUsuario({ modeloUsuario, modeloBitacora })
  usuarioRuta.post('/register', controladorUsuario.registrarUsuario)
  usuarioRuta.patch('/editarUsuario/:id', controladorUsuario.editarUsuario)
  usuarioRuta.get('/verUsuarios', controladorUsuario.verUsuarios)
  usuarioRuta.get('/verUsuario/:id', controladorUsuario.verUsuario)
  usuarioRuta.get('/verClientes', controladorUsuario.verClientes)
  usuarioRuta.patch('/aumentarPuntosFidelidad/:id', controladorUsuario.aumentarPuntosFidelidad)
  usuarioRuta.patch('/disminuirPuntosFidelidad/:id', controladorUsuario.disminuirPuntosFidelidad)
  usuarioRuta.patch('/editarPuntosFidelidad/:id', controladorUsuario.editarPuntosFidelidad)
  return usuarioRuta
}
