const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const { isAuthenticated, hasRole } = require('@middlewares')
const { User, Child, Blog, Reminder, Language, Vaccine } = require('@models')
const roles = require('@components/role/enum')

router.get('/', isAuthenticated(), hasRole(roles.admin), async () => {
  return {
    counts: {
      users: await User.count(),
      children: await Child.count(),
      blog: await Blog.count(),
      Reminder: await Reminder.count(),
      Language: await Language.count(),
      Vaccine: await Vaccine.count()
    }
  }
})

module.exports = router.getOriginal()
