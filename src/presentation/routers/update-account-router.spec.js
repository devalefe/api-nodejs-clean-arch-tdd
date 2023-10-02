const { ServerError } = require('../errors')
const HttpResponse = require('../helpers/http-response')

const updateAccountForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'example@mail.com'
}

class UpdateAccountRouter {
  constructor ({
    updateAccountUseCase
  } = {}) {
    this.updateAccountUseCase = updateAccountUseCase
  }

  async route (httpRequest) {
    try {
      const formData = httpRequest.body
      if (!formData) throw new Error()
      await this.updateAccountUseCase.update()
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

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const suts = [
      new UpdateAccountRouter(),
      new UpdateAccountRouter({}),
      new UpdateAccountRouter({
        updateAccountUseCase: invalid
      })
    ]
    for (const sut of suts) {
      const httpResquest = {
        body: updateAccountForm
      }
      const httpResponse = await sut.route(httpResquest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })
})
