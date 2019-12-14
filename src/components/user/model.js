const { instance, Sequelize } = require('@lib/postgres')
const Joi = require('@hapi/joi')

const Model = instance.define(
  'User',
  {
    firstName: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false
    },
    phoneNumber: {
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
    },
    email: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true
    },
    lastPeriodDate: {
      type: Sequelize.DATEONLY,
      required: false,
      allowNull: true,
      defaultValue: null
    },
    authyId: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
      unique: true
    }
  },
  { timestamps: true, paranoid: true }
)

Model.twoFactorFields = Joi.object({
  authyId: Joi.string(),
  token: Joi.string()
})

Model.loginFields = Joi.object({
  phoneNumber: Joi.string()
})

Model.registerFields = Joi.object({
  firstName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  lastName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  phoneNumber: Joi.string(),

  gender: Joi.string()
    .allow('male', 'female')
    .required(),

  birthDate: Joi.date().required(),

  email: Joi.string()
    .email()
    .optional()
    .default(null),

  lastPeriodDate: Joi.date()
    .optional()
    .default(null)
})

Model.fields = module.exports = Model
