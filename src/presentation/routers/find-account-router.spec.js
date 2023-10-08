const { MissingParamError } = require('../../utils/errors')
const HttpResponse = require('../helpers/http-response')

class FindAccountRouter {
  async route (httpRequest) {
    try {
      if (!httpRequest) {
        throw new MissingParamError('httpRequest')
      }
      return HttpResponse.ok('Sucesso ao buscar conta')
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

const httpHeaders = {
  authorization: 'valid_token'
}

describe('FindAccount Router', () => {
  test('Should return 200 if find an account successfuly', async () => {
    const sut = new FindAccountRouter()
    const httpRequest = {
      headers: httpHeaders
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const sut = new FindAccountRouter()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })
})
