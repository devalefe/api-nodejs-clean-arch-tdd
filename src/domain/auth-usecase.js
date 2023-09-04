const { MissingParamError } = require('../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepository, encrypter, tokenGenerator) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return null
    }
    const passwordMatch = await this.encrypter.compare(password, user.password)
    if (!passwordMatch) {
      return null
    }
    const accessToken = await this.tokenGenerator.generate(user.id)
    return accessToken
  }
}

module.exports = AuthUseCase
