import { Router } from 'express'
import { ControladorMetodoPago } from '../controllers/metodoPago.js'

export const crearRutaMetodoPago = ({ modeloMetodoPago, modeloBitacora }) => {
  const rutaMetodoPago = Router()
  const controladorMetodoPago = new ControladorMetodoPago({ modeloMetodoPago, modeloBitacora })

  rutaMetodoPago.post('/crear', controladorMetodoPago.crearMetodoPago)
  rutaMetodoPago.get('/consultar/:email', controladorMetodoPago.consultarPagosPorEmail)

  return rutaMetodoPago
}
