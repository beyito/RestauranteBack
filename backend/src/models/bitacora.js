import sequelize from '../config/db/config.js'
import { definicionBitacora } from '../services/bitacora.js'

export class ModeloBitacora {
  static Bitacora = sequelize.define('Bitacora', definicionBitacora, {
    timestamps: false,
    freezeTableName: true
  })

  // Registrar Bitácora
  static async registrarBitacora ({ usuario, accion, descripcion, ip }) {
    try {
      await this.Bitacora.create({
        usuario,
        accion,
        descripcion,
        ip
      })
      return { mensaje: 'Registro de bitácora exitoso' }
    } catch (error) {
      return {
        error: 'Error al registrar la bitácora',
        detalles: error.message
      }
    }
  }

  // Ver Bitácoras
  static async consultarBitacora () {
    try {
      const bitacora = await this.Bitacora.findAll()
      return bitacora
    } catch (error) {
      return {
        error: 'Error al consultar la bitácora',
        detalles: error.message
      }
    }
  }
}
