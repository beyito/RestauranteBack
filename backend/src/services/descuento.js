import { DataTypes } from 'sequelize'

export const definicionDescuento = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descuento: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  costoFidelidad: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}

export const definicionDetalleDescuento = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idDescuento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'Descuento',
      key: 'id'
    }
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'ClienteWeb',
      key: 'idUsuario'
    }
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  idEstado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Estado',
      key: 'id'
    }
  }
}
