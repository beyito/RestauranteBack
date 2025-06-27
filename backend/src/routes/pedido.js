import { Router } from 'express'
import { ControladorPedido } from '../controllers/pedido.js'

export const crearRutasPedido = ({ modeloPedido, modeloBitacora, modeloInventario }) => {
  const crearRutasPedido = Router()
  const controladorPedido = new ControladorPedido({ modeloPedido, modeloBitacora, modeloInventario })

  // Registrar pedido restringido a solo meseros
  crearRutasPedido.post('/registrar/:idMesero', controladorPedido.registrarPedido)

  // Obtener pedidos por cliente
  crearRutasPedido.get('/cliente/:idCliente', controladorPedido.obtenerPedidoClienteWeb)

  // Obtener pedidos a realizar, restringido a cocineros
  crearRutasPedido.get('/pendientes', controladorPedido.obtenerPedidosPendientes)
  // Obtener pedidos completados de hoy, restringido a cocineros
  crearRutasPedido.get('/completados', controladorPedido.obtenerPedidosCompletadosHoy)
  // actualizar el estado de un pedido
  crearRutasPedido.patch('/estado/:idPedido', controladorPedido.cambiarEstadoPedido)

  /* // Editar pedido
  crearRutasPedido.patch('/editar/:id', controladorPedido.editarPedido)
*/
  // Completar pedido, restringido al cocinero
  // crearRutasPedido.patch('/completar/:id', controladorPedido.completarPedido)
  // Registrar pedido a domicilio, restringido a solo clientes
  crearRutasPedido.post('/registrarPedidoDomicilio/:idCliente', controladorPedido.registrarPedidoDomicilio)
  crearRutasPedido.post('/pagarTicket/:idPedido', controladorPedido.pagarTicket)
  return crearRutasPedido
}
