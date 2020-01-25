require('module-alias/register')
require('dotenv').config()
require('@models')

const Postgres = require('@lib/postgres')
const Boom = require('@hapi/boom')
const Express = require('ultimate-expressjs')
const RedisStore = require('rate-limit-redis')

const express = new Express({
  port: process.env.PORT,
  logger: null,
  limiterOptions: {
    store: new RedisStore({
      client: require('redis').createClient(process.env.REDIS_URL)
    }),
    max: 10,
    delay: 0,
    windowMs: 1 * 60 * 1000,
    handler: (req, res, next) => {
      next(Boom.tooManyRequests('You have exceeded your rate limit.'))
    }
  }
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
