import { DataTypes } from 'sequelize'

export const definicionBitacora = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  accion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true // puede estar vacío porque SQL Server lo completa por defecto  
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}
