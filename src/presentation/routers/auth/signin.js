const HttpResponse = require('../../helpers/http-response')
const { InvalidParamError, MissingParamError } = require('../../../utils/errors')

module.exports = class SignInRouter {
  constructor ({ signInUseCase, emailValidator } = {}) {
    this.signInUseCase = signInUseCase
    this.emailValidator = emailValidator
  }

  async route (httpResquest) {
    try {
      const { email, password } = httpResquest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
      const accessToken = await this.signInUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }
      return HttpResponse.ok({ accessToken })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
