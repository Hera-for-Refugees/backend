const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const Boom = require('boom')
const { User } = require('@models')
const { validateInput } = require('@middlewares')
const Client = require('authy-client').Client
const authy = new Client({ key: process.env.TWILIO_KEY })
const Crypto = require('@lib/crypto')

router.post('/register', validateInput(User.registerFields), async req => {
  const { email, phoneNumber } = req.validatedInput
  if (await User.findOne({ where: { phoneNumber } })) {
    throw Boom.preconditionFailed('User already exists')
  }

  const { user } = await authy.registerUser({
    email,
    phone: phoneNumber,
    countryCode: 'TR'
  })
  const savedUser = await User.create({
    ...req.validatedInput,
    authyId: user.id,
    RoleId: 1
  })

  const { message, device, cellphone } = await authy.requestSms({
    authyId: user.id
  })

  return {
    user: savedUser,
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

  const { phone } = await authy.requestSms({ authyId: user.id })

  return {
    authyId: user.authyId,
    message: `Notification sent to ${phone}`
  }
})

router.post(
  '/login/two-factor',
  validateInput(User.twoFactorFields),
  async req => {
    const { authyId, token } = req.validatedInput

    await authy.verifyToken({ authyId, token })

    const user = await User.findOne({ where: { authyId } })
    return {
      token: Crypto.sign({ id: user.id })
    }
  }
)

module.exports = router.getOriginal()
