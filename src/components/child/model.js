const { instance, Sequelize } = require('@lib/postgres')
const Joi = require('@hapi/joi')

const Model = instance.define(
  'Child',
  {
    fullName: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    gender: {
      type: Sequelize.ENUM('male', 'female'),
      required: true,
      allowNull: false
    },
    birthDate: {
      type: Sequelize.DATEONLY,
      required: true,
      allowNull: false
    }
  },
  { timestamps: true, paranoid: true }
)

Model.registerFields = Joi.object({
  fullName: Joi.string().required(),
  gender: Joi.string()
    .valid(...['male', 'female'])
    .required(),
  birthDate: Joi.date().required(),
  Vaccines: Joi.array()
    .items(Joi.number())
    .default([]),
  UserId: Joi.number().required()
})

Model.addChildFields = Joi.object({
  fullName: Joi.string().required(),
  gender: Joi.string()
    .valid(...['male', 'female'])
    .required(),
  birthDate: Joi.date().required(),
  Vaccines: Joi.array()
    .items(Joi.number())
    .default([])
})

module.exports = Model
