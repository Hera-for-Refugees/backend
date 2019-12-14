require('module-alias/register')
require('dotenv').config()

const Postgres = require('@lib/postgres')
const Boom = require('boom')
const Express = require('ultimate-expressjs')
const RedisStore = require('rate-limit-redis')
require('@models')

const express = new Express({
  port: process.env.PORT,
  logger: console,
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
  app.use('/v1/blogs', require('@components/blog/router'))
  app.use('/v1/languages', require('@components/language/router'))
  app.use('/v1/notifications', require('@components/notification/router'))
  app.use('/v1/users', require('@components/user/router'))
  app.use('/v1/vaccines', require('@components/vaccine/router'))
}

const app = async () => {
  await Postgres.init()
  console.log('Postgres initialized')
  await express.listen()
}

app()
