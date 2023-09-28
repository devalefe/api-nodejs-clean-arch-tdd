const { MissingParamError, InvalidParamError } = require('../utils/errors')

module.exports = class SignUpUseCase {
  constructor ({
    encrypter,
    tokenGenerator,
    loadUserByEmailRepository,
    createAccountRepository,
    updateAccessTokenRepository
  } = {}) {
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.createAccountRepository = createAccountRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async register (userData = {}) {
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'password']
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new MissingParamError(`Missing param: ${field}`)
      }
    }
    const accountExists = await this.loadUserByEmailRepository.load(userData.email)
    if (accountExists) {
      throw new InvalidParamError(`${userData.email} already exists`)
    }
    const hashedPassword = await this.encrypter.hash(userData.password)
    const account = await this.createAccountRepository.create(
      Object.assign({}, userData, { password: hashedPassword })
    )
    const accessToken = await this.tokenGenerator.generate(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)
    return accessToken
  }
}
