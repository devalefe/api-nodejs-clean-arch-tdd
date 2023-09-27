const MissingParamError = require('../../utils/errors/missing-param-error')
const HttpResponse = require('../helpers/http-response')

module.exports = class SignUpRouter {
  async route (httpRequest) {
    const accountFormData = httpRequest.body
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!accountFormData[field]) {
        return HttpResponse.badRequest(new MissingParamError(`${field} is a required field`))
      }
    }
  }
}
