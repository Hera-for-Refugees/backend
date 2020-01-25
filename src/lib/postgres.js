const Sequelize = require('sequelize')
const { DATABASE_URL } = process.env
const pg = require('pg')

class Postgres {
  constructor() {
    pg.defaults.ssl = process.env.NODE_ENV === 'production'
    this.instance = new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      logging: null,
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      ssl: process.env.NODE_ENV === 'production'
    })

    this.Sequelize = Sequelize
  }

  async init(force = false) {
    return this.instance.sync({ force })
  }
}

module.exports = new Postgres()
