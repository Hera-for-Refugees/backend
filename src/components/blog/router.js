const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const { Blog, BlogPost, Language } = require('@models')
const roles = require('@components/role/enum')
const { isAuthenticated, hasRole, validateInput } = require('@middlewares')
const Boom = require('@hapi/boom')

router.get('/', isAuthenticated(), async ({ user }) => {
  if (user.Role.name === roles.admin) {
    return Blog.findAll()
  }

  return BlogPost.findAll({ where: { LanguageId: user.LanguageId } })
})

router.post(
  '/',
  isAuthenticated(),
  hasRole(roles.admin),
  validateInput(Blog.createFields),
  async ({ validatedInput }) => {
    return Blog.create(validatedInput, { include: [BlogPost] })
  }
)

router.get('/post/:id', isAuthenticated(), async ({ params }) => {
  const post = await BlogPost.findOne({
    where: params,
    include: [Language]
  })

  if (!post) {
    throw Boom.notFound('Post not found')
  }

  return post
})

router.get('/:id', isAuthenticated(), async ({ params }) => {
  const blog = await Blog.findOne({
    where: params,
    include: [BlogPost]
  })
  if (!blog) {
    throw Boom.notFound('Blog not found')
  }
  return blog
})

router.put(
  '/:id',
  isAuthenticated(),
  hasRole(roles.admin),
  async ({ params }) => {
    const blog = await Blog.findOne({ where: params })
    if (!blog) {
      throw Boom.notFound('Blog not found')
    }
    await blog.destroy()
    return {}
  }
)

module.exports = router.getOriginal()
