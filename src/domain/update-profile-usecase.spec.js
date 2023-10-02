const { MissingParamError, InvalidParamError } = require('../utils/errors')
const UpdateProfileUseCase = require('./update-profile-usecase')

const signUpForm = {
  id: 'valid_id',
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

const makeSut = () => {
  const loadUserByEmailRepository = makeLoadUserByEmailRepository()
  const sut = new UpdateProfileUseCase({
    loadUserByEmailRepository
  })
  return {
    sut,
    loadUserByEmailRepository
  }
}

describe('Update Profile UseCase', () => {
  test('Should return true if account has updated successfuly', async () => {
    const { sut } = makeSut()
    const result = await sut.update(signUpForm)
    expect(result).toBeTruthy()
  })

  test('Should call UpdateProfileUseCase.update with correct values', async () => {
    const { sut } = makeSut()
    const sutSpy = jest.spyOn(sut, 'update')
    await sut.update(signUpForm)
    expect(sutSpy).toHaveBeenCalledWith(signUpForm)
  })

  test('Should throw if no user id is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update(Object.assign({}, signUpForm, { id: undefined }))
    await expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  test('Should throw if email already exists', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    loadUserByEmailRepository._id = 'any_id'
    jest.spyOn(loadUserByEmailRepository, 'load').mockReturnValueOnce(
      new Promise(resolve => resolve({
        _id: this._id,
        email: this.email
      }))
    )
    const promise = sut.update(Object.assign({}, signUpForm, { id: 'any_id' }))
    await expect(promise).rejects.toThrow(new InvalidParamError(
      'Falha ao atualizar perfil',
      { email: ['O email informado já existe'] }
    ))
  })
})
