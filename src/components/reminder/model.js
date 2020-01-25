const { instance, Sequelize } = require('@lib/postgres')
const Joi = require('@hapi/joi')
const ReminderTranslation = require('./translation-model')

const Model = instance.define(
  'Reminder',
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
  LanguageId: Joi.number().required(),
  VaccineId: Joi.number()
    .optional()
    .default(null),
  ReminderTypeId: Joi.number().required(),
  ReminderTranslations: Joi.array()
    .items(ReminderTranslation.createFields)
    .min(1)
    .required()
})

module.exports = Model
