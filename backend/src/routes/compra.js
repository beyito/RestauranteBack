import { Router } from 'express'
import { ControladorCompra } from '../controllers/compra.js'

export const crearRutasCompra = ({ modeloCompra, modeloBitacora }) => {
  const router = Router()
  const controlador = new ControladorCompra({ modeloCompra, modeloBitacora })

  router.post('/crear', controlador.crearCompra)
  router.put('/editar', controlador.editarCompra)
  router.delete('/eliminar', controlador.eliminarCompra)
  router.get('/mostrar', controlador.mostrarCompras)

  return router
}
