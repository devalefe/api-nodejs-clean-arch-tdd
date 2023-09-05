const { MissingParamError } = require('../utils/errors')

class AuthUseCase {
  constructor (props) {
    this.loadUserByEmailRepository = props?.loadUserByEmailRepository
    this.tokenGenerator = props?.tokenGenerator
    this.encrypter = props?.encrypter
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
      return accessToken
    }
    return null
  }
}

module.exports = AuthUseCase
