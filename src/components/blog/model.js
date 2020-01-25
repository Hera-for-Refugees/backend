const { instance, Sequelize } = require('@lib/postgres')
const Joi = require('@hapi/joi')
const BlogPost = require('./post-model')
const Model = instance.define(
  'Blog',
  {
    internalName: {
      type: Sequelize.STRING,
      required: true,
      unique: true,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true
    }
  },
  { timestamps: true, paranoid: true }
)

Model.createFields = Joi.object({
  internalName: Joi.string().required(),
  imageUrl: Joi.string().optional(),
  BlogPosts: Joi.array()
    .items(BlogPost.createFields)
    .min(1)
    .required()
})

module.exports = Model
