import sequelize from '../config/db/config.js'
import { definicionTicket, definicionMetodoPago } from '../services/ticket.js'
import { definicionPedido, definicionDetallePedido, definicionEstado } from '../services/pedido.js'
import { definicionUsuario, definicionEmpleado } from '../services/user.js'
import { definicionProducto } from '../services/producto.js'

export class ModeloTicket {
  static Ticket = sequelize.define('Ticket', definicionTicket, {
    timestamps: false,
    freezeTableName: true
  })

  static Pedido = sequelize.define('Pedido', definicionPedido, {
    timestamps: false,
    freezeTableName: true
  })

  static DetallePedido = sequelize.define('DetallePedido', definicionDetallePedido, {
    timestamps: false,
    freezeTableName: true
  })

  static Producto = sequelize.define('Producto', definicionProducto, {
    timestamps: false,
    freezeTableName: true
  })

  static Estado = sequelize.define('Estado', definicionEstado, {
    timestamps: false,
    freezeTableName: true
  })

  static Usuario = sequelize.define('Usuario', definicionUsuario, {
    timestamps: false,
    freezeTableName: true
  })

  static Empleado = sequelize.define('Empleado', definicionEmpleado, {
    timestamps: false,
    freezeTableName: true
  })

  static MetodoPago = sequelize.define('MetodoPago', definicionMetodoPago, {
    timestamps: false,
    freezeTableName: true
  })

  static asociado = false

  static asociar () {
    if (this.asociado) return
    this.Ticket.belongsTo(this.Pedido, { foreignKey: 'idPedido' })

    this.Pedido.hasMany(this.DetallePedido, { foreignKey: 'idPedido' })
    this.DetallePedido.belongsTo(this.Pedido, { foreignKey: 'idPedido' })

    this.DetallePedido.belongsTo(this.Producto, { foreignKey: 'idProducto' })
    this.Producto.hasMany(this.DetallePedido, { foreignKey: 'idProducto' })

    this.Ticket.belongsTo(this.Estado, { foreignKey: 'idEstado' })

    this.Empleado.belongsTo(this.Usuario, { foreignKey: 'idUsuario', as: 'Usuario' })

    this.Ticket.belongsTo(this.Empleado, { foreignKey: 'idEmpleado', as: 'Empleado' })

    this.Ticket.belongsTo(this.MetodoPago, { foreignKey: 'idMetodoPago' })
    this.MetodoPago.hasMany(this.Ticket, { foreignKey: 'idMetodoPago' })

    this.asociado = true
  }

  static async obtenerTodos () {
    this.asociar()
    try {
      const tickets = await this.Ticket.findAll({
        include: [
          { model: this.Estado, attributes: { exclude: [] } },
          { model: this.MetodoPago, attributes: ['descripcion'] },
          {
            model: this.Empleado,
            as: 'Empleado',
            include: {
              model: this.Usuario,
              as: 'Usuario',
              attributes: ['nombre']
            }
          }
        ],
        order: [['id', 'ASC']]
      })
      // Formatear datos aquí
      return tickets.map(ticket => ({
        id: ticket.id,
        numero: ticket.nro,
        fecha: ticket.fecha,
        monto: ticket.monto,
        estado: ticket.Estado ? ticket.Estado.nombre : null,
        empleado: ticket.Empleado?.Usuario?.nombre || null,
        metodoDePago: ticket.MetodoPago ? ticket.MetodoPago.descripcion : null
      }))
    } catch (error) {
      console.error(error)
      return { error: 'Error al obtener tickets' }
    }
  }

  static async ObtenerDetalleTicket (idTicket) {
    this.asociar()
    try {
      const ticket = await this.Ticket.findByPk(idTicket, {
        include: [
          { model: this.Estado, attributes: ['descripcion'] },
          { model: this.MetodoPago, attributes: ['descripcion'] },
          {
            model: this.Pedido,
            include: [
              {
                model: this.DetallePedido,
                include: {
                  model: this.Producto,
                  attributes: ['nombre']
                }
              }
            ]
          },
          {
            model: this.Empleado,
            as: 'Empleado',
            include: {
              model: this.Usuario,
              as: 'Usuario',
              attributes: ['nombre']
            }
          }
        ]
      })

      if (!ticket) return { error: 'Ticket no encontrado' }

      return {
        id: ticket.id,
        numero: ticket.nro,
        fecha: ticket.fecha,
        hora: ticket.hora,
        monto: ticket.monto,
        estado: ticket.Estado?.descripcion,
        metodoDePago: ticket.MetodoPago?.descripcion,
        empleado: ticket.Empleado?.Usuario?.nombre || null,
        detalles: ticket.Pedido?.DetallePedidos?.map(d => ({
          producto: d.Producto?.nombre,
          cantidad: d.cantidad,
          precio: d.precio,
          subtotal: (d.precio * d.cantidad).toFixed(2)
        }))
      }
    } catch (error) {
      console.error(error)
      return { error: 'Error al obtener detalle del ticket' }
    }
  }
}
