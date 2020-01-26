const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const { Language } = require('@models')
const {
  isAuthenticated,
  hasRole,
  validateInput,
  shouldPaginate
} = require('@middlewares')
const roles = require('@components/role/enum')
const Boom = require('@hapi/boom')

router.get('/', shouldPaginate(Language))

router.get(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  async (req, res, next) => {
    const language = await Language.findOne({ where: req.params })

    if (!language) {
      throw Boom.notFound(`Language not found`)
    }

    return language
  }
)
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

    await lang.update(validatedInput)

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
