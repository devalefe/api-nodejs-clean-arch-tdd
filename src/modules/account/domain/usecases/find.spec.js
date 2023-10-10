const FindAccountUseCase = require('./find')
const { MissingParamError } = require('../../../@shared/utils/errors')

const accountFounded = {
  id: 'valid_id',
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'example@mail.com'
}

const makeLoadUserByIdRepository = () => {
  class LoadUserByIdRepositorySpy {
    async load (accountId) {
      this.accountId = accountId
      return accountFounded
    }
  }
  const loadUserByIdRepositorySpy = new LoadUserByIdRepositorySpy()
  return loadUserByIdRepositorySpy
}

const makeLoadUserByIdRepositoryWithError = () => {
  class LoadUserByIdRepositorySpy {
    async load (accountId) {
      throw new Error()
    }
  }
  const loadUserByIdRepositorySpy = new LoadUserByIdRepositorySpy()
  return loadUserByIdRepositorySpy
}

const makeSut = () => {
  const loadUserByIdRepository = makeLoadUserByIdRepository()
  const sut = new FindAccountUseCase({
    loadUserByIdRepository
  })
  return {
    sut,
    loadUserByIdRepository
  }
}

describe('ViewAccount Use Case', () => {
  test('Should return an account if valid accountId is provided', async () => {
    const { sut } = makeSut()
    const account = await sut.find('valid_id')
    expect(account).toEqual(accountFounded)
  })

  test('Should return null if no account is founded', async () => {
    const { sut, loadUserByIdRepository } = makeSut()
    jest.spyOn(loadUserByIdRepository, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
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
        loadUserByIdRepository: invalid
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
        loadUserByIdRepository: makeLoadUserByIdRepositoryWithError()
      })
    ]
    for (const sut of suts) {
      const promise = sut.find()
      await expect(promise).rejects.toThrow()
    }
  })
})
