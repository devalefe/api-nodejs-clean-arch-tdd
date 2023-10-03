const { ServerError } = require('../errors')
const { InvalidParamError } = require('../../utils/errors')
const UpdateAccountRouter = require('./update-account-router')

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

const makeUpdateAccountValidatorWithError = () => {
  class UpdateAccountValidatorSpy {
    async validate (formData = {}) {
      throw new Error()
    }
  }
  const updateAccountValidatorSpy = new UpdateAccountValidatorSpy()
  return updateAccountValidatorSpy
}

const makeUpdateAccountUseCase = () => {
  class UpdateAccountUseCaseSpy {
    async update (accountData = {}) {
      const requiredFields = [
        'firstName',
        'lastName',
        'phone',
        'email'
      ]
      for (const field of requiredFields) {
        if (!accountData[field]) {
          throw new InvalidParamError(
            'Erro ao validar campos',
            { [field]: `${field} é obrigatório` }
          )
        }
      }
      this.accountData = accountData
      return this.accountData
    }
  }
  const updateAccountUseCaseSpy = new UpdateAccountUseCaseSpy()
  return updateAccountUseCaseSpy
}

const makeUpdateAccountUseCaseWithError = () => {
  class UpdateAccountUseCaseSpy {
    async update (accountData = {}) {
      throw new Error()
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

const updateAccountForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'example@mail.com'
}

describe('UpdateAccount Router', () => {
  test('Should call UpdateAccountValidator with correct values', async () => {
    const { sut, updateAccountValidator } = makeSut()
    const httpResquest = {
      body: updateAccountForm
    }
    await sut.route(httpResquest)
    expect(updateAccountValidator.formData).toEqual(updateAccountForm)
  })

  test('Should call UpdateAccountUserCase with correct values', async () => {
    const { sut, updateAccountUseCase } = makeSut()
    const httpResquest = {
      body: updateAccountForm
    }
    await sut.route(httpResquest)
    expect(updateAccountUseCase.accountData).toEqual(updateAccountForm)
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: Object.assign(
        {}, updateAccountForm,
        { firstName: 'Jane' }
      )
    }
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.result).toEqual(httpResquest.body)
  })

  test('Should return 400 if any field is not provided', async () => {
    const { sut } = makeSut()
    const fields = Object.keys(updateAccountForm)
    for (const field of fields) {
      const httpRequest = {
        body: Object.assign({}, updateAccountForm, { [field]: undefined })
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual({
        message: 'Erro ao validar campos',
        detail: { [field]: `${field} é obrigatório` }
      })
    }
  })

  test('Should return 400 if email already exists', async () => {
    const httpResquest = {
      body: updateAccountForm
    }
    const { sut, updateAccountUseCase } = makeSut()
    jest.spyOn(updateAccountUseCase, 'update')
      .mockImplementation(() => {
        throw new InvalidParamError(
          'Erro ao cadastrar',
          { email: `${updateAccountForm.email} already exists` }
        )
      })
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      message: 'Erro ao cadastrar',
      detail: { email: `${updateAccountForm.email} already exists` }
    })
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.message).toBe(new ServerError().message)
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: undefined
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.body.message).toBe(new ServerError().message)
  })

  test('Should return 500 if invalid dependencies are provided', async () => {
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

  test('Should return 500 if any dependecy throws', async () => {
    const updateAccountUseCase = makeUpdateAccountUseCase()
    const updateAccountValidator = makeUpdateAccountValidator()
    const suts = [
      new UpdateAccountRouter({
        updateAccountUseCase: makeUpdateAccountUseCaseWithError(),
        updateAccountValidator
      }),
      new UpdateAccountRouter({
        updateAccountUseCase,
        updateAccountValidator: makeUpdateAccountValidatorWithError()
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
