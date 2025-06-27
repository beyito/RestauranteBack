import { ValidacionDatosUsuario } from '../utils/validacionDatosUsuario.js'
import { extraerUsuarioDesdeToken } from '../utils/extraerUsuarioDesdeToken.js'
export class ControladorUsuario {
  constructor ({ modeloUsuario, modeloBitacora }) {
    this.ModeloUsuario = modeloUsuario
    this.ModeloBitacora = modeloBitacora
  }

  editarUsuario = async (req, res) => {
    const { id } = req.params
    const resultado = ValidacionDatosUsuario.verificarDatosUsuario(req.body)
    if (!resultado.success) return res.status(401).json({ error: resultado.error })
    const usuario = await this.ModeloUsuario.editarUsuario({ id, input: resultado })
    if (usuario.error) return res.status(400).json({ error: usuario.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Editar Usuario',
        descripcion: 'Se modificó al usuario con id : ' + id,
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(usuario.mensaje)
  }

  registrarUsuario = async (req, res) => {
    const resultado = ValidacionDatosUsuario.verificarDatosUsuario(req.body)
    if (!resultado.success) return res.status(401).json({ error: resultado.error })
    const usuario = await this.ModeloUsuario.registrarUsuario({ input: resultado })
    if (usuario.error) return res.status(400).json({ error: usuario.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Registrar Usuario',
        descripcion: 'Se registró al usuario : ' + req.body.nombreUsuario,
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(usuario)
  }

  verUsuarios = async (req, res) => {
    const usuarios = await this.ModeloUsuario.verUsuarios()
    if (usuarios.error) return res.status(400).json({ error: usuarios.error })
    return res.status(201).json(usuarios)
  }

  verUsuario = async (req, res) => {
    const { id } = req.params
    const usuario = await this.ModeloUsuario.verUsuario(id)
    if (usuario.error) return res.status(400).json({ error: usuario.error })
    return res.status(201).json(usuario)
  }

  aumentarPuntosFidelidad = async (req, res) => {
    const { id } = req.params
    const resultado = ValidacionDatosUsuario.verificarDatosUsuario(req.body)
    if (!resultado.success) return res.status(401).json({ error: resultado.error })
    const usuario = await this.ModeloUsuario.aumentarPuntosFidelidad({ id, input: resultado })
    if (usuario.error) return res.status(400).json({ error: usuario.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Aumentar Puntos de Fidelidad',
        descripcion: 'Se aumentaron puntos de fidelidad al usuario con id : ' + id,
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(usuario.mensaje)
  }

  disminuirPuntosFidelidad = async (req, res) => {
    const { id } = req.params
    const resultado = ValidacionDatosUsuario.verificarDatosUsuario(req.body)
    if (!resultado.success) return res.status(401).json({ error: resultado.error })
    const usuario = await this.ModeloUsuario.disminuirPuntosFidelidad({ id, input: resultado })
    if (usuario.error) return res.status(400).json({ error: usuario.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Disminuir Puntos de Fidelidad',
        descripcion: 'Se disminuyeron puntos de fidelidad al usuario con id : ' + id,
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(usuario.mensaje)
  }

  editarPuntosFidelidad = async (req, res) => {
    const { id } = req.params
    const resultado = ValidacionDatosUsuario.verificarDatosUsuario(req.body)
    if (!resultado.success) return res.status(401).json({ error: resultado.error })
    const usuario = await this.ModeloUsuario.editarPuntosFidelidad({ id, input: resultado })
    if (usuario.error) return res.status(400).json({ error: usuario.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Editar Puntos de Fidelidad',
        descripcion: 'Se editaron puntos de fidelidad del usuario con id : ' + id,
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(usuario.mensaje)
  }

  verClientes = async (req, res) => {
    const clientes = await this.ModeloUsuario.verClientes()
    if (clientes.error) return res.status(400).json({ error: clientes.error })
    return res.status(201).json(clientes)
  }
}
