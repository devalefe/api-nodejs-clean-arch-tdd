const { MissingParamError, InvalidParamError } = require('../utils/errors')

module.exports = class SignUpUseCase {
  constructor ({
    encrypter,
    tokenGenerator,
    loadUserByEmailRepository,
    createUserAccountRepository
  } = {}) {
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.createUserAccountRepository = createUserAccountRepository
  }

  async register (userData = {}) {
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'password']
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new MissingParamError(`Missing param: ${field}`)
      }
    }
    const emailAlreadyExists = await this.loadUserByEmailRepository.load(userData.email)
    if (emailAlreadyExists) {
      throw new InvalidParamError('Invalid param: email already in use')
    }
    const hashedPassword = await this.encrypter.hash(userData.password)
    const account = await this.createUserAccountRepository.save(
      Object.assign({}, userData, { password: hashedPassword })
    )
    await this.tokenGenerator.generate(account.id)
  }
}
