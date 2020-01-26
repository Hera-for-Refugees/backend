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
const VaccineDose = require('@components/vaccine/vaccine-dose')
const VaccineTranslation = require('@components/vaccine/translation-model')

ReminderTranslation.belongsTo(Reminder)

Reminder.hasMany(ReminderTranslation)
Reminder.belongsTo(ReminderType)
Reminder.belongsTo(Language)

ReminderType.hasMany(Reminder)

Child.belongsTo(User)
Child.belongsToMany(VaccineDose, {
  through: 'ChildVaccineDose',
  foreignKey: 'ChildId'
})

VaccineDose.belongsToMany(Child, {
  through: 'ChildVaccineDose',
  foreignKey: 'VaccineDoseId'
})
Vaccine.hasMany(VaccineTranslation)

VaccineDose.belongsTo(Vaccine)
Vaccine.hasMany(VaccineDose)

VaccineTranslation.belongsTo(Vaccine)
VaccineTranslation.belongsTo(Language)

BlogPost.belongsTo(Language)
BlogPost.belongsTo(Blog)
Blog.hasMany(BlogPost)

Role.hasMany(User)

Language.hasMany(BlogPost)
Language.hasMany(Reminder)
Language.hasMany(User)
Language.hasMany(VaccineTranslation)

User.hasMany(Child)
User.belongsTo(Role)
User.belongsTo(Language)

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
  VaccineDose,
  VaccineTranslation
}
