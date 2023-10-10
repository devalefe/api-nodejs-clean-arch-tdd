const { ServerError, UnauthorizedError } = require('../errors')
const FindAccountRouter = require('./find-account-router')

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

const makeFindAccountUseCase = () => {
  class FindAccountUseCaseStub {
    async find (accountId) {
      this.accountId = accountId
      return {
        id: this.accountId
      }
    }
  }
  const findAccountUseCaseStub = new FindAccountUseCaseStub()
  findAccountUseCaseStub.accountId = 'valid_id'
  return findAccountUseCaseStub
}

const makeFindAccountUseCaseWithError = () => {
  class FindAccountUseCaseStub {
    async find (accountId) {
      throw new Error()
    }
  }
  const findAccountUseCaseStub = new FindAccountUseCaseStub()
  return findAccountUseCaseStub
}

const makeTokenValidator = () => {
  class TokenValidator {
    constructor (secret) {
      this.secret = secret
    }

    async validate (token) {
      this.token = token
      return this.payload
    }
  }
  const tokenValidator = new TokenValidator('')
  tokenValidator.payload = {
    id: 'valid_id'
  }
  return tokenValidator
}

const makeTokenValidatorWithError = () => {
  class TokenValidator {
    async validate (token) {
      throw new Error()
    }
  }
  const tokenValidator = new TokenValidator()
  return tokenValidator
}

const makeSut = () => {
  const findAccountUseCase = makeFindAccountUseCase()
  const tokenValidator = makeTokenValidator()
  const sut = new FindAccountRouter({
    findAccountUseCase,
    tokenValidator
  })
  return {
    sut,
    tokenValidator,
    findAccountUseCase
  }
}

const httpHeaders = {
  authorization: 'valid_token'
}

describe('FindAccount Router', () => {
  test('Should call TokenValidator with correct token', async () => {
    const { sut, tokenValidator } = makeSut()
    const httpRequest = {
      headers: httpHeaders
    }
    await sut.route(httpRequest)
    expect(tokenValidator.token).toEqual(httpRequest.headers.authorization)
  })

  test('Should call findAccountUseCase with correct id', async () => {
    const { sut, findAccountUseCase } = makeSut()
    const httpRequest = {
      headers: httpHeaders
    }
    await sut.route(httpRequest)
    expect(findAccountUseCase.accountId).toEqual('valid_id')
  })

  test('Should return 200 if find an account successfuly', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      headers: httpHeaders
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.account.id).toBe('valid_id')
  })

  test('Should return 400 if no token is provided', async () => {
    const { sut } = makeSut()
    const invalidHeaders = [
      {},
      { authorization: undefined }
    ]
    for (const invalidheader of invalidHeaders) {
      const httpRequest = {
        headers: invalidheader
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.message).toBe('Usuário não autenticado')
    }
  })

  test('Should return 401 if invalid token is provided', async () => {
    const httpRequest = {
      headers: httpHeaders
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
  })

  test('Should return 500 if httpRequest has no headers', async () => {
    const { sut } = makeSut()
    const invalidHttpRequests = [
      {},
      { headers: undefined }
    ]
    for (const invalidHttpRequest of invalidHttpRequests) {
      const httpResponse = await sut.route(invalidHttpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  test('Should return 500 if invalid dependencies are provided', async () => {
    const invalid = {}
    const tokenValidator = makeTokenValidator()
    const findAccountUseCase = makeFindAccountUseCase()
    const suts = [
      new FindAccountRouter(),
      new FindAccountRouter({}),
      new FindAccountRouter({
        tokenValidator: invalid,
        findAccountUseCase
      }),
      new FindAccountRouter({
        tokenValidator,
        findAccountUseCase: invalid
      })
    ]
    for (const sut of suts) {
      const httpRequest = {
        headers: httpHeaders
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })

  test('Should return 500 if any dependency throws', async () => {
    const tokenValidator = makeTokenValidator()
    const findAccountUseCase = makeFindAccountUseCase()
    const suts = [
      new FindAccountRouter({
        tokenValidator: makeTokenValidatorWithError(),
        findAccountUseCase
      }),
      new FindAccountRouter({
        tokenValidator,
        findAccountUseCase: makeFindAccountUseCaseWithError()
      })
    ]
    for (const sut of suts) {
      const httpRequest = {
        headers: httpHeaders
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })
})
