const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const { Language } = require('@models')
const { isAuthenticated, hasRole, validateInput } = require('@middlewares')
const roles = require('@components/role/enum')
const Boom = require('@hapi/boom')

router.get('/', async () => {
  return Language.findAll()
})

router.post(
  '/',
  isAuthenticated(),
  hasRole(roles.admin),
  validateInput(Language.createFields),
  async ({ validatedInput }) => {
    return Language.create(validatedInput)
  }
)

router.put(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  validateInput(Language.createFields),
  async ({ validatedInput, params }) => {
    const lang = await Language.findOne({ where: params })

    if (!lang) {
      throw Boom.notFound('Language not found')
    }

    await lang.updateAttributes(validatedInput)

    return lang
  }
)

router.delete(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  async ({ params }) => {
    const lang = await Language.findOne({ where: params })

    if (!lang) {
      throw Boom.notFound('Language not found')
    }

    await lang.destroy()

    return {}
  }
)

module.exports = router.getOriginal()
