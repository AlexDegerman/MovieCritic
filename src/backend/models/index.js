const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true
      }
    },
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

const initModels = require('./init-models')
const db = initModels(sequelize)
db.sequelize = sequelize
db.Sequelize = Sequelize

// Keep the DB awake 
setInterval(async () => {
    await sequelize.query("SELECT 1")
}, 5 * 60 * 1000)

module.exports = db