const { ServerError } = require('../errors')
const UpdateAccountRouter = require('./update-account-router')

const updateAccountForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'example@mail.com'
}

const makeUpdateAccountValidator = () => {
  class UpdateAccountValidatorSpy {
    async validate (formData = {}) {
      this.formData = formData
      return this.formData
    }
  }
  const updateAccountValidatorSpy = new UpdateAccountValidatorSpy()
  return updateAccountValidatorSpy
}

const makeUpdateAccountUseCase = () => {
  class UpdateAccountUseCaseSpy {
    async update (accountData = {}) {
      this.accountData = accountData
      return true
    }
  }
  const updateAccountUseCaseSpy = new UpdateAccountUseCaseSpy()
  return updateAccountUseCaseSpy
}

const makeSut = () => {
  const updateAccountUseCase = makeUpdateAccountUseCase()
  const updateAccountValidator = makeUpdateAccountValidator()
  const sut = new UpdateAccountRouter({
    updateAccountUseCase,
    updateAccountValidator
  })
  return {
    sut,
    updateAccountUseCase,
    updateAccountValidator
  }
}

describe('UpdateAccount Router', () => {
  test('Should call UpdateAccountUserCase with correct values', async () => {
    const { sut, updateAccountUseCase } = makeSut()
    const httpResquest = {
      body: updateAccountForm
    }
    await sut.route(httpResquest)
    expect(updateAccountUseCase.accountData).toEqual(updateAccountForm)
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
    const updateAccountUseCase = makeUpdateAccountUseCase()
    const updateAccountValidator = makeUpdateAccountValidator()
    const suts = [
      new UpdateAccountRouter(),
      new UpdateAccountRouter({}),
      new UpdateAccountRouter({
        updateAccountUseCase: invalid,
        updateAccountValidator
      }),
      new UpdateAccountRouter({
        updateAccountUseCase,
        updateAccountValidator: invalid
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
