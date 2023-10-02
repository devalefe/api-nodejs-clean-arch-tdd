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

const makeSut = () => {
  const sut = new UpdateAccountRouter()
  return {
    sut
  }
}

describe('UpdateAccount Router', () => {
  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.message).toBe(new ServerError().message)
  })

  test('Should return 500 if no formData is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: undefined
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.body.message).toBe(new ServerError().message)
  })
})
