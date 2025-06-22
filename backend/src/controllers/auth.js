import { ValidacionDatosUsuario } from '../utils/validacionDatosUsuario.js'

export class ControladorAuth {
  constructor ({ modeloAuth }) {
    this.ModeloAuth = modeloAuth
  }

  login = async (req, res) => {
    const resultado = ValidacionDatosUsuario.loginUser(req.body)
    if (!resultado.success) return res.status(401).json({ error: resultado.error })

    const usuario = await this.ModeloAuth.login({ input: resultado })
    if (usuario.error) return res.status(400).json({ error: usuario.error })
    return res.status(200).json({
      user: usuario.user,
      token: usuario.nuevoToken // ✅ ahora lo mandas explícitamente
    })
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
