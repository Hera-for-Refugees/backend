require('module-alias/register')
require('dotenv').config()
require('@models')

const Postgres = require('@lib/postgres')
const Express = require('ultimate-expressjs')

const express = new Express({
  port: process.env.PORT,
  logger: null
})

express.setRoutes = app => {
  app.use('/v1/dashboard', require('@components/dashboard/router'))
  app.use('/v1/children', require('@components/child/router'))
  app.use('/v1/languages', require('@components/language/router'))
  app.use('/v1/blogs', require('@components/blog/router'))
  app.use('/v1/languages', require('@components/language/router'))
  app.use('/v1/reminders', require('@components/reminder/router'))
  app.use('/v1/users', require('@components/user/router'))
  app.use('/v1/vaccines', require('@components/vaccine/router'))
}

const app = async () => {
  await Postgres.init()
  console.log('Postgres initialized')
  await express.listen()
}

app()
