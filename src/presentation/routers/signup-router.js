const { MissingParamError } = require('../../utils/errors')
const HttpResponse = require('../helpers/http-response')

module.exports = class SignUpRouter {
  async route (httpRequest) {
    const { firstName } = httpRequest.body

    if (!firstName) {
      return HttpResponse.badRequest(new MissingParamError('firstName'))
    }
  }
}
