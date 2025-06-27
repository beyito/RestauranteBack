import { Router } from 'express'
import { ControladorDescuento } from '../controllers/descuento.js'

export const crearRutaDescuento = ({ modeloDescuento, modeloBitacora }) => {
  const router = Router()
  const controlador = new ControladorDescuento({ modeloDescuento, modeloBitacora })

  router.post('/crear', controlador.crearDescuento)
  router.put('/editar', controlador.editarDescuento)
  router.delete('/eliminar/:id', controlador.eliminarDescuento)

  router.get('/mostrar', controlador.obtenerDescuentos)
  router.post('/canjear/:idUsuario', controlador.registrarDescuento)
  router.get('/obtenerPuntosFidelidad/:idUsuario', controlador.obtenerPuntosFidelidad)
  router.get('/obtenerDescuentosObtenidosSinCanjear/:idUsuario', controlador.obtenerDescuentosObtenidosSinCanjear)

  return router
}
