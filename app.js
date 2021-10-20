const express = require('express')
const jwksClient = require('jwks-client')
const jwt = require('jsonwebtoken')

const {
  jwksUri,
  authAud,
} = require('./config')

const jwks = jwksClient({jwksUri});

const verifyJwt = (req, res, next) => {
  const token = req.headers['cf-access-jwt-assertion']
  jwt.verify(token, (header, callback) => {
    jwks.getSigningKey(header.kid, (err, key) => {
      if (err) {
        console.error(err)
        return res.sendStatus(403)
      }
      const signingKey = key.publicKey || key.rsaPublicKey
      return callback(null, signingKey)
    })
  }, (err, decoded) => {
    if (err) {
      console.error(err)
      return res.sendStatus(403)
    }
    if (decoded?.aud?.indexOf(authAud) == -1) return res.sendStatus(403)
    res.app.locals.jwt = decoded
    return next()
  })
}

const app = express()
const port = 3033

app.get('/*', verifyJwt, (req, res) => {
  const { headers, url, method } = req
  const { jwt } = res.app.locals
  console.log({ method, url, headers, jwt })
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
