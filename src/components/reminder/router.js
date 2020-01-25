const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const Boom = require('@hapi/boom')
const { isAuthenticated, hasRole, validateInput } = require('@middlewares')
const roles = require('@components/role/enum')
const { Reminder, ReminderType, ReminderTranslation } = require('@models')

router.get(
  '/',
  isAuthenticated(),
  hasRole(roles.admin),
  async ({ user, query }) => {
    const whereCondition = {}

    if (query.typeId) {
      whereCondition.where = { ReminderTypeId: query.typeId }
    }
    return Reminder.findAll(whereCondition)
  }
)

router.post(
  '/',
  isAuthenticated(),
  hasRole(roles.admin),
  validateInput(Reminder.createFields),
  async ({ validatedInput }) => {
    return Reminder.create(validatedInput, { include: [ReminderTranslation] })
  }
)

router.get('/types', isAuthenticated(), hasRole(roles.admin), async () =>
  ReminderType.findAll()
)

router.get(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  async ({ params }) => {
    const reminder = await Reminder.findOne({ where: params })

    if (!reminder) {
      throw Boom.notFound('Reminder not found')
    }

    return reminder
  }
)

router.put(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  validateInput(Reminder.createFields),
  async ({ params, validatedInput }) => {
    const reminder = await Reminder.findOne({ where: params })

    if (!reminder) {
      throw Boom.notFound('Reminder not found')
    }

    await reminder.updateAttributes(validatedInput)

    return reminder
  }
)

router.delete(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  async ({ params }) => {
    const reminder = await Reminder.findOne({ where: params })

    if (!reminder) {
      throw Boom.notFound('Reminder not found')
    }

    await reminder.destroy()

    return {}
  }
)

module.exports = router.getOriginal()
