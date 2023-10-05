const HttpResponse = require('../helpers/http-response')

module.exports = class UpdateAccountRouter {
  constructor ({
    updateAccountUseCase,
    updateAccountValidator,
    tokenValidator
  } = {}) {
    this.updateAccountUseCase = updateAccountUseCase
    this.updateAccountValidator = updateAccountValidator
    this.tokenValidator = tokenValidator
  }

  async route (httpRequest) {
    try {
      const authToken = httpRequest.headers.authorization
      const formData = httpRequest.body
      if (!authToken || !formData) throw new Error()
      const { id } = await this.tokenValidator.validate(authToken)
      const accountData = await this.updateAccountValidator.validate(formData)
      const updatedAccount = await this.updateAccountUseCase.update(id, accountData)
      return HttpResponse.ok({
        message: 'Sucesso ao atualizar',
        result: updatedAccount
      })
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
