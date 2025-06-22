export class ControladorMetodoPago {
  constructor ({ modeloMetodoPago }) {
    this.ModeloMetodoPago = modeloMetodoPago
  }

  crearMetodoPago = async (req, res) => {
    const resultado = await this.ModeloMetodoPago.crearMetodoPago(req.body)
    if (resultado.error) return res.status(400).json({ error: resultado.error })
    return res.json({ clientSecret: resultado })
  }

  consultarMetodosPago = async (req, res) => {
    const metodosPago = await this.ModeloMetodoPago.consultarMetodosPago()
    if (metodosPago.error) return res.status(400).json({ error: metodosPago.error })
    return res.status(200).json(metodosPago)
  }

  consultarMetodoPagoPorId = async (req, res) => {
    const { id } = req.params
    const metodoPago = await this.ModeloMetodoPago.consultarMetodoPagoPorId(id)
    if (metodoPago.error) return res.status(400).json({ error: metodoPago.error })
    return res.status(200).json(metodoPago)
  }
}
