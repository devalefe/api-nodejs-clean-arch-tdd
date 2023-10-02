const HttpResponse = require('../helpers/http-response')

module.exports = class UpdateAccountRouter {
  constructor ({
    updateAccountUseCase,
    updateAccountValidator
  } = {}) {
    this.updateAccountUseCase = updateAccountUseCase
    this.updateAccountValidator = updateAccountValidator
  }

  async route (httpRequest) {
    try {
      const formData = httpRequest.body
      if (!formData) throw new Error()
      const accountData = await this.updateAccountValidator.validate(formData)
      await this.updateAccountUseCase.update(accountData)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
