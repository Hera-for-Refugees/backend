const { instance, Sequelize } = require('@lib/postgres')
const Joi = require('@hapi/joi')
const VaccineTranslations = require('./translation-model')

const Model = instance.define(
  'VaccineDose',
  {
    name: {
      type: Sequelize.STRING,
      required: true,
      unique: true,
      allowNull: false
    },
    order: {
      type: Sequelize.INTEGER,
      required: true,
      allowNull: false,
      defaultValue: 1
    }
  },
  { timestamps: true, paranoid: true }
)

Model.createFields = Joi.object({
  name: Joi.string().required(),
  VaccineTranslations: Joi.array()
    .items(VaccineTranslations.createFields)
    .min(1)
    .required()
})

module.exports = Model
