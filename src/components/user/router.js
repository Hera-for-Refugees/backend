const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const Boom = require('@hapi/boom')
const { User, Language, Role, Child } = require('@models')
const roles = require('@components/role/enum')
const {
  validateInput,
  isAuthenticated,
  hasRole,
  shouldPaginate
} = require('@middlewares')
const Client = require('authy-client').Client
const authy = new Client({ key: process.env.TWILIO_KEY })
const Crypto = require('@lib/crypto')

router.get('/', isAuthenticated(), hasRole(roles.admin), shouldPaginate(User))

router.post('/login', validateInput(User.loginFields), async req => {
  const { phoneNumber, LanguageId, email } = req.validatedInput

  const user = await User.findOne({ where: { phoneNumber } })

  if (!user) {
    const authyResponse = await authy.registerUser({
      email,
      phone: phoneNumber,
      countryCode: 'TR'
    })
    const newUser = await User.create({
      phoneNumber,
      LanguageId,
      authyId: authyResponse.user.id,
      RoleId: 1
    })

    const { cellphone } = await authy.requestSms({ authyId: newUser.authyId })

    return {
      authyId: newUser.authyId,
      message: `User not registered but message sent to ${cellphone}`
    }
  }

  const { cellphone } = await authy.requestSms({ authyId: user.authyId })

  return {
    authyId: user.authyId,
    message: `Notification sent to ${cellphone}`
  }
})

router.post(
  '/login/two-factor',
  validateInput(User.twoFactorFields),
  async req => {
    const { authyId, token } = req.validatedInput

    try {
      await authy.verifyToken({ authyId, token })
    } catch (e) {
      throw Boom.unauthorized('Authy token expired')
    }

    const user = await User.findOne({
      where: { authyId },
      include: [Role, Language]
    })
    return {
      token: Crypto.sign({ id: user.id }),
      user: user
    }
  }
)

router.get('/:id', isAuthenticated(), async ({ user, params: { id } }) => {
  const adminRole = await Role.findOne({ where: { name: roles.admin } })
  if (user.Role.id !== adminRole.id && id !== user.id) {
    throw Boom.unauthorized('Unauthorized access')
  }

  const requestedUser = await User.findOne({
    where: { id },
    include: [Role, Language]
  })

  if (!requestedUser) {
    throw Boom.notFound('User not found')
  }

  return {
    user: requestedUser
  }
})

router.get(
  '/:id/children',
  isAuthenticated(),
  async ({ user, params: { id } }, res, next) => {
    if (user.id != id) {
      throw Boom.unauthorized('Unauthorized access')
    }

    const requestedUser = await User.findOne({
      where: { id }
    })

    return requestedUser.getChildren()
  }
)

router.get(
  '/:id/children/:childrenId',
  isAuthenticated(),
  async ({ user, params: { id, childrenId } }) => {
    if (user.id != id) {
      throw Boom.unauthorized('Unauthorized access')
    }

    const child = await Child.findOne({
      where: { id: childrenId, UserId: id }
    })

    if (!child) {
      throw Boom.notFound(`Child not found`)
    }

    return child
  }
)

router.delete(
  '/:id/children/:childrenId',
  isAuthenticated(),
  async ({ user, params: { id, childrenId } }) => {
    if (user.id != id) {
      throw Boom.unauthorized('Unauthorized access')
    }

    const child = await Child.findOne({
      where: { id: childrenId, UserId: id }
    })

    if (!child) {
      throw Boom.notFound(`Child not found`)
    }

    await child.destroy()

    return {}
  }
)

router.put(
  '/:id/children/:childrenId',
  isAuthenticated(),
  validateInput(Child.addChildFields),
  async ({ user, params: { id, childrenId }, validatedInput }) => {
    if (user.id != id) {
      throw Boom.unauthorized('Unauthorized access')
    }

    const child = await Child.findOne({
      where: { id: childrenId, UserId: id }
    })

    if (!child) {
      throw Boom.notFound(`Child not found`)
    }

    await child.update(validatedInput)

    return child
  }
)

router.post(
  '/:id/children',
  isAuthenticated(),
  validateInput(Child.addChildFields),
  async ({ user, params: { id }, validatedInput }) => {
    if (user.id != id) {
      throw Boom.unauthorized('Unauthorized access')
    }

    return Child.create({ ...validatedInput, UserId: user.id })
  }
)

router.put(
  '/:id',
  isAuthenticated(),
  validateInput(User.updateFields),
  async (req, res, next) => {
    if (req.params.id != req.user.id) {
      throw Boom.unauthorized(
        'You dont have access to manipulate this resource.'
      )
    }

    const user = await User.findOne({ where: { id: req.params.id } })

    if (!user) {
      throw Boom.notFound('User not found')
    }

    await user.update(req.validatedInput)

    return user
  }
)

module.exports = router.getOriginal()
