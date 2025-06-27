import { DataTypes } from 'sequelize'

export const definicionCompra = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  idproveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'proveedor', // nombre de la tabla relacionada
      key: 'id'
    }
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario',
      key: 'id'
    }
  }
}

export const definicionDetalleCompraBebida = {
  idCompra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Compra',
      key: 'id'
    },
    allowNull: false
  },
  idProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Producto',
      key: 'id'
    },
    allowNull: false
  },
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}

export const definicionDetalleCompra = {
  idCompra: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Compra',
      key: 'id'
    }
  },
  idIngrediente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Ingrediente',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}
