import { Router } from 'express'
import { ControladorMetodoPago } from '../controllers/metodoPago.js'

export const crearRutaMetodoPago = ({ modeloMetodoPago }) => {
  const rutaMetodoPago = Router()
  const controladorMetodoPago = new ControladorMetodoPago({ modeloMetodoPago })

  rutaMetodoPago.post('/crear', controladorMetodoPago.crearMetodoPago)
  rutaMetodoPago.get('/consultar', controladorMetodoPago.consultarMetodosPago)
  rutaMetodoPago.get('/consultar/:id', controladorMetodoPago.consultarMetodoPagoPorId)

  return rutaMetodoPago
}
