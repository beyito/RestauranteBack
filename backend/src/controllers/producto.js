import { extraerUsuarioDesdeToken } from '../utils/extraerUsuarioDesdeToken.js'
export class ControladorProducto {
  constructor ({ modeloProducto, modeloBitacora }) {
    this.modeloProducto = modeloProducto
    this.modeloBitacora = modeloBitacora
  }

  crearProducto = async (req, res) => {
    try {
      const producto = await this.modeloProducto.crearProducto({ input: req.body })
      if (producto.error) return res.status(400).json({ error: producto.error })
      const autor = extraerUsuarioDesdeToken(req)
      if (autor) {
        await this.ModeloBitacora.registrarBitacora({
          usuario: autor.nombreUsuario,
          accion: 'Crear Producto',
          descripcion: 'Creó el producto : ' + producto.nombre,
          ip: req.ip.replace('::ffff:', '')
        })
      }
      return res.status(201).json(producto)
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  editarProducto = async (req, res) => {
    try {
      const producto = await this.modeloProducto.editarProducto({ input: req.body })
      if (producto.error) return res.status(400).json({ error: producto.error })
      const autor = extraerUsuarioDesdeToken(req)
      if (autor) {
        await this.ModeloBitacora.registrarBitacora({
          usuario: autor.nombreUsuario,
          accion: 'Editar Producto',
          descripcion: 'Editó el producto : ' + producto.nombre,
          ip: req.ip.replace('::ffff:', '')
        })
      }
      return res.status(200).json(producto)
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  eliminarProducto = async (req, res) => {
    try {
      const { id } = req.params
      if (!id || isNaN(Number(id))) return res.status(400).json({ error: 'ID de producto no válido' })
      const resultado = await this.modeloProducto.eliminarProducto(id)
      if (resultado.error) return res.status(400).json({ error: resultado.error })
      const autor = extraerUsuarioDesdeToken(req)
      if (autor) {
        await this.ModeloBitacora.registrarBitacora({
          usuario: autor.nombreUsuario,
          accion: 'Eliminar Producto',
          descripcion: 'Eliminó el producto con id: ' + id,
          ip: req.ip.replace('::ffff:', '')
        })
      }
      return res.status(200).json(resultado)
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  obtenerProductos = async (req, res) => {
    const { tipo } = req.query
    const productos = await this.modeloProducto.ObtenerProductos({ tipo })
    if (productos.error) return res.status(401).json({ error: productos.error })
    return res.status(201).json({ producto: productos })
  }

  obtenerProductoPorId = async (req, res) => {
    try {
      const { id } = req.params
      if (!id || isNaN(Number(id))) return res.status(400).json({ error: 'ID de producto no válido' })
      const producto = await this.modeloProducto.obtenerProductoPorId(id)
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' })
      return res.status(200).json(producto)
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener el producto' })
    }
  }
}
