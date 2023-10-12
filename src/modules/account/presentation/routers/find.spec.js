const FindAccountRouter = require('./find')
const { ServerError } = require('../../../@shared/presentation/errors')

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

const makeSut = () => {
  const findAccountUseCase = makeFindAccountUseCase()
  const sut = new FindAccountRouter({
    findAccountUseCase
  })
  return {
    sut,
    findAccountUseCase
  }
}

const httpRequest = {
  user: {
    id: 'valid_id'
  }
}

describe('FindAccount Router', () => {
  test('Should call findAccountUseCase with correct id', async () => {
    const { sut, findAccountUseCase } = makeSut()
    await sut.route(httpRequest)
    expect(findAccountUseCase.accountId).toEqual('valid_id')
  })

  test('Should return 200 if find an account successfuly', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.account.id).toBe('valid_id')
  })

  test('Should return 500 if invalid user is provided', async () => {
    const { sut } = makeSut()
    const invalidParams = [
      {},
      { id: undefined }
    ]
    for (const param of invalidParams) {
      const httpRequest = {
        user: param
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if httpRequest has no user', async () => {
    const { sut } = makeSut()
    const invalidHttpRequests = [
      {},
      { user: undefined }
    ]
    for (const invalidHttpRequest of invalidHttpRequests) {
      const httpResponse = await sut.route(invalidHttpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  test('Should return 500 if invalid dependencies are provided', async () => {
    const invalid = {}
    const suts = [
      new FindAccountRouter(),
      new FindAccountRouter({}),
      new FindAccountRouter({
        findAccountUseCase: invalid
      })
    ]
    for (const sut of suts) {
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })

  test('Should return 500 if any dependency throws', async () => {
    const suts = [
      new FindAccountRouter({
        findAccountUseCase: makeFindAccountUseCaseWithError()
      })
    ]
    for (const sut of suts) {
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })
})
