// const Blog = require('@components/blog/model')
// const Language = require('@components/language/model')
// const Notification = require('@components/notification/model')
const User = require('@components/user/model')
const Role = require('@components/role/model')
// const Vaccine = require('@components/vaccine/model')

User.belongsTo(Role)
Role.hasMany(User)

module.exports = {
  // Blog,
  // Language,
  // Notification,
  User,
  Role
  // Vaccine
}
