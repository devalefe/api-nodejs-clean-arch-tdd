const HttpResponse = require('../helpers/http-response')

class FindAccountRouter {
  async route (httpRequest) {
    return HttpResponse.ok('Sucesso ao buscar conta')
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
})
