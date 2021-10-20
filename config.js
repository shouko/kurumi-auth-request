require('dotenv').config()

module.exports = {
  jwksUri: process.env.JWKS_URI,
  authAud: process.env.AUTH_AUD
}
