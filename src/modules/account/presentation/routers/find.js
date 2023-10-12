const HttpResponse = require('../../../@shared/presentation/helpers/http-response')
const { MissingParamError } = require('../../../@shared/utils/errors')

module.exports = class FindAccountRouter {
  constructor ({
    findAccountUseCase
  } = {}) {
    this.findAccountUseCase = findAccountUseCase
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
      const account = await this.findAccountUseCase.find(user.id)
      return HttpResponse.ok({
        message: 'Sucesso ao buscar conta',
        account
      })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
