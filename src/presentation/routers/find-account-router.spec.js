const { MissingParamError } = require('../../utils/errors')
const { ServerError } = require('../errors')
const HttpResponse = require('../helpers/http-response')

class FindAccountRouter {
  constructor ({
    tokenValidator
  } = {}) {
    this.tokenValidator = tokenValidator
  }

  async route (httpRequest) {
    try {
      const headers = httpRequest.headers
      if (!headers || !headers.authorization) {
        throw new MissingParamError('token')
      }
      await this.tokenValidator.validate(headers.authorization)
      return HttpResponse.ok('Sucesso ao buscar conta')
    } catch (error) {
      if (error.name === 'MissingParamError') {
        return HttpResponse.unauthorizedError()
      }
      return HttpResponse.serverError()
    }
  }
}

const makeTokenValidator = () => {
  class TokenValidator {
    constructor (secret) {
      this.secret = secret
    }

    async validate (token) {
      this.token = token
      const payload = {
        id: 'valid_id'
      }
      return payload
    }
  }
  const tokenValidator = new TokenValidator('')
  return tokenValidator
}

const makeSut = () => {
  const tokenValidator = makeTokenValidator()
  const sut = new FindAccountRouter({
    tokenValidator
  })
  return {
    sut,
    tokenValidator
  }
}

const httpHeaders = {
  authorization: 'valid_token'
}

describe('FindAccount Router', () => {
  test('Should call TokenValidator with correct token', async () => {
    const { sut, tokenValidator } = makeSut()
    const httpRequest = {
      headers: httpHeaders
    }
    await sut.route(httpRequest)
    expect(tokenValidator.token).toEqual(httpRequest.headers.authorization)
  })

  test('Should return 200 if find an account successfuly', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      headers: httpHeaders
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  test('Should return 401 if no token is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      headers: undefined
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if invalid dependencies are provided', async () => {
    const invalid = {}
    const suts = [
      new FindAccountRouter(),
      new FindAccountRouter({}),
      new FindAccountRouter({
        tokenValidator: invalid
      })
    ]
    for (const sut of suts) {
      const httpRequest = {
        headers: httpHeaders
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })
})
