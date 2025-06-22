import { Router } from 'express'
import { ControladorTicket } from '../controllers/ticket.js'

export const crearRutasTicket = ({ modeloTicket, modeloBitacora }) => {
  const router = Router()
  const controlador = new ControladorTicket({ modeloTicket, modeloBitacora })

  router.get('/mostrar', controlador.ObtenerTickets)
  router.get('/mostrar/:idTicket', controlador.ObtenerDetalleTicket)

  return router
}
