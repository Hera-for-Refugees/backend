const Boom = require('boom')
const roles = require('@components/role/enum')
const Crypto = require('@lib/crypto')
const { User } = require('@models')

const isAuthenticated = () => {
  return async (req, res, next) => {
    const header = req.headers.authorization

    if (!header) {
      throw Boom.unauthorized('Authentication required. Missing header.')
    }

    const { id } = Crypto.verify(header)

    const user = User.findOne({ where: { id } })

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

    if (req.user.role !== role) {
      throw Boom.preconditionFailed('User role not acceptable')
    }
  }
}

const validateInput = schema => {
  return async req => {
    const { value, error } = schema.validate(req.body)

    if (error) {
      throw Boom.preconditionFailed(error)
    }

    req.validatedInput = value
  }
}

module.exports = {
  isAuthenticated,
  hasRole,
  validateInput
}
