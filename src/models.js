const Blog = require('@components/blog/model')
const BlogPost = require('@components/blog/post-model')
const Language = require('@components/language/model')

const Reminder = require('@components/reminder/model')
const ReminderType = require('@components/reminder/type-model')
const ReminderTranslation = require('@components/reminder/translation-model')

const Child = require('@components/child/model')
const User = require('@components/user/model')
const Role = require('@components/role/model')
const Vaccine = require('@components/vaccine/model')
const VaccineTranslation = require('@components/vaccine/translation-model')

ReminderTranslation.belongsTo(Reminder)
Reminder.hasMany(ReminderTranslation)

ReminderType.hasMany(Reminder)
Reminder.belongsTo(ReminderType)
Reminder.belongsTo(Language)
Language.hasMany(Reminder)

Child.belongsToMany(Vaccine, {
  through: 'ChildVaccine',
  foreignKey: 'ChildId'
})
Vaccine.belongsToMany(Child, {
  through: 'ChildVaccine',
  foreignKey: 'VaccineId'
})

VaccineTranslation.belongsTo(Vaccine)
VaccineTranslation.belongsTo(Language)
Vaccine.hasMany(VaccineTranslation)
Language.hasMany(VaccineTranslation)

BlogPost.belongsTo(Language)
BlogPost.belongsTo(Blog)
Blog.hasMany(BlogPost)

Language.hasMany(BlogPost)

Child.belongsTo(User)
User.hasMany(Child)
User.belongsTo(Role)
User.belongsTo(Language)
Role.hasMany(User)

Language.hasMany(User)

module.exports = {
  Blog,
  BlogPost,
  Reminder,
  ReminderType,
  Child,
  User,
  Role,
  Language,
  Vaccine,
  VaccineTranslation
}
