const { MissingParamError, InvalidParamError } = require('../utils/errors')

module.exports = class SignUpUseCase {
  constructor ({
    encrypter,
    loadUserByEmailRepository,
    createUserAccountRepository
  } = {}) {
    this.encrypter = encrypter
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.createUserAccountRepository = createUserAccountRepository
  }

  async register (props = {}) {
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'password']
    for (const field of requiredFields) {
      if (!props[field]) {
        throw new MissingParamError(`Missing param: ${field}`)
      }
    }
    const emailAlreadyExists = await this.loadUserByEmailRepository.load(props.email)
    if (emailAlreadyExists) {
      throw new InvalidParamError('Invalid param: email already in use')
    }
    const hashedPassword = await this.encrypter.hash(props.password)
    await this.createUserAccountRepository.save(Object.assign({}, props, { password: hashedPassword }))
  }
}
