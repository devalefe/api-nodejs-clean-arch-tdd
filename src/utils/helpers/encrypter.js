const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-error')

module.exports = class Encrypter {
  constructor (salt = 12) {
    this.salt = salt
  }

  async compare (value, hash) {
    if (!value) {
      throw new MissingParamError('value')
    }
    if (!hash) {
      throw new MissingParamError('hash')
    }
    const valueMatch = await bcrypt.compare(value, hash)
    return valueMatch
  }

  async hash (value) {
    if (!value) {
      throw new MissingParamError('value')
    }
    if (!this.salt) {
      throw new MissingParamError('salt')
    }
    const valueHashed = await bcrypt.hash(value, this.salt)
    return valueHashed
  }
}
