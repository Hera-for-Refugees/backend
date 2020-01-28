require('module-alias/register')
require('dotenv').config()

const { DATABASE_URL } = process.env
const pg = require('pg')
pg.defaults.ssl = DATABASE_URL.includes('.com')

module.exports = {
  development: {
    url: DATABASE_URL,
    dialect: 'postgres',
    ssl: true
  }
}