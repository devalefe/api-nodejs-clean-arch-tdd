const { ServerError, UnauthorizedError } = require('../errors')

module.exports = class HttpResponse {
  static ok (data) {
    return {
      statusCode: 200,
      body: { ...data }
    }
  }

  static badRequest (data) {
    return {
      statusCode: 400,
      body: {
        message: data.message
      }
    }
  }

  static unauthorizedError () {
    const unauthorizedError = new UnauthorizedError()
    return {
      statusCode: 401,
      body: {
        message: unauthorizedError.message
      }
    }
  }

  static serverError () {
    const serverError = new ServerError()
    return {
      statusCode: 500,
      body: {
        message: serverError.message
      }
    }
  }
}
