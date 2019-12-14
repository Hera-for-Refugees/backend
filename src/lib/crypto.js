const jwt = require('jsonwebtoken')

const sign = (payload, secret = process.env.HMAC_SECRET) => {
  return jwt.sign(payload, secret, { algorithm: 'HS512' })
}

const verify = (payload, secret = process.env.HMAC_SECRET) => {
  return jwt.verify(payload, secret, { algorithm: 'HS512' })
}

module.exports = {
  sign,
  verify
}
