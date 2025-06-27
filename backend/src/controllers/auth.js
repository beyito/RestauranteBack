import { cookieOptions } from '../config/authConfig.js'
import { ValidacionDatosUsuario } from '../utils/validacionDatosUsuario.js'

export class ControladorAuth {
  constructor ({ modeloAuth, modeloBitacora }) {
    this.ModeloAuth = modeloAuth
    this.ModeloBitacora = modeloBitacora
  }

  login = async (req, res) => {
    const resultado = ValidacionDatosUsuario.loginUser(req.body)
    if (!resultado.success) return res.status(401).json({ error: resultado.error })
    const usuario = await this.ModeloAuth.login({ input: resultado })
    if (usuario.error) return res.status(400).json({ error: usuario.error })

    await this.ModeloBitacora.registrarBitacora({
      usuario: usuario.user.nombreUsuario,
      accion: 'Iniciar Sesión',
      descripcion: 'Inició Sesión',
      ip: req.ip.replace('::ffff:', '')
    })
    return res.status(201)
      .cookie('access_token', usuario.nuevoToken, cookieOptions)
      .json(usuario.user)
  }

  register = async (req, res) => {
    const resultado = ValidacionDatosUsuario.registerAuth(req.body)
    if (!resultado.success) return res.status(401).json({ error: resultado.error })
    const nuevoUsuario = await this.ModeloAuth.register({ input: resultado })
    if (nuevoUsuario.error) return res.status(400).json({ error: nuevoUsuario.error })

    await this.ModeloBitacora.registrarBitacora({
      usuario: nuevoUsuario.nombreUsuario,
      accion: 'Registrar Usuario',
      descripcion: 'Se registró un nuevo usuario',
      ip: req.ip.replace('::ffff:', '')
    })
    return res.status(201).json(nuevoUsuario)
  }

  perfil = async (req, res) => {
    const profileUser = await this.ModeloAuth.perfil({ input: req.user })
    if (!profileUser) {
      return res.status(400)
        .json({ error: profileUser.error })
    }
    return res.status(201).json({ user: profileUser.user })
  }
}
