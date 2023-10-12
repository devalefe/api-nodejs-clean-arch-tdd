const { MissingParamError, InvalidParamError } = require('../../../../modules/@shared/utils/errors')
const HttpResponse = require('../../../../modules/@shared/presentation/helpers/http-response')

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
      const { user } = httpRequest
      if (!user) {
        throw new MissingParamError('user')
      }
      if (!user.id) {
        throw new MissingParamError('id')
      }
      const { body } = httpRequest
      if (!body) {
        throw new InvalidParamError('body')
      }
      const accountData = await this.updateAccountValidator.validate(body)
      const updatedAccount = await this.updateAccountUseCase.update(user.id, accountData)
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
