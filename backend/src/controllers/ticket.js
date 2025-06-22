import { extraerUsuarioDesdeToken } from '../utils/extraerUsuarioDesdeToken.js'

export class ControladorTicket {
  constructor ({ modeloTicket, modeloBitacora }) {
    this.ModeloTicket = modeloTicket
    this.ModeloBitacora = modeloBitacora
  }

  ObtenerTickets = async (req, res) => {
    const tickets = await this.ModeloTicket.obtenerTodos()
    if (tickets.error) return res.status(400).json({ error: tickets.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor,
        accion: 'Obtener Tickets',
        descripcion: 'Obtuvo tickets',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(tickets)
  }

  ObtenerDetalleTicket = async (req, res) => {
    const ticket = await this.ModeloTicket.ObtenerDetalleTicket(req.params.idTicket)
    if (ticket.error) return res.status(400).json({ error: ticket.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor,
        accion: 'Obtener Detalle Ticket',
        descripcion: 'Obtuvo detalle del ticket',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(ticket)
  }
}
