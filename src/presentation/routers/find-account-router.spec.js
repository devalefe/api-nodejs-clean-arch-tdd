const { MissingParamError } = require('../../utils/errors')
const HttpResponse = require('../helpers/http-response')

class FindAccountRouter {
  async route (httpRequest) {
    try {
      const headers = httpRequest.headers
      if (!headers || !headers.authorization) {
        throw new MissingParamError('token')
      }
      return HttpResponse.ok('Sucesso ao buscar conta')
    } catch (error) {
      if (error.name === 'MissingParamError') {
        return HttpResponse.unauthorizedError()
      }
      return HttpResponse.serverError()
    }
  }
}

const makeSut = () => {
  const sut = new FindAccountRouter()
  return {
    sut
  }
}

const httpHeaders = {
  authorization: 'valid_token'
}

describe('FindAccount Router', () => {
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
})
