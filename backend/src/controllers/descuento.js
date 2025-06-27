import { extraerUsuarioDesdeToken } from '../utils/extraerUsuarioDesdeToken.js'

export class ControladorDescuento {
  constructor ({ modeloDescuento, modeloBitacora }) {
    this.ModeloDescuento = modeloDescuento
    this.ModeloBitacora = modeloBitacora
  }

  // Obtener puntoFidelidad de un cliente
  obtenerPuntosFidelidad = async (req, res) => {
    const { idUsuario } = req.params
    try {
      const puntos = await this.ModeloDescuento.obtenerPuntosFidelidad(idUsuario)
      if (puntos === null) {
        return res.status(404).json({ error: 'Cliente no encontrado o sin puntos' })
      }
      return res.status(200).json({ puntosFidelidad: puntos })
    } catch (error) {
      console.error('Error al obtener puntos de fidelidad:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // Registrar un descuento con código, usuario y estado
  registrarDescuento = async (req, res) => {
    const { idDescuento, codigo, idEstado } = req.body
    const { idUsuario } = req.params

    // Validar campos obligatorios
    if (!idDescuento || !codigo || !idEstado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: idDescuento, codigo, idEstado' })
    }

    try {
      const resultado = await this.ModeloDescuento.registrarDescuento(
        idDescuento,
        idUsuario,
        codigo,
        idEstado
      )
      if (resultado.error) {
        return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
      }

      const autor = extraerUsuarioDesdeToken(req)
      if (autor) {
        await this.ModeloBitacora.registrarBitacora({
          usuario: autor.nombreUsuario,
          accion: 'Registrar Código Descuento',
          descripcion: `Se registró un código de descuento: ${codigo} para el usuario ${idUsuario}`,
          ip: req.ip.replace('::ffff:', '')
        })
      }

      return res.status(201).json({ mensaje: 'Código de descuento registrado', resultado })
    } catch (error) {
      console.error('Error en registrarDescuento:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // Crear un nuevo descuento
  crearDescuento = async (req, res) => {
    const resultado = await this.ModeloDescuento.crearDescuento({ input: req.body })
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor,
        accion: 'Crear Descuento',
        descripcion: 'Se creó un descuento de:' + req.body.descuento,
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(201).json(resultado)
  }

  // Editar un descuento existente
  editarDescuento = async (req, res) => {
    const { id, costoFidelidad } = req.body
    const resultado = await this.ModeloDescuento.editarDescuento(id, costoFidelidad)
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })

    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor,
        accion: 'Editar Descuento',
        descripcion: 'Se editó el descuento con id: ' + req.body.id,
        ip: req.ip.replace('::ffff:', '')
      })
    }
    return res.status(200).json(resultado)
  }

  // Eliminar un descuento
  eliminarDescuento = async (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' })

    const resultado = await this.ModeloDescuento.eliminarDescuento({ input: { id } })

    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })

    const autor = extraerUsuarioDesdeToken(req)
    if (autor) {
      await this.ModeloBitacora.registrarBitacora({
        usuario: autor.nombreUsuario,
        accion: 'Eliminar Descuento',
        descripcion: 'Se eliminó el descuento con id: ' + id,
        ip: req.ip.replace('::ffff:', '')
      })
    }

    return res.status(200).json(resultado)
  }

  // Obtener todos los descuentos
  obtenerDescuentos = async (req, res) => {
    const resultado = await this.ModeloDescuento.obtenerDescuentos()
    if (resultado.error) {
      return res.status(400).json({
        error: resultado.error,
        detalles: resultado.detalles
      })
    }
    return res.status(200).json(resultado)
  }

  // Obtener descuentos obtenidos por un usuario sin canjear
  obtenerDescuentosObtenidosSinCanjear = async (req, res) => {
    const { idUsuario } = req.params
    console.log('ID de usuario:', idUsuario)
    const resultado = await this.ModeloDescuento.obtenerDescuentosObtenidosSinCanjear(idUsuario)
    if (resultado.error) return res.status(400).json({ error: resultado.error, detalles: resultado.detalles })
    return res.status(200).json(resultado)
  }
}
