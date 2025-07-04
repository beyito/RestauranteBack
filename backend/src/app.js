import express, { json } from 'express'
import { PORT } from './config/config.js'
import { db } from './connection.js'

import { crearAuthRutas } from './routes/auth.js'

import { crearRutasRoles } from './routes/roles.js'
import { crearRutasPermisos } from './routes/permisos.js'
import { crearRutasInventario } from './routes/inventario.js'
import { crearProveedorRutas } from './routes/provider.js'
import { crearRutaAdministrador } from './routes/administrador.js'
import { crearRutaUsuarios } from './routes/usuario.js'
import { crearRutasPedido } from './routes/pedido.js'
import { crearRutasReservas } from './routes/reservas.js'
import { crearMenuRutas } from './routes/menu.js' //
import { crearRutasReceta } from './routes/receta.js'
import { crearRutasProducto } from './routes/producto.js'
import { crearRutaIngrediente } from './routes/ingrediente.js'
import { crearRutasTicket } from './routes/ticket.js'
import { crearRutasCompra } from './routes/compra.js'
import cookieParser from 'cookie-parser'
import { PALABRA_SECRETA } from './config/authConfig.js'
import { Token } from './utils/authToken.js'
import { crearRutaMetodoPago } from './routes/metodoPago.js'
import { corsMiddleware } from '../middleware/cors.js'
import { crearRutaDescuento } from './routes/descuento.js'

export const CreateApp = async ({
  modeloAuth, modeloAdministrador,
  modeloProveedor, modeloMenu,
  modeloUsuario, modeloRol,
  modeloPermiso, modeloInventario,
  modeloReserva, modeloReceta,
  modeloProducto, modeloIngrediente,
  modeloPedido, modeloBitacora,
  modeloMetodoPago, modeloTicket,
  modeloCompra,
  modeloDescuento
}) => {
  const app = express()

  const token = new Token(PALABRA_SECRETA)
  modeloAuth.token = token

  app.use(corsMiddleware())

  app.use(cookieParser())
  app.use(json())

  db()

  app.get('/', (req, res) => {
    res.send('¡Servidor activo en Render!')
  })

  app.use('/auth', crearAuthRutas({ modeloAuth, modeloBitacora }))
  app.use('/user', crearRutaUsuarios({ modeloUsuario, modeloBitacora })) // Hecho
  app.use('/admin', crearRutaAdministrador({ modeloAdministrador, token, modeloBitacora }))
  app.use('/permisos', crearRutasPermisos({ modeloPermiso, modeloBitacora })) // Hecho
  app.use('/roles', crearRutasRoles({ modeloRol, modeloBitacora })) // Hecho

  app.use('/inventario', crearRutasInventario({ modeloInventario, modeloBitacora })) // Hecho
  app.use('/proveedor', crearProveedorRutas({ modeloProveedor, modeloBitacora })) // Hecho

  app.use('/productos', crearRutasProducto({ modeloProducto, modeloBitacora })) // Haciendo, Ciclo 3
  app.use('/ingredientes', crearRutaIngrediente({ modeloIngrediente, modeloBitacora })) // Hecho

  app.use('/menus', crearMenuRutas({ modeloMenu, modeloBitacora })) // Hecho
  app.use('/pedido', crearRutasPedido({ modeloPedido, modeloBitacora, modeloInventario })) // Hecho
  app.use('/reservas', crearRutasReservas({ modeloReserva, modeloBitacora })) // Hecho
  app.use('/recetas', crearRutasReceta({ modeloReceta, modeloBitacora })) // Hecho
  app.use('/compra', crearRutasCompra({ modeloCompra, modeloBitacora }))

  app.use('/metodoPago', crearRutaMetodoPago({ modeloMetodoPago, modeloBitacora })) // Hecho
  app.use('/ticket', crearRutasTicket({ modeloTicket, modeloBitacora }))
  app.use('/descuentos', crearRutaDescuento({ modeloDescuento, modeloBitacora }))

  app.listen(PORT, () => {
    console.log('servidor activo en el puerto:', PORT)
  })
}
