import { extraerUsuarioDesdeToken } from '../utils/extraerUsuarioDesdeToken.js'
import nodemailer from 'nodemailer'
export class ControladorPedido {
  constructor ({ modeloPedido, modeloBitacora, modeloInventario }) {
    this.ModeloPedido = modeloPedido
    this.ModeloBitacora = modeloBitacora
    this.ModeloInventario = modeloInventario
  }

  // registrarPedido
  registrarPedido = async (req, res) => {
    const { idMesero } = req.params
    console.log(req.body)
    console.log(idMesero)
    const resultado = await this.ModeloPedido.registrarPedido(idMesero, { mesas: req.body.mesas }, { productos: req.body.productos })
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Registrar Pedido',
        descripcion: 'Registró un pedido',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    // revisar stock de los productos y en caso de stock bajo enviar notificacion
    const productosConStockBajo = await this.ModeloInventario.obtenerProductosConStockBajo()
    console.log('Productos con stock bajo:', productosConStockBajo)
    if (productosConStockBajo.length > 0) {
      console.log('Productos con stock bajo:', productosConStockBajo)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        // port: 2525,
        auth: {
          user: 'cobubenjamin898@gmail.com', // usuario
          pass: 'pfzp gdio adjm ezzm' // contraseña de aplicaicon
        }
      })

      const contenido = productosConStockBajo.map(p =>
      `• ${p.descripcion} (Stock actual: ${p.stockActual}, Mínimo requerido: ${p.stockMinimo})`
      ).join('\n')

      try {
        await transporter.sendMail({
          from: 'inventario@sistema.com',
          to: 'cobubenjamin898@gmail.com',
          subject: '⚠️ Alerta: Productos con Stock Bajo',
          text: `Los siguientes productos tienen el stock por debajo del mínimo:\n\n${contenido}`
        })
        console.log('Correo enviado correctamente')
      } catch (mailError) {
        console.error('Error enviando correo:', mailError)
      }
    }
    console.log('RESULTADO: ', resultado)
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
    console.log(req.body.productos)
    const resultado = await this.ModeloPedido.registrarPedidoDomicilio(idCliente, descuento, req.body.productos)
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Registrar Pedido a Domicilio',
        descripcion: 'Registró un pedido a domicilio',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    // revisar stock de los productos y en caso de stock bajo enviar notificacion
    const productosConStockBajo = await this.ModeloInventario.obtenerProductosConStockBajo()
    console.log('Productos con stock bajo:', productosConStockBajo)
    if (productosConStockBajo.length > 0) {
      console.log('Productos con stock bajo:', productosConStockBajo)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        // port: 2525,
        auth: {
          user: 'cobubenjamin898@gmail.com', // usuario
          pass: 'pfzp gdio adjm ezzm' // contraseña de aplicaicon
        }
      })

      const contenido = productosConStockBajo.map(p =>
      `• ${p.descripcion} (Stock actual: ${p.stockActual}, Mínimo requerido: ${p.stockMinimo})`
      ).join('\n')

      try {
        await transporter.sendMail({
          from: 'inventario@sistema.com',
          to: 'cobubenjamin898@gmail.com',
          subject: '⚠️ Alerta: Productos con Stock Bajo',
          text: `Los siguientes productos tienen el stock por debajo del mínimo:\n\n${contenido}`
        })
        console.log('Correo enviado correctamente')
      } catch (mailError) {
        console.error('Error enviando correo:', mailError)
      }
    }
    console.log('RESULTADO: ', resultado.idPedido)
    return res.status(201).json(resultado.idPedido)
  }

  pagarTicket = async (req, res) => {
    const { idPedido } = req.params
    const { idMetodoPago } = req.body
    const resultado = await this.ModeloPedido.pagarTicket(idPedido, idMetodoPago)
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Pagar Ticket',
        descripcion: 'Pagó el ticket con id de Pedido : ' + idPedido,
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(200).json(resultado)
  }

  // obtenerPedidosCompletados de la fecha actual
  obtenerPedidosCompletadosHoy = async (req, res) => {
    const resultado = await this.ModeloPedido.obtenerPedidosCompletadosHoy()
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    return res.status(200).json(resultado)
  }

  // cambniar estado de un pedido
  cambiarEstadoPedido = async (req, res) => {
    const { idPedido } = req.params
    const { nuevoEstado } = req.body
    const resultado = await this.ModeloPedido.actualizarEstadoPedido(idPedido, nuevoEstado)
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    return res.status(200).json(resultado)
  }
}
