const UpdateAccountRouter = require('./update')
const { ServerError, UnauthorizedError } = require('../../../@shared/presentation/errors')
const { InvalidParamError, MissingParamError } = require('../../../@shared/utils/errors')

class JsonWebTokenErrorStub extends Error {
  constructor (message) {
    super(message)
    this.name = 'JsonWebTokenError'
  }
}

class TokenExpiredErrorStub extends Error {
  constructor (message) {
    super(message)
    this.name = 'TokenExpiredError'
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

const makeTokenValidatorWithError = () => {
  class TokenValidator {
    constructor (secret) {
      this.secret = secret
    }

    async validate (token) {
      throw new Error()
    }
  }
  const tokenValidator = new TokenValidator('')
  return tokenValidator
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
    async update (accountId, accountData = {}) {
      if (!accountId) {
        throw new MissingParamError('id')
      }
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
      this.accountId = accountId
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
  const tokenValidator = makeTokenValidator()
  const sut = new UpdateAccountRouter({
    updateAccountUseCase,
    updateAccountValidator,
    tokenValidator
  })
  return {
    sut,
    updateAccountUseCase,
    updateAccountValidator,
    tokenValidator
  }
}

const httpHeaders = {
  authorization: 'valid_token'
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
    const httpRequest = {
      headers: httpHeaders,
      body: updateAccountForm
    }
    await sut.route(httpRequest)
    expect(updateAccountValidator.formData).toEqual(updateAccountForm)
  })

  test('Should call UpdateAccountUserCase with correct values', async () => {
    const { sut, updateAccountUseCase, tokenValidator } = makeSut()
    const httpRequest = {
      headers: httpHeaders,
      body: updateAccountForm
    }
    jest.spyOn(tokenValidator, 'validate')
      .mockReturnValueOnce(
        new Promise(resolve => resolve({ id: 'any_id' }))
      )
    await sut.route(httpRequest)
    expect(updateAccountUseCase.accountId).toEqual('any_id')
    expect(updateAccountUseCase.accountData).toEqual(updateAccountForm)
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      headers: httpHeaders,
      body: Object.assign(
        {}, updateAccountForm,
        { firstName: 'Jane' }
      )
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.result).toEqual(httpRequest.body)
  })

  test('Should return 400 if any field is not provided', async () => {
    const { sut } = makeSut()
    const fields = Object.keys(updateAccountForm)
    for (const field of fields) {
      const httpRequest = {
        headers: httpHeaders,
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
    const httpRequest = {
      headers: httpHeaders,
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
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      message: 'Erro ao cadastrar',
      detail: { email: `${updateAccountForm.email} already exists` }
    })
  })

  test('Should return 401 if invalid token is provided', async () => {
    const httpRequest = {
      headers: httpHeaders,
      body: updateAccountForm
    }
    const { sut, tokenValidator } = makeSut()
    const stubs = [
      new JsonWebTokenErrorStub(),
      new TokenExpiredErrorStub()
    ]
    for (const stub of stubs) {
      jest.spyOn(tokenValidator, 'validate')
        .mockReturnValueOnce(new Promise((resolve, reject) =>
          reject(stub)
        ))
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(401)
      expect(httpResponse.body.message).toBe(new UnauthorizedError().message)
    }
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.message).toBe(new ServerError().message)
  })

  test('Should return 400 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      headers: httpHeaders,
      body: undefined
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.body.message).toBe(new MissingParamError('body').message)
  })

  test('Should return 400 if httpRequest has no authorization header', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      headers: undefined,
      body: updateAccountForm
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.body.message).toBe(new MissingParamError('token').message)
  })

  test('Should return 500 if invalid dependencies are provided', async () => {
    const invalid = {}
    const updateAccountUseCase = makeUpdateAccountUseCase()
    const updateAccountValidator = makeUpdateAccountValidator()
    const tokenValidator = makeTokenValidator()
    const suts = [
      new UpdateAccountRouter(),
      new UpdateAccountRouter({}),
      new UpdateAccountRouter({
        updateAccountUseCase: invalid,
        updateAccountValidator,
        tokenValidator
      }),
      new UpdateAccountRouter({
        updateAccountUseCase,
        updateAccountValidator: invalid,
        tokenValidator
      }),
      new UpdateAccountRouter({
        updateAccountUseCase,
        updateAccountValidator,
        tokenValidator: invalid
      })
    ]
    for (const sut of suts) {
      const httpRequest = {
        headers: httpHeaders,
        body: updateAccountForm
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })

  test('Should return 500 if any dependecy throws', async () => {
    const updateAccountUseCase = makeUpdateAccountUseCase()
    const updateAccountValidator = makeUpdateAccountValidator()
    const tokenValidator = makeTokenValidator()
    const suts = [
      new UpdateAccountRouter({
        updateAccountUseCase: makeUpdateAccountUseCaseWithError(),
        updateAccountValidator,
        tokenValidator
      }),
      new UpdateAccountRouter({
        updateAccountUseCase,
        updateAccountValidator: makeUpdateAccountValidatorWithError(),
        tokenValidator
      }),
      new UpdateAccountRouter({
        updateAccountUseCase,
        updateAccountValidator,
        tokenValidator: makeTokenValidatorWithError()
      })
    ]
    for (const sut of suts) {
      const httpRequest = {
        headers: httpHeaders,
        body: updateAccountForm
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })
})
