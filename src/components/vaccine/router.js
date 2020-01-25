const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const Boom = require('@hapi/boom')
const { hasRole, isAuthenticated, validateInput } = require('@middlewares')
const roles = require('@components/role/enum')
const { Vaccine, VaccineTranslation } = require('@models')

router.get('/', isAuthenticated(), async ({ user }) => {
  if (user.Role.name === roles.admin) {
    return Vaccine.findAll({ include: [VaccineTranslation] })
  }
  return VaccineTranslation.findAll({ where: { LanguageId: user.LanguageId } })
})

router.post(
  '/',
  isAuthenticated(),
  hasRole(roles.admin),
  validateInput(Vaccine.createFields),
  async ({ validatedInput }) => {
    return Vaccine.create(validatedInput, { include: [VaccineTranslation] })
  }
)

router.delete(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  async ({ params }) => {
    const vaccine = await Vaccine.findOne({ where: params })

    if (!vaccine) {
      throw Boom.notFound('Vaccine not found')
    }

    await vaccine.destroy()

    return {}
  }
)

module.exports = router.getOriginal()
