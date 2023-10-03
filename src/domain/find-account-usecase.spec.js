const { MissingParamError } = require('../utils/errors')

class FindAccountUseCase {
  constructor ({
    findAccountByIdRepository
  } = {}) {
    this.findAccountByIdRepository = findAccountByIdRepository
  }

  async find (accountId) {
    if (!accountId) {
      throw new MissingParamError('accountId')
    }
    const account = await this.findAccountByIdRepository.find(accountId)
    return account
  }
}

const makeFindAccountByIdRepository = () => {
  class FindAccountByIdRepositorySpy {
    async find (accountId) {
      this.accountId = accountId
      return {
        _id: this.accountId
      }
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
    sut
  }
}

describe('ViewAccount Use Case', () => {
  test('Should return an account if valid accountId is provided', async () => {
    const { sut } = makeSut()
    const account = await sut.find('valid_id')
    expect(account).toEqual({
      _id: 'valid_id'
    })
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

  test('Should throw if invalid params are provided', async () => {
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
