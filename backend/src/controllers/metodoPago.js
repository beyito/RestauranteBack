import { extraerUsuarioDesdeToken } from '../utils/extraerUsuarioDesdeToken.js'

export class ControladorMetodoPago {
  constructor ({ modeloMetodoPago, modeloBitacora }) {
    this.ModeloMetodoPago = modeloMetodoPago
    this.ModeloBitacora = modeloBitacora
  }

  crearMetodoPago = async (req, res) => {
    const resultado = await this.ModeloMetodoPago.crearMetodoPago(req.body)
    if (resultado.error) return res.status(400).json({ error: resultado.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Método de Pago',
        descripcion: 'Se creó un nuevo método de pago',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.json({ clientSecret: resultado })
  }

  consultarPagosPorEmail = async (req, res) => {
    const { email } = req.params
    const pagos = await this.ModeloMetodoPago.obtenerPagosPorEmail(email)
    if (pagos.error) return res.status(400).json({ error: pagos.error })
    return res.status(200).json(pagos)
  }

  consultarMetodoPagoPorId = async (req, res) => {
    const { id } = req.params
    const metodoPago = await this.ModeloMetodoPago.consultarMetodoPagoPorId(id)
    if (metodoPago.error) return res.status(400).json({ error: metodoPago.error })
    return res.status(200).json(metodoPago)
  }
}
