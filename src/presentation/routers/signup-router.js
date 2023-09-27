const MissingParamError = require('../../utils/errors/missing-param-error')
const HttpResponse = require('../helpers/http-response')

module.exports = class SignUpRouter {
  constructor ({
    signUpUseCase
  } = {}) {
    this.signUpUseCase = signUpUseCase
  }

  async route (httpRequest) {
    try {
      const accountData = httpRequest.body
      const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!accountData[field]) {
          return HttpResponse.badRequest(new MissingParamError(`${field} is a required field`))
        }
      }
      await this.signUpUseCase.register(accountData)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
