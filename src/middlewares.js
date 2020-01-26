const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')
const roles = require('@components/role/enum')
const Crypto = require('@lib/crypto')
const { User, Role } = require('@models')
const models = require('@models')

const isAuthenticated = () => {
  return async (req, res, next) => {
    const header = req.headers.authorization

    if (!header) {
      throw Boom.unauthorized('Authentication required. Missing header.')
    }

    const { id } = Crypto.verify(header)

    if (!id) {
      throw Boom.unsupportedMediaType('Payload can not be parsed.')
    }

    const user = await User.findOne({ where: { id }, include: [Role] })

    if (!user) {
      throw Boom.notFound('User not found')
    }

    req.user = user
  }
}

const hasRole = (role = roles.USER) => {
  return async (req, res, next) => {
    if (!req.user) {
      throw Boom.preconditionFailed('User not logged in')
    }

    if (req.user.Role.name !== role) {
      throw Boom.preconditionFailed(
        `You need to be ${role} to access this resource.`
      )
    }
  }
}

const hasRoles = roles => {
  return async (req, res, next) => {
    if (!req.user) {
      throw Boom.preconditionFailed('User not logged in')
    }

    if (roles.includes(req.user.Role.name)) {
      throw Boom.preconditionFailed(
        `You need to be ${roles.join(' or ')} to access this resource.`
      )
    }
  }
}

const validateInput = schema => {
  return async req => {
    const { value, error } = schema.validate(req.body)
    console.log('value', value, error)
    if (error) {
      throw Boom.preconditionFailed(error)
    }

    req.validatedInput = value
  }
}

const paginationSchema = Joi.object({
  limit: Joi.number()
    .min(1)
    .default(10),
  page: Joi.number()
    .default(1)
    .min(1),
  order: Joi.array()
    .items(Joi.string().required())
    .unique()
    .default(['createdAt DESC'])
    .optional(),
  attributes: Joi.array()
    .items(Joi.string())
    .default(null)
    .optional(),
  include: Joi.array()
    .items(Joi.string().valid(...Object.keys(models)))
    .default([])
    .optional()
})

/**
 * @apiDefine Pagination
 * @apiParam {Number{1..999}} limit=1 Page size.
 * @apiParam {Number{1..999}} page=1 Page number
 * @apiParam {Array[Object]} order=[{key:'createdAt',value:'DESC'}] Order attributes
 * @apiParam {Array[String]} attributes=['id','createdAt','updatedAt','deletedAt'] Attributes to include to the response.
 * @apiParam {Array[String]} include Included resources (For example: Language has Application relation, therefore add Application as value for param.)
 */
const shouldPaginate = (Model, WhereCondition = {}) => {
  return async ({ query }, res, next) => {
    if (!Array.isArray(query['order']) && query['order']) {
      query['order'] = [query['order']]
    }

    if (!Array.isArray(query['attributes']) && query['attributes']) {
      query['attributes'] = [query['attributes']]
    }

    if (!Array.isArray(query['include']) && query['include']) {
      query['include'] = [query['include']]
    }

    const { error, value } = paginationSchema.validate(query)

    console.log('value', value)
    if (error) {
      throw Boom.badRequest('Pagination validation failed', error)
    }

    try {
      return Model.findAndCountAll({
        where: WhereCondition,
        offset: value.limit * (value.page - 1),
        limit: value.limit,
        order: value['order'].map(f => f.split(' ')),
        attributes: value['attributes'],
        include: value['include'].map(i => models[i])
      })
    } catch (exception) {
      throw Boom.badImplementation(
        `Uncaught postgresql error occurred`,
        exception
      )
    }
  }
}

module.exports = {
  isAuthenticated,
  hasRole,
  hasRoles,
  validateInput,
  shouldPaginate
}
