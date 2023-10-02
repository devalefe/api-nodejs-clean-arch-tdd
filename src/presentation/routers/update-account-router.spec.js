const { ServerError } = require('../errors')
const HttpResponse = require('../helpers/http-response')

class UpdateAccountRouter {
  async route (httpRequest) {
    try {
      const formData = httpRequest.body
      if (!formData) throw new Error()
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

describe('UpdateAccount Router', () => {
  test('Should return 500 if no httpRequest is provided', async () => {
    const sut = new UpdateAccountRouter()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.message).toBe(new ServerError().message)
  })

  test('Should return 500 if no formData is provided', async () => {
    const sut = new UpdateAccountRouter()
    const httpRequest = {
      body: undefined
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.body.message).toBe(new ServerError().message)
  })
})
