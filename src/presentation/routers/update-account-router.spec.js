const { ServerError } = require('../errors')
const UpdateAccountRouter = require('./update-account-router')

const updateAccountForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'example@mail.com'
}

const makeUpdateAccountUseCase = () => {
  class UpdateAccountUseCaseSpy {
    async update (formData = {}) {
      this.formData = formData
      return true
    }
  }
  const updateAccountUseCaseSpy = new UpdateAccountUseCaseSpy()
  return updateAccountUseCaseSpy
}

const makeSut = () => {
  const updateAccountUseCase = makeUpdateAccountUseCase()
  const sut = new UpdateAccountRouter({
    updateAccountUseCase
  })
  return {
    sut,
    updateAccountUseCase
  }
}

describe('UpdateAccount Router', () => {
  test('Should call UpdateAccountUserCase with correct values', async () => {
    const { sut, updateAccountUseCase } = makeSut()
    const httpResquest = {
      body: updateAccountForm
    }
    await sut.route(httpResquest)
    expect(updateAccountUseCase.formData).toEqual(updateAccountForm)
  })

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
