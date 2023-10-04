const { MissingParamError } = require('../../../utils/errors')
const FindAccountUseCase = require('./find')

const accountFounded = {
  id: 'valid_id',
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'example@mail.com'
}

const makeFindAccountByIdRepository = () => {
  class FindAccountByIdRepositorySpy {
    async find (accountId) {
      this.accountId = accountId
      return accountFounded
    }
  }
  const findAccountByIdRepositorySpy = new FindAccountByIdRepositorySpy()
  return findAccountByIdRepositorySpy
}

const makeFindAccountByIdRepositoryWithError = () => {
  class FindAccountByIdRepositorySpy {
    async find (accountId) {
      throw new Error()
    }
  }
  const findAccountByIdRepositorySpy = new FindAccountByIdRepositorySpy()
  return findAccountByIdRepositorySpy
}

const makeSut = () => {
  const findAccountByIdRepository = makeFindAccountByIdRepository()
  const sut = new FindAccountUseCase({
    findAccountByIdRepository
  })
  return {
    sut,
    findAccountByIdRepository
  }
}

describe('ViewAccount Use Case', () => {
  test('Should return an account if valid accountId is provided', async () => {
    const { sut } = makeSut()
    const account = await sut.find('valid_id')
    expect(account).toEqual(accountFounded)
  })

  test('Should return null if no account is founded', async () => {
    const { sut, findAccountByIdRepository } = makeSut()
    jest.spyOn(findAccountByIdRepository, 'find').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.find('valid_id')
    expect(account).toBeNull()
  })

  test('Should call FindAccountUseCase.find with correct id', async () => {
    const { sut } = makeSut()
    const sutSpy = jest.spyOn(sut, 'find')
    await sut.find('any_id')
    expect(sutSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if no accountId is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.find()
    await expect(promise).rejects.toThrow(new MissingParamError('accountId'))
  })

  test('Should throw if invalid dependecies are provided', async () => {
    const invalid = {}
    const suts = [
      new FindAccountUseCase(),
      new FindAccountUseCase({}),
      new FindAccountUseCase({
        findAccountByIdRepository: invalid
      })
    ]
    for (const sut of suts) {
      const promise = sut.find()
      await expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const suts = [
      new FindAccountUseCase({
        findAccountByIdRepository: makeFindAccountByIdRepositoryWithError()
      })
    ]
    for (const sut of suts) {
      const promise = sut.find()
      await expect(promise).rejects.toThrow()
    }
  })
})