const { MissingParamError } = require('../../utils/errors')
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
      const headers = httpRequest.headers
      if (!headers || !headers.authorization) {
        throw new MissingParamError('token')
      }
      const formData = httpRequest.body
      if (!formData) {
        throw new MissingParamError('body')
      }
      const { id } = await this.tokenValidator.validate(headers.authorization)
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
      if (error.name === 'MissingParamError') {
        return HttpResponse.badRequest({
          message: error.message,
          detail: error.detail
        })
      }
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        return HttpResponse.unauthorizedError()
      }
      return HttpResponse.serverError()
    }
  }
}
