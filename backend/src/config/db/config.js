import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_ADMIN,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true, // Azure requiere cifrado SSL
      trustServerCertificate: false // Importante para seguridad
    }
  }
})
export default sequelize
