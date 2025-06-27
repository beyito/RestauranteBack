import sequelize from '../config/db/config.js'
import bcrypt from 'bcrypt'

import { definicionClienteWeb, definicionUsuario } from '../services/user.js'
import { Op } from 'sequelize'

export class ModeloAuth {
  constructor (token) {
    this.token = token
  }

  static Usuario = sequelize.define('Usuario', definicionUsuario, {
    timestamps: false,
    freezeTableName: true
  })

  static ClienteWeb = sequelize.define('ClienteWeb', definicionClienteWeb, {
    timestamps: false,
    freezeTableName: true
  })

  static asociate () {
    this.Usuario.hasOne(this.ClienteWeb, {
      foreignKey: 'idUsuario',
      as: 'clienteWeb'
    })

    this.ClienteWeb.belongsTo(this.Usuario, {
      foreignKey: 'idUsuario',
      as: 'usuario'
    })
  }

  static async login ({ input }) {
    const { nombreUsuario, password } = input.data
    try {
      const buscarUsuario = await this.Usuario.findOne({
        where: { nombreUsuario }
      })
      if (!buscarUsuario) return { error: 'Usuario no encontrado' }
      const verificarPassword = await bcrypt.compare(password, buscarUsuario.password)
      if (!verificarPassword) return { error: 'Password incorrecto' }
      const nuevoToken = this.token.crearToken({
        id: buscarUsuario.id,
        nombreUsuario: buscarUsuario.nombreUsuario,
        rol: buscarUsuario.idRol
      })
      return {
        user: {
          nombreUsuario: buscarUsuario.nombreUsuario,
          correo: buscarUsuario.correo,
          rol: buscarUsuario.idRol
        },
        nuevoToken
      }
    } catch (error) {
      throw new Error('Error al loguearse')
    }
  }

  static async register ({ input }) {
    const {
      correo, direccion, nombre, nombreUsuario, password, telefono, tipoUsuario,
      idRol, idEstado, puntosFidelidad
    } = input.data

    try {
      const buscarUsuario = await this.Usuario.findOne({
        where: {
          [Op.or]: [ // Operador OR de Sequelize
            { nombreUsuario },
            { correo }
          ]
        }
      })

      if (buscarUsuario) {
        // Mensaje más específico sobre qué campo está duplicado
        if (buscarUsuario.nombreUsuario === nombreUsuario) {
          return { error: 'Error: El nombre de usuario ya está en uso' }
        }
        if (buscarUsuario.correo === correo) {
          return { error: 'Error: El correo electrónico ya está registrado' }
        }
        return { error: 'Error: Usuario ya existente' } // Fallback genérico
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const nuevoUsuario = await this.Usuario.create({
        correo,
        nombre,
        nombreUsuario,
        tipoUsuario,
        password: passwordHash,
        telefono,
        idRol,
        idEstado
      })

      await this.ClienteWeb.create({
        idUsuario: nuevoUsuario.id,
        direccion,
        puntosFidelidad
      })

      const usuarioCompleto = await this.Usuario.findByPk(nuevoUsuario.id, {
        include: [{ model: this.ClienteWeb, as: 'clienteWeb' }]
      })

      return usuarioCompleto
    } catch (error) {
      console.error('Error detallado:', error)
      throw new Error(`Error al registrar usuario: ${error.message}`)
    }
  }

  static async perfil ({ input }) {
    const id = input.id
    const user = await this.Usuario.findByPk(id)
    if (!user) return { error: 'Error: Usuario  no existente' }
    return {
      user: {
        id: user.id,
        email: user.correo,
        userName: user.nombreUsuario,
        telefono: user.telefono,
        nombre: user.nombre,
        rol: user.idRol
      }
    }
  }
}
ModeloAuth.asociate()
