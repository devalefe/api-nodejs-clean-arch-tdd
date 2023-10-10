const { MissingParamError } = require('../../../../utils/errors')
const HttpResponse = require('../../../../presentation/helpers/http-response')

module.exports = class FindAccountRouter {
  constructor ({
    findAccountUseCase,
    tokenValidator
  } = {}) {
    this.findAccountUseCase = findAccountUseCase
    this.tokenValidator = tokenValidator
  }

  async route (httpRequest) {
    try {
      const { headers } = httpRequest
      if (!headers) {
        throw new MissingParamError('headers')
      }
      if (!headers.authorization) {
        throw new MissingParamError('token')
      }
      const { id } = await this.tokenValidator.validate(headers.authorization)
      const account = await this.findAccountUseCase.find(id)
      return HttpResponse.ok({
        message: 'Sucesso ao buscar conta',
        account
      })
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError' ||
        error.message === 'token'
      ) {
        return HttpResponse.unauthorizedError()
      }
      if (error.name === 'MissingParamError') {
        return HttpResponse.badRequest(error)
      }
      return HttpResponse.serverError()
    }
  }
}
