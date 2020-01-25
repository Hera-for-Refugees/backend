const { instance, Sequelize } = require('@lib/postgres')
const Joi = require('@hapi/joi')

const Model = instance.define(
  'ReminderTranslation',
  {
    title: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      required: true,
      allowNull: false
    }
  },
  { timestamps: true, paranoid: true }
)

Model.createFields = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  LanguageId: Joi.number().required()
})

module.exports = Model
