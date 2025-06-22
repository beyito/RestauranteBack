import { extraerUsuarioDesdeToken } from '../utils/extraerUsuarioDesdeToken.js'
export class ControladorPedido {
  constructor ({ modeloPedido, modeloBitacora }) {
    this.ModeloPedido = modeloPedido
    this.ModeloBitacora = modeloBitacora
  }

  // registrarPedido
  registrarPedido = async (req, res) => {
    const { idMesero } = req.params
    const resultado = await this.ModeloPedido.registrarPedido(idMesero, { mesas: req.body.mesas }, { productos: req.body.productos })
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor,
        accion: 'Registrar Pedido',
        descripcion: 'Registró un pedido',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(resultado)
  }

  // obtenerPedidosPendientes
  obtenerPedidosPendientes = async (req, res) => {
    const resultado = await this.ModeloPedido.obtenerPedidosPendientes()
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    return res.status(200).json(resultado)
  }

  obtenerPedidoClienteWeb = async (req, res) => {
    const { idCliente } = req.params
    const resultado = await this.ModeloPedido.obtenerPedidoClienteWeb(idCliente)
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    return res.status(200).json(resultado)
  }

  // registrarPedidoDomicilio
  registrarPedidoDomicilio = async (req, res) => {
    const { idCliente } = req.params
    const { descuento } = req.body
    console.log(descuento)
    const resultado = await this.ModeloPedido.registrarPedidoDomicilio(idCliente, descuento, req.body.productos)
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    const autor = extraerUsuarioDesdeToken(req)
  console.log(autor)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor,
        accion: 'Registrar Pedido a Domicilio',
        descripcion: 'Registró un pedido a domicilio',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(resultado)
  }
}
