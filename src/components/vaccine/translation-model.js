const { instance, Sequelize } = require('@lib/postgres')
const Joi = require('@hapi/joi')

const Model = instance.define(
  'VaccineTranslation',
  {
    name: {
      type: Sequelize.STRING,
      required: true,
      unique: true,
      allowNull: false
    }
  },
  { timestamps: true, paranoid: true }
)

Model.createFields = Joi.object({
  name: Joi.string().required(),
  LanguageId: Joi.number().required()
})

module.exports = Model
