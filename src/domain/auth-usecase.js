const { MissingParamError } = require('../utils/errors')

class AuthUseCase {
  constructor ({
    loadUserByEmailRepository,
    updateAccessTokenRepository,
    tokenGenerator,
    encrypter
  } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
    this.tokenGenerator = tokenGenerator
    this.encrypter = encrypter
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    const credentialsMatch = user && await this.encrypter.compare(password, user.password)
    if (credentialsMatch) {
      const accessToken = await this.tokenGenerator.generate(user.id)
      await this.updateAccessTokenRepository.update(user.id, accessToken)
      return accessToken
    }
    return null
  }
}

module.exports = AuthUseCase
