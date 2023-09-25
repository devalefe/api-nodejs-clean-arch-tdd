const { MissingParamError } = require('../utils/errors')

module.exports = class SignUpUseCase {
  constructor ({
    loadUserByEmailRepository
  } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async register (props = {}) {
    const requiredFields = [
      'firstName',
      'lastName',
      'phone',
      'email',
      'password'
    ]

    for (const field of requiredFields) {
      if (!props[field]) {
        throw new MissingParamError(`Missing param: ${field}`)
      }
    }

    await this.loadUserByEmailRepository.load(props.email)
  }
}
