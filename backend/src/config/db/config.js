import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  database: 'Restaurante',
  username: 'sa',
  password: 'CObuchan8',
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true, // Azure requiere cifrado SSL
      trustServerCertificate: true // Importante para seguridad
    }
  }
})
export default sequelize
