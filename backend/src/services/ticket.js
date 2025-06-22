import { DataTypes } from 'sequelize'

export const definicionTicket = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  hora: {
    type: DataTypes.TIME(0),
    defaultValue: DataTypes.NOW
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  idPedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idEstado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idMetodoPago: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'id'
    }
  }
}
export const definicionMetodoPago = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}
