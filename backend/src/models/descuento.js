import sequelize from '../config/db/config.js'
import { definicionDescuento, definicionDetalleDescuento } from '../services/descuento.js'
import { definicionClienteWeb } from '../services/user.js'
import { definicionPedido, definicionEstado } from '../services/pedido.js'

export class ModeloDescuento {
  static Descuento = sequelize.define('Descuento', definicionDescuento, {
    timestamps: false,
    freezeTableName: true
  })

  static DetalleDescuento = sequelize.define('DetalleDescuento', definicionDetalleDescuento, {
    timestamps: false,
    freezeTableName: true
  })

  static ClienteWeb = sequelize.define('ClienteWeb', definicionClienteWeb, {
    timestamps: false,
    freezeTableName: true
  })

  static Pedido = sequelize.define('Pedido', definicionPedido, {
    timestamps: false,
    freezeTableName: true
  })

  static Estado = sequelize.define('Estado', definicionEstado, {
    timestamps: false,
    freezeTableName: true
  })

  static asociar = () => {
    this.Descuento.hasMany(this.DetalleDescuento, {
      foreignKey: 'idDescuento'
    })

    this.ClienteWeb.hasMany(this.DetalleDescuento, {
      foreignKey: 'idUsuario'
    })

    this.Estado.hasMany(this.DetalleDescuento, {
      foreignKey: 'idEstado'
    })

    this.DetalleDescuento.belongsTo(this.Descuento, {
      foreignKey: 'idDescuento'
    })

    this.DetalleDescuento.belongsTo(this.ClienteWeb, {
      foreignKey: 'idUsuario'
    })

    this.DetalleDescuento.belongsTo(this.Estado, {
      foreignKey: 'idEstado'
    })

    // Asociación para saber qué pedido usa qué descuento
    this.Descuento.hasMany(this.Pedido, {
      foreignKey: 'idDescuento'
    })

    this.Pedido.belongsTo(this.Descuento, {
      foreignKey: 'idDescuento'
    })
  }

  static async crearDescuento ({ input }) {
    try {
      const nuevo = await this.Descuento.create(input)
      return { mensaje: 'Descuento creado', descuento: nuevo }
    } catch (error) {
      return { error: 'Error al crear descuento', detalles: error.message }
    }
  }

  // Editar descuento solo edita los costo de PuntosFidelidad
  static async editarDescuento (id, costoFidelidad) {
    try {
      const encontrado = await this.Descuento.findByPk(id)
      if (!encontrado) return { error: 'Descuento no encontrado' }

      await encontrado.update({ costoFidelidad })

      return { mensaje: 'Descuento editado', descuento: encontrado }
    } catch (error) {
      return { error: 'Error al editar descuento', detalles: error.message }
    }
  }

  static async eliminarDescuento ({ input }) {
    try {
      const yaCanjeado = await this.DetalleDescuento.findOne({
        where: {
          idDescuento: input.id
        }
      })

      if (yaCanjeado) {
        return {
          error: 'No se puede eliminar un descuento que ya fue canjeado'
        }
      }

      const resultado = await this.Descuento.destroy({ where: { id: input.id } })
      if (resultado === 0) {
        return { error: 'Descuento no encontrado' }
      }
      return { mensaje: 'Descuento eliminado correctamente' }
    } catch (error) {
      return { error: 'Error al eliminar descuento', detalles: error.message }
    }
  }

  static async obtenerDescuentos () {
    try {
      const descuentos = await this.Descuento.findAll({
        attributes: ['id', 'descuento', 'costoFidelidad']
      })
      return { descuentos }
    } catch (error) {
      return {
        error: 'Error al obtener descuentos',
        detalles: error.message
      }
    }
  }

  static async obtenerDescuentosObtenidosSinCanjear (idUsuario) {
    try {
      const resultados = await this.DetalleDescuento.findAll({
        where: {
          idUsuario,
          idEstado: 2 // o el ID que represente "no canjeado"
        },
        attributes: ['codigo'],
        include: [
          {
            model: this.Descuento,
            attributes: ['descuento'] // esto trae el porcentaje
          }
        ]
      })

      return resultados.map(r => ({
        codigo: r.codigo,
        descuento: r.Descuento.descuento
      }))
    } catch (error) {
      console.error('Error al obtener códigos no canjeados:', error)
      throw error
    }
  }

  static async registrarDescuento (idDescuento, idUsuario, codigo, idEstado) {
    console.log('idDescuento', idDescuento, 'idUsuario', idUsuario, 'codigo', codigo, 'idEstado', idEstado)
    try {
      const registroExistente = await this.DetalleDescuento.findOne({ where: { codigo } })
      const descuento = await this.Descuento.findOne({ where: { id: idDescuento } })

      if (!descuento) {
        return { error: 'Descuento no encontrado' }
      }
      const cliente = await this.ClienteWeb.findOne({ where: { idUsuario } })
      if (!cliente) {
        return { error: 'Cliente no encontrado' }
      }

      if (registroExistente) {
        if (registroExistente.idEstado === 1) {
          return { error: 'El código ya ha sido canjeado' }
        } else if (registroExistente.idEstado === 2) {
          await registroExistente.update({ idDescuento, idUsuario, idEstado })
          if (idEstado === 2) {
            await cliente.update({
              puntosFidelidad: cliente.puntosFidelidad - descuento.costoFidelidad
            })
          }
          return { mensaje: 'Código actualizado correctamente', registro: registroExistente }
        }
      }

      const nuevoRegistro = await this.DetalleDescuento.create({ idDescuento, idUsuario, codigo, idEstado })
      if (idEstado === 2) {
        await cliente.update({
          puntosFidelidad: cliente.puntosFidelidad - descuento.costoFidelidad
        })
      }

      return { mensaje: 'Código registrado correctamente', registro: nuevoRegistro }
    } catch (error) {
      console.error('Error en registrarDescuento:', error)
      return {
        error: 'Error al registrar código de descuento',
        detalles: error.message
      }
    }
  }

  static async obtenerPuntosFidelidad (idUsuario) {
    try {
      const [result] = await sequelize.query(
        'SELECT puntosFidelidad FROM ClienteWeb WHERE idUsuario = :idUsuario',
        {
          replacements: { idUsuario },
          type: sequelize.QueryTypes.SELECT
        }
      )
      if (!result) {
        return null // no encontrado
      }
      return result.puntosFidelidad
    } catch (error) {
      console.error('Error en obtenerPuntosFidelidad:', error)
      throw error
    }
  }
}

ModeloDescuento.asociar()
