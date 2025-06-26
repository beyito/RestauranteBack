import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  database: 'Restaurante',
  username: 'restaurante',
  password: 'CObuchan8',
  host: 'restauranteserver.database.windows.net',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true, // Azure requiere cifrado SSL
      trustServerCertificate: true // Importante para seguridad
    }
  }
})
export default sequelize
