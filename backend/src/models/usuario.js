import sequelize from '../config/db/config.js'
import bcrypt from 'bcrypt'
import { Sequelize } from 'sequelize'

import { definicionUsuario, definicionEmpleado, definicionClienteWeb } from '../services/user.js'

export class ModeloUsuario {
  static Usuario = sequelize.define('Usuario', definicionUsuario, {
    timestamps: false,
    freezeTableName: true
  })

  static Empleado = sequelize.define('Empleado', definicionEmpleado, {
    timestamps: false,
    freezeTableName: true
  })

  static ClienteWeb = sequelize.define('ClienteWeb', definicionClienteWeb, {
    timestamps: false,
    freezeTableName: true
  })

  static asociar () {
    this.Usuario.hasOne(this.ClienteWeb, {
      foreignKey: 'idUsuario',
      sourceKey: 'id'
    })
    this.ClienteWeb.belongsTo(this.Usuario, {
      foreignKey: 'idUsuario',
      targetKey: 'id'
    })

    // Relación Usuario - Empleado
    this.Usuario.hasOne(this.Empleado, {
      foreignKey: 'idUsuario',
      sourceKey: 'id'
    })
    this.Empleado.belongsTo(this.Usuario, {
      foreignKey: 'idUsuario',
      targetKey: 'id'
    })
  }

  static async registrarUsuario ({ input }) {
    const { nombreUsuario, nombre, password, correo, telefono, idRol, tipoUsuario, ci = null } = input.data
    try {
      const buscarUsuario = await this.Usuario.findOne({
        where: { nombreUsuario }
      })

      if (buscarUsuario) return { error: 'El usuario ya está registrado' }
      const buscarCorreo = await this.Usuario.findOne({
        where: { correo }
      })

      if (buscarCorreo) return { error: 'El correo ya existe' }

      const hashPassword = bcrypt.hashSync(password, 10)
      try {
        await sequelize.query(
          'EXEC registrarUsuario @nombreUsuario = :nombreUsuario, @nombre = :nombre, @password = :password, @correo = :correo, @telefono = :telefono, @idRol = :idRol, @ci = :ci, @tipoUsuario = :tipoUsuario',
          {
            replacements: {
              nombreUsuario,
              nombre,
              password: hashPassword,
              correo,
              telefono,
              idRol,
              ci,
              tipoUsuario
            }
          }
        )
      } catch (e) {
        throw new Error('Error al llamar el procedimiento almacenado')
      }
      const nuevoUsuario = await this.Usuario.findOne({
        where: { nombreUsuario }
      })
      return {
        usuario: {
          nombreUsuario: nuevoUsuario.nombreUsuario,
          correo: nuevoUsuario.correo,
          rol: nuevoUsuario.idRol
        }
      }
    } catch (error) {
      throw new Error('Error al crearse un nuevo empleado')
    }
  }

  static async editarUsuario ({ id, input }) {
    const { ...datos } = input.data
    console.log(datos.password)
    try {
      const usuario = await this.Usuario.findByPk(id)

      if (!usuario) {
        return { error: 'Error: Usuario no encontrado' }
      }
      const camposPermitidos = ['nombreUsuario', 'password', 'nombre', 'correo', 'telefono', 'tipoUsuario', 'idRol', 'ci', 'direccion']
      const camposAActualizar = {}

      for (const campo of camposPermitidos) {
        if (datos[campo] !== undefined) {
          if (campo === 'password') {
            datos.password = await bcrypt.hash(datos.password, 10)
            camposAActualizar.password = datos.password
          } else if (campo === 'ci') {
            const empleado = await this.Empleado.findOne({
              where: { idUsuario: usuario.id }
            })
            await empleado.update({ ci: datos.ci })
          } else if (campo === 'direccion') {
            const cliente = await this.ClienteWeb.findOne({
              where: { idUsuario: usuario.id }
            })
            await cliente.update({ direccion: datos.direccion })
          } else {
            camposAActualizar[campo] = datos[campo]
          }
        }
      }

      await usuario.update(camposAActualizar)

      return { mensaje: 'Usuario actualizado con éxito' }
    } catch (error) {
      console.error(error)
      throw new Error('Error al editar el usuario')
    }
  }

  static async verUsuarios () {
    try {
      const usuarios = await this.Usuario.findAll()
      if (!usuarios) return { error: 'Error: No hay usuarios' }
      return { usuarios }
    } catch (error) {
      throw new Error('Error al obtener los usuarios')
    }
  }

  static async verUsuario (id) {
    try {
      const usuario = await this.Usuario.findByPk(id)
      if (!usuario) return { error: 'Error: Usuario no encontrado' }
      return { usuario }
    } catch (error) {
      console.error(error)
      throw new Error('Error al buscar Usuario')
    }
  }

  static async aumentarPuntosFidelidad ({ id, input }) {
    const { puntosFidelidad } = input.data
    try {
      const usuario = await this.Usuario.findByPk(id)
      if (!usuario) return { error: 'Error: Usuario no encontrado' }
      if (usuario.tipoUsuario !== 'cliente') return { error: 'Error: Solo los clientes pueden tener puntos de fidelidad' }

      const cliente = await this.ClienteWeb.findOne({
        where: { idUsuario: usuario.id }
      })

      if (!cliente) return { error: 'Error: Cliente no encontrado' }

      cliente.puntosFidelidad += puntosFidelidad
      await cliente.save()

      return { mensaje: `Puntos de fidelidad actualizados a ${cliente.puntosFidelidad}` }
    } catch (error) {
      console.error(error)
      throw new Error('Error al aumentar los puntos de fidelidad')
    }
  }

  static async disminuirPuntosFidelidad ({ id, input }) {
    const { puntosFidelidad } = input.data
    try {
      const usuario = await this.Usuario.findByPk(id)
      if (!usuario) return { error: 'Error: Usuario no encontrado' }
      if (usuario.tipoUsuario !== 'cliente') return { error: 'Error: Solo los clientes pueden tener puntos de fidelidad' }

      const cliente = await this.ClienteWeb.findOne({
        where: { idUsuario: usuario.id }
      })

      if (!cliente) return { error: 'Error: Cliente no encontrado' }

      if (cliente.puntosFidelidad < puntosFidelidad) {
        return { error: 'Error: No hay suficientes puntos de fidelidad' }
      }

      cliente.puntosFidelidad -= puntosFidelidad
      await cliente.save()

      return { mensaje: `Puntos de fidelidad actualizados a ${cliente.puntosFidelidad}` }
    } catch (error) {
      console.error(error)
      throw new Error('Error al disminuir los puntos de fidelidad')
    }
  }

  static async editarPuntosFidelidad ({ id, input }) {
    const { puntosFidelidad } = input.data
    try {
      const usuario = await this.Usuario.findByPk(id)
      if (!usuario) return { error: 'Error: Usuario no encontrado' }
      if (usuario.tipoUsuario !== 'cliente') return { error: 'Error: Solo los clientes pueden tener puntos de fidelidad' }

      const cliente = await this.ClienteWeb.findOne({
        where: { idUsuario: usuario.id }
      })

      if (!cliente) return { error: 'Error: Cliente no encontrado' }

      cliente.puntosFidelidad = puntosFidelidad
      await cliente.save()

      return { mensaje: `Puntos de fidelidad actualizados a ${cliente.puntosFidelidad}` }
    } catch (error) {
      console.error(error)
      throw new Error('Error al editar los puntos de fidelidad')
    }
  }

  static async verClientes () {
    try {
      this.asociar()
      const clientes = await this.Usuario.findAll({
        attributes: [
          'id',
          'nombre',
          'nombreUsuario', // solo este campo de Usuario
          [Sequelize.col('ClienteWeb.puntosFidelidad'), 'puntosFidelidad']
        ],
        include: {
          model: this.ClienteWeb,
          required: true,
          attributes: [] // evita incluir ClienteWeb.*
        },
        raw: true,
        nest: false
      })
      if (!clientes) return { error: 'Error: No hay clientes' }
      return { clientes }
    } catch (error) {
      console.error(error)
      throw new Error('Error al obtener los clientes')
    }
  }
}
