import { extraerUsuarioDesdeToken } from '../utils/extraerUsuarioDesdeToken.js'
export class ControladorRecetas {
  constructor ({ modeloReceta, modeloBitacora }) {
    this.modeloReceta = modeloReceta
    this.ModeloBitacora = modeloBitacora
  }

  crearReceta = async (req, res) => {
    const receta = await this.modeloReceta.crearReceta({ input: req.body })
    if (receta.error) return res.status(400).json({ error: receta.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Crear Receta',
        descripcion: 'Creó una receta',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(receta)
  }

  editarReceta = async (req, res) => {
    const receta = await this.modeloReceta.editarReceta({ input: req.body })
    if (receta.error) return res.status(400).json({ error: receta.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Editar Receta',
        descripcion: 'Editó una receta',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(200).json(receta)
  }

  eliminarReceta = async (req, res) => {
    const { idProducto } = req.body
    const receta = await this.modeloReceta.eliminarReceta({ idProducto })
    if (receta.error) return res.status(400).json({ error: receta.error })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Eliminar Receta',
        descripcion: 'Eliminó una receta',
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(200).json(receta)
  }

  mostrarRecetaPorProducto = async (req, res) => {
    const receta = await this.modeloReceta.mostrarRecetaPorProducto()
    if (receta.error) return res.status(400).json({ error: receta.detalles })
    return res.status(200).json(receta)
  }

  mostrarRecetaPorIdProducto = async (req, res) => {
    try {
      const { idProducto } = req.params
      if (!idProducto || isNaN(Number(idProducto))) {
        return res.status(400).json({ error: 'ID de producto inválido' })
      }
      const receta = await this.modeloReceta.mostrarRecetaPorIdProducto({ idProducto })
      if (!receta || receta.length === 0) {
        return res.status(404).json({ error: 'No se encontró receta para este producto' })
      }
      return res.status(200).json(receta)
    } catch (error) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}
