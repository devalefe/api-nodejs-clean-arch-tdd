const HttpResponse = require('../helpers/http-response')

module.exports = class UpdateAccountRouter {
  constructor ({
    updateAccountUseCase
  } = {}) {
    this.updateAccountUseCase = updateAccountUseCase
  }

  async route (httpRequest) {
    try {
      const formData = httpRequest.body
      if (!formData) throw new Error()
      await this.updateAccountUseCase.update()
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
