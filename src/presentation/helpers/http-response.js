const { ServerError, UnauthorizedError } = require('../errors')

module.exports = class HttpResponse {
  static ok ({ message, detail, ...props }) {
    return {
      statusCode: 200,
      body: { message, detail, ...props }
    }
  }

  static badRequest ({ message, detail, ...props }) {
    return {
      statusCode: 400,
      body: { message, detail, ...props }
    }
  }

  static unauthorizedError () {
    const { message } = new UnauthorizedError()
    return {
      statusCode: 401,
      body: { message }
    }
  }

  static serverError () {
    const { message } = new ServerError()
    return {
      statusCode: 500,
      body: { message }
    }
  }
}
