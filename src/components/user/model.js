const { instance, Sequelize } = require('@lib/postgres')
const Joi = require('@hapi/joi')

const Model = instance.define(
  'User',
  {
    firstName: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true
    },
    lastName: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true
    },
    phoneNumber: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
      unique: 'UserUniqueness'
    },
    gender: {
      type: Sequelize.ENUM('male', 'female'),
      required: false,
      allowNull: true
    },
    birthDate: {
      type: Sequelize.DATEONLY,
      required: false,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      required: true,
      unique: 'UserUniqueness'
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
    },
    acceptedLicense: {
      type: Sequelize.BOOLEAN,
      required: true,
      defaultValue: false
    }
  },
  { timestamps: true, paranoid: true }
)

Model.twoFactorFields = Joi.object({
  authyId: Joi.string(),
  token: Joi.string()
})

Model.loginFields = Joi.object({
  phoneNumber: Joi.string(),
  LanguageId: Joi.number().required(),
  email: Joi.string()
    .email()
    .required()
})

Model.updateFields = Joi.object({
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
    .default(null),

  LanguageId: Joi.number().required(),

  acceptedLicense: Joi.bool().default(false)
})

Model.fields = module.exports = Model
