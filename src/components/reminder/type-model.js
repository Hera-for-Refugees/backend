const { instance, Sequelize } = require('@lib/postgres')
const Joi = require('@hapi/joi')

const Model = instance.define(
  'ReminderType',
  {
    title: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    }
  },
  { timestamps: true, paranoid: true }
)

Model.createFields = Joi.object({
  title: Joi.string().required()
})

module.exports = Model
