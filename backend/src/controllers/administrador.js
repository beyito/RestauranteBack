export class ControladorAdministrador {
  constructor ({ modeloAdministrador, modeloBitacora }) {
    this.modeloAdministrador = modeloAdministrador
    this.modeloBitacora = modeloBitacora
  }

  adminDashboard = (req, res) => {
    const usuario = req.user
    res.json({
      mensaje: `Bienvenido, administrador ${usuario.nombreUsuario}`,
      datos: {
        id: usuario.id,
        rol: usuario.rol
      }
    })
  }

  consultarBitacora = async (req, res) => {
    const bitacora = await this.modeloBitacora.consultarBitacora()
    if (bitacora.error) return res.status(400).json({ error: bitacora.error })
    return res.status(200).json(bitacora)
  }
}
