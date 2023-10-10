const { MissingParamError, InvalidParamError } = require('../../../../utils/errors')
const UpdateAccountUseCase = require('./update')

const accountId = 'valid_id'

const updateAccountForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1'
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this._id = 'any_id'
      this.email = email
      return null
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  return loadUserByEmailRepositorySpy
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      throw new Error()
    }
  }
  return new LoadUserByEmailRepositorySpy()
}

const makeUpdateAccountRepository = () => {
  class UpdateAccountRepository {
    async update (accountId, accountData = {}) {
      this.accountId = accountId
      this.accountData = accountData
      return true
    }
  }
  const updateAccountRepository = new UpdateAccountRepository()
  return updateAccountRepository
}

const makeUpdateAccountRepositoryWithError = () => {
  class UpdateAccountRepository {
    async update (accountId, accountData = {}) {
      throw new Error()
    }
  }
  const updateAccountRepository = new UpdateAccountRepository()
  return updateAccountRepository
}

const makeSut = () => {
  const loadUserByEmailRepository = makeLoadUserByEmailRepository()
  const updateAccountRepository = makeUpdateAccountRepository()
  const sut = new UpdateAccountUseCase({
    loadUserByEmailRepository,
    updateAccountRepository
  })
  return {
    sut,
    loadUserByEmailRepository,
    updateAccountRepository
  }
}

describe('Update Account UseCase', () => {
  test('Should return true if account has updated successfuly', async () => {
    const { sut } = makeSut()
    const result = await sut.update(accountId, updateAccountForm)
    expect(result).toBeTruthy()
  })

  test('Should call UpdateAccountUseCase.update with correct values', async () => {
    const { sut } = makeSut()
    const sutSpy = jest.spyOn(sut, 'update')
    await sut.update(accountId, updateAccountForm)
    expect(sutSpy).toHaveBeenCalledWith(accountId, updateAccountForm)
  })

  test('Should throw if no user id is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update(undefined, updateAccountForm)
    await expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  test('Should throw if email already exists', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    loadUserByEmailRepository._id = 'valid_id'
    jest.spyOn(loadUserByEmailRepository, 'load').mockReturnValueOnce(
      new Promise(resolve => resolve({
        _id: this._id,
        email: this.email
      }))
    )
    const promise = sut.update('valid_id', updateAccountForm)
    await expect(promise).rejects.toThrow(new InvalidParamError(
      'Falha ao atualizar perfil',
      { email: ['O email informado já existe'] }
    ))
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const updateAccountRepository = makeUpdateAccountRepository()
    const suts = [
      new UpdateAccountUseCase(),
      new UpdateAccountUseCase({}),
      new UpdateAccountUseCase({
        loadUserByEmailRepository: invalid,
        updateAccountRepository
      }),
      new UpdateAccountUseCase({
        loadUserByEmailRepository,
        updateAccountRepository: invalid
      })
    ]
    for (const sut of suts) {
      const promise = sut.update(updateAccountForm)
      await expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepositoryWithError()
    const updateAccountRepository = makeUpdateAccountRepositoryWithError()
    const suts = [
      new UpdateAccountUseCase({
        loadUserByEmailRepository,
        updateAccountRepository
      })
    ]
    for (const sut of suts) {
      const promise = sut.update(updateAccountForm)
      await expect(promise).rejects.toThrow()
    }
  })
})
