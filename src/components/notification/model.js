const { instance, Sequelize } = require('@lib/postgres')

const Model = instance.define(
  'Notification',
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
