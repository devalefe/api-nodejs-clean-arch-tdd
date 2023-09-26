const { MissingParamError, InvalidParamError } = require('../utils/errors')
const SignUpUseCase = require('./signup-usecase')

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1'
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return null
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id'
  }
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

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new SignUpUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy
  }
}

describe('SignUp UseCase', () => {
  test('Should throw if any field is missing', async () => {
    const { sut } = makeSut()
    for (const field of Object.keys(signUpForm)) {
      const promise = sut.register({ ...signUpForm, [field]: undefined })
      await expect(promise).rejects.toThrow(new MissingParamError(`Missing param: ${field}`))
    }
  })

  test('Should throw if no LoadUserByEmailRepository is provided', async () => {
    const sut = new SignUpUseCase()
    const promise = sut.register(signUpForm)
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.register(signUpForm)
    expect(loadUserByEmailRepositorySpy.email).toBe(signUpForm.email)
  })

  test('Should throw if email already exists', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadUserByEmailRepositorySpy, 'load').mockReturnValueOnce(new Promise(resolve => resolve({ id: 'valide_id' })))
    const promise = sut.register(signUpForm)
    await expect(promise).rejects.toThrow(new InvalidParamError('Invalid param: email already in use'))
  })

  test('Should throw if LoadUserByEmailRepository throws', async () => {
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError()
    })
    const promise = sut.register(signUpForm)
    await expect(promise).rejects.toThrow()
  })
})
