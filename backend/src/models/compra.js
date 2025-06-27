import sequelize from '../config/db/config.js'
import { definicionCompra, definicionDetalleCompra, definicionDetalleCompraBebida } from '../services/compra.js'
import { definicionProducto } from '../services/producto.js'
import definicionProveedor from '../services/provider.js'
import { definicionIngrediente } from '../services/pedido.js'

export class ModeloCompra {
  static Compra = sequelize.define('Compra', definicionCompra, {
    timestamps: false,
    freezeTableName: true
  })

  static DetalleCompra = sequelize.define('DetalleCompra', definicionDetalleCompra, {
    timestamps: false,
    freezeTableName: true
  })

  static DetalleCompraBebida = sequelize.define('DetalleCompraBebida', definicionDetalleCompraBebida, {
    timestamps: false,
    freezeTableName: true
  })

  static Producto = sequelize.define('Producto', definicionProducto, {
    timestamps: false,
    freezeTableName: true
  })

  static Proveedor = sequelize.define('Proveedor', definicionProveedor, {
    timestamps: false,
    freezeTableName: true
  })

  static Ingrediente = sequelize.define('Ingrediente', definicionIngrediente, {
    timestamps: false,
    freezeTableName: true
  })

  static asociar () {
    this.Compra.hasMany(this.DetalleCompra, {
      foreignKey: 'idCompra',
      sourceKey: 'id'
    })

    this.DetalleCompra.belongsTo(this.Compra, {
      foreignKey: 'idCompra',
      targetKey: 'id'
    })

    this.Compra.hasMany(this.DetalleCompraBebida, {
      foreignKey: 'idCompra',
      sourceKey: 'id'
    })

    this.DetalleCompraBebida.belongsTo(this.Compra, {
      foreignKey: 'idCompra',
      targetKey: 'id'
    })

    this.Producto.hasMany(this.DetalleCompraBebida, {
      foreignKey: 'idProducto',
      sourceKey: 'id'
    })

    this.DetalleCompraBebida.belongsTo(this.Producto, {
      foreignKey: 'idProducto',
      targetKey: 'id'
    })

    this.Ingrediente.hasMany(this.DetalleCompra, {
      foreignKey: 'idIngrediente',
      sourceKey: 'id'
    })

    this.DetalleCompra.belongsTo(this.Ingrediente, {
      foreignKey: 'idIngrediente',
      targetKey: 'id'
    })

    this.Compra.belongsTo(this.Proveedor, {
      foreignKey: 'idproveedor',
      targetKey: 'id'
    })

    this.Proveedor.hasMany(this.Compra, {
      foreignKey: 'idproveedor',
      sourceKey: 'id'
    })
  }

  // Registrar Compra
  static async crearCompra ({ input }) {
    const { fecha, idproveedor, idUsuario, ingredientes = [], bebidas = [] } = input
    try {
      const nuevaCompra = await this.Compra.create({ fecha, idproveedor, idUsuario })
      const idCompra = nuevaCompra.id

      if (ingredientes.length > 0) {
        for (const { idIngrediente, cantidad, precio } of ingredientes) {
          await this.DetalleCompra.create({
            idCompra,
            idIngrediente,
            cantidad,
            precio
          })
        }
      }

      if (bebidas.length > 0) {
        for (const { idProducto, cantidad, precio } of bebidas) {
          await this.DetalleCompraBebida.create({
            idCompra,
            idProducto,
            cantidad,
            precio
          })
        }
      }
      return {
        mensaje: 'Compra registrada exitosamente',
        compra: nuevaCompra
      }
    } catch (error) {
      console.error('Error al registrar la compra:', error)
      return {
        error: 'Error al registrar la compra',
        detalles: error.message
      }
    }
  }

  // Editar Compra
  static async editarCompra ({ input }) {
    const { id, fecha, idproveedor, idUsuario, ingredientes = [], bebidas = [] } = input
    try {
      const compra = await this.Compra.findByPk(id)
      if (!compra) return { error: 'Compra no encontrada' }

      await compra.update({ fecha, idproveedor, idUsuario })

      // Reemplazar los detalles
      await this.DetalleCompra.destroy({ where: { idCompra: id } })
      await this.DetalleCompraBebida.destroy({ where: { idCompra: id } })

      await this.DetalleCompra.bulkCreate(
        ingredientes.map(({ idIngrediente, cantidad, precio }) => ({
          idCompra: id,
          idIngrediente,
          cantidad,
          precio
        }))
      )

      await this.DetalleCompraBebida.bulkCreate(
        bebidas.map(({ idProducto, cantidad, precio }) => ({
          idCompra: id,
          idProducto,
          cantidad,
          precio
        }))
      )

      return { mensaje: 'Compra editada exitosamente' }
    } catch (error) {
      return {
        error: 'Error al editar la compra',
        detalles: error.message
      }
    }
  }

  // eliminarCompra
  static async eliminarCompra ({ input }) {
    const { id } = input
    try {
      await this.DetalleCompra.destroy({ where: { idCompra: id } })
      await this.DetalleCompraBebida.destroy({ where: { idCompra: id } })

      const eliminados = await this.Compra.destroy({ where: { id } })
      if (eliminados === 0) return { error: 'Compra no encontrada para eliminar' }

      return { mensaje: 'Compra eliminada exitosamente' }
    } catch (error) {
      return {
        error: 'Error al eliminar la compra',
        detalles: error.message
      }
    }
  }

  // mostrar compras
  static async mostrarCompras () {
    try {
      const compras = await this.Compra.findAll({
        include: [
          {
            model: this.Proveedor,
            attributes: ['nombre', 'telefono', 'correo', 'direccion']
          },
          {
            model: this.DetalleCompra,
            include: [{
              model: this.Ingrediente,
              attributes: ['nombre']
            }]
          },
          {
            model: this.DetalleCompraBebida,
            include: [{
              model: this.Producto,
              attributes: ['nombre']
            }]
          }
        ]
      })

      return compras
    } catch (error) {
      return {
        error: 'Error al mostrar las compras',
        detalles: error.message
      }
    }
  }
}

ModeloCompra.asociar()
