const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const Boom = require('@hapi/boom')
const { Child, Vaccine, User, VaccineTranslation } = require('@models')
const { isAuthenticated, hasRole, validateInput } = require('@middlewares')
const roles = require('@components/role/enum')

router.get('/', isAuthenticated(), async ({ user }) => {
  if (user.Role.name === roles.admin) {
    return Child.findAll({ include: [Vaccine, User] })
  }

  return user.getChildren()
})

router.post(
  '/',
  isAuthenticated(),
  validateInput(Child.registerFields),
  async ({ validatedInput, user }) => {
    const child = await Child.create({ ...validatedInput, UserId: user.id })

    const vaccines = await Promise.all(
      validatedInput.Vaccines.map(id => Vaccine.findOne({ where: { id } }))
    )
    await child.addVaccines(vaccines)
    return child
  }
)

router.get('/:id', isAuthenticated(), async ({ params, user }) => {
  const child = await Child.findOne({
    where: params,
    include: [
      {
        model: Vaccine,
        include: [
          {
            model: VaccineTranslation,
            as: 'VaccineTranslation'
          }
        ]
      }
    ]
  })

  if (!child) {
    throw Boom.notFound('Child not found')
  }

  if (user.Role.name !== roles.admin && child.UserId !== user.id) {
    throw Boom.unauthorized('Unable to access this resource')
  }

  return child
})

router.put(
  '/:id',
  isAuthenticated(),
  validateInput(Child.registerFields),
  async ({ validatedInputs, user, params }) => {
    const child = await Child.findOne({ where: params })

    if (!child) {
      throw Boom.notFound('Child not found')
    }

    if (user.Role.name !== roles.admin && child.UserId !== user.id) {
      throw Boom.unauthorized('Unauthorized access detected')
    }

    await child.updateAttributes(validatedInputs)

    return child
  }
)

router.delete(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  async ({ params }) => {
    const child = await Child.findOne({ where: params })

    if (!child) {
      throw Boom.notFound('Child not found')
    }

    await child.destroy()

    return {}
  }
)

module.exports = router.getOriginal()
