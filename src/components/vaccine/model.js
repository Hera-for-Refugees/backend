const { instance, Sequelize } = require('@lib/postgres')

const Model = instance.define(
  'Vaccine',
  {
    firstName: {
      type: Sequelize.STRING,
      required: true,
      unique: true,
      allowNull: false
    }
  },
  { timestamps: true, paranoid: true }
)

module.exports = Model
