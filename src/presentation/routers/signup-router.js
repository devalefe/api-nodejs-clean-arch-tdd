const HttpResponse = require('../helpers/http-response')

module.exports = class SignUpRouter {
  constructor ({
    signUpUseCase,
    signUpValidator
  } = {}) {
    this.signUpUseCase = signUpUseCase
    this.signUpValidator = signUpValidator
  }

  async route (httpRequest) {
    try {
      const formData = httpRequest.body
      if (!formData) throw new Error()
      const accountData = await this.signUpValidator.validate(formData)
      const accessToken = await this.signUpUseCase.register(accountData)
      if (accessToken) {
        return HttpResponse.ok({ accessToken })
      }
    } catch (error) {
      if (error.name === 'InvalidParamError') {
        return HttpResponse.badRequest({
          message: error.message,
          detail: error.detail
        })
      }
      return HttpResponse.serverError()
    }
  }
}
