import z from 'zod'

export class ValidacionDatosUsuario {
  static ReglasUser = z.object({
    nombreUsuario: z.string().max(15, { message: 'Nick demasiado largo' }),
    nombre: z.string({ message: 'Necesita ser solo texto' }),
    password: z.string(),
    confirmarPassword: z.string(),
    correo: z.string().email({ message: 'Se necesita un email' }),
    telefono: z.string(),
    direccion: z.string(),
    puntosFidelidad: z.number().min(0).default(0),
    tipoUsuario: z.enum(['cliente', 'empleado', 'administrador']).default('cliente'),
    idRol: z.number().min(1).default(4),
    idEstado: z.number().min(1).default(3),
    ci: z.string().min(7, { message: 'ci incorrecto' })
  })

  static ReglasAuth = z.object({
    nombreUsuario: z.string().max(15, { message: 'Nick demasiado largo' }),
    nombre: z.string({ message: 'Necesita ser solo texto' }),
    password: z.string(),
    confirm: z.string(),
    correo: z.string().email({ message: 'Se necesita un email' }),
    telefono: z.string(),
    direccion: z.string(),
    tipoUsuario: z.enum(['cliente', 'empleado', 'administrador']).default('cliente'),
    idRol: z.number().min(1).default(4),
    idEstado: z.number().min(1).default(3),
    puntosFidelidad: z.number().min(0).default(0)
  })

  static registerUser (data) {
    return this.ReglasUser.partial((data) => data.password === data.confirmarPassword, {
      message: 'contrasena incorrecta',
      path: ['confirm']
    }).safeParse(data)
  }

  static registerAuth (data) {
    return this.ReglasAuth.partial((data) => data.password === data.confirm, {
      message: 'contrasena incorrecta',
      path: ['confirm']
    }).safeParse(data)
  }

  static loginUser (user) {
    return this.ReglasUser.partial().safeParse(user)
  }

  static verificarDatosUsuario (data) {
    return this.ReglasUser.partial().safeParse(data)
  }

  static verificarDatosAuth (data) {
    return this.ReglasAuth.partial().safeParse(data)
  }
}
