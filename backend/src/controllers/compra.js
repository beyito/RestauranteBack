import { extraerUsuarioDesdeToken } from '../utils/extraerUsuarioDesdeToken.js'
export class ControladorCompra {
  constructor ({ modeloCompra, modeloBitacora }) {
    this.modeloCompra = modeloCompra
    this.modeloBitacora = modeloBitacora
  }

  crearCompra = async (req, res) => {
    const compra = await this.modeloCompra.crearCompra({ input: req.body })
    if (compra.error) return res.status(400).json({ error: compra.error })

    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.modeloBitacora.registrarBitacora({
        usuario: autor,
        accion: 'Crear Compra',
        descripcion: 'Creó una compra',
        ip: req.ip.replace('::ffff:', '')
      })
    }

    return res.status(201).json(compra)
  }

  editarCompra = async (req, res) => {
    const compra = await this.modeloCompra.editarCompra({ input: req.body })
    if (compra.error) return res.status(400).json({ error: compra.error })

    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.modeloBitacora.registrarBitacora({
        usuario: autor,
        accion: 'Editar Compra',
        descripcion: 'Editó una compra',
        ip: req.ip.replace('::ffff:', '')
      })
    }

    return res.status(200).json(compra)
  }

  eliminarCompra = async (req, res) => {
    const compra = await this.modeloCompra.eliminarCompra({ input: req.body })
    if (compra.error) return res.status(400).json({ error: compra.error })

    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.modeloBitacora.registrarBitacora({
        usuario: autor,
        accion: 'Eliminar Compra',
        descripcion: 'Eliminó una compra',
        ip: req.ip.replace('::ffff:', '')
      })
    }

    return res.status(200).json(compra)
  }

  mostrarCompras = async (req, res) => {
    const compras = await this.modeloCompra.mostrarCompras()
    if (compras.error) return res.status(400).json({ error: compras.detalles })

    return res.status(200).json(compras)
  }
}
