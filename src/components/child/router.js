const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const Boom = require('@hapi/boom')
const { Child, Vaccine, User, VaccineTranslation } = require('@models')
const {
  isAuthenticated,
  hasRole,
  validateInput,
  shouldPaginate
} = require('@middlewares')
const roles = require('@components/role/enum')

router.get('/', isAuthenticated(), hasRole(roles.admin), shouldPaginate(Child))

router.post(
  '/',
  isAuthenticated(),
  hasRole(roles.admin),
  validateInput(Child.registerFields),
  async ({ validatedInput, user }) => {
    return Child.create(validatedInput)
  }
)

router.get(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  async ({ params, user }) => {
    const child = await Child.findOne({
      where: params,
      include: [
        {
          model: Vaccine,
          as: 'Vaccines',
          include: [
            {
              model: VaccineTranslation
            }
          ]
        }
      ]
    })

    if (!child) {
      throw Boom.notFound('Child not found')
    }

    return child
  }
)

router.put(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  validateInput(Child.registerFields),
  async ({ validatedInputs, params }) => {
    const child = await Child.findOne({ where: params })

    if (!child) {
      throw Boom.notFound('Child not found')
    }

    await child.update(validatedInputs)

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
