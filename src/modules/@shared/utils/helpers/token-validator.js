const jwt = require('jsonwebtoken')
const { MissingParamError } = require('../errors')

module.exports = class TokenValidator {
  constructor (secret) {
    this.secret = secret
  }

  async validate (token) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }
    if (!token) {
      throw new MissingParamError('token')
    }
    token = token.includes('Bearer') ? token.split(' ')[1] : token
    return jwt.verify(token, this.secret)
  }
}
