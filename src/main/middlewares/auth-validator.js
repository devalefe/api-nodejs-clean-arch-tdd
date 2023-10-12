const { MissingParamError } = require('../../modules/@shared/utils/errors')
const HttpResponse = require('../../modules/@shared/presentation/helpers/http-response')

module.exports = class AuthValidator {
  static validate (tokenValidator) {
    return async (req, res, next) => {
      try {
        const { headers } = req
        if (!headers) {
          throw new MissingParamError('headers')
        }
        if (!headers.authorization) {
          throw new MissingParamError('token')
        }
        const { id } = await tokenValidator.validate(headers.authorization)
        req.user = { id }
        next()
      } catch (error) {
        let httpResponse
        if (
          error.name === 'JsonWebTokenError' ||
          error.name === 'TokenExpiredError' ||
          error.name === 'MissingParamError'
        ) {
          httpResponse = HttpResponse.unauthorizedError()
        } else {
          httpResponse = HttpResponse.serverError()
        }
        return res.status(httpResponse.statusCode).json(httpResponse.body)
      }
    }
  }
}
