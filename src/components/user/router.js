const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const Boom = require('@hapi/boom')
const { User, Language, Role } = require('@models')
const roles = require('@components/role/enum')
const {
  validateInput,
  isAuthenticated,
  hasRole,
  hasRoles,
  shouldPaginate
} = require('@middlewares')
const Client = require('authy-client').Client
const authy = new Client({ key: process.env.TWILIO_KEY })
const Crypto = require('@lib/crypto')

router.get('/', isAuthenticated(), hasRole(roles.admin), shouldPaginate(User))

router.post(
  '/',
  isAuthenticated(),
  hasRoles([roles.admin, roles.user]),
  validateInput(User.registerFields),
  async req => {
    const fields = req.validatedInput
    await req.user.updateAttributes(fields)

    return {
      user: req.user
    }
  }
)

router.post('/register', validateInput(User.registerFields), async req => {
  const { email, phoneNumber, LanguageId } = req.validatedInput
  if (await User.findOne({ where: { phoneNumber } })) {
    throw Boom.preconditionFailed('User already exists')
  }

  if (!(await Language.findOne({ where: { id: LanguageId } }))) {
    throw Boom.preconditionFailed(`Specified language doesn't exist.`)
  }

  const { user } = await authy.registerUser({
    email,
    phone: phoneNumber,
    countryCode: 'TR'
  })
  await User.create({
    ...req.validatedInput,
    authyId: user.id,
    RoleId: 1
  })

  const { message, device, cellphone } = await authy.requestSms({
    authyId: user.id
  })

  return {
    message,
    device,
    cellphone
  }
})

router.post('/login', validateInput(User.loginFields), async req => {
  const { phoneNumber } = req.validatedInput

  const user = await User.findOne({ where: { phoneNumber } })

  if (!user) {
    throw Boom.notFound('User not found with that phone number.')
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

module.exports = router.getOriginal()
