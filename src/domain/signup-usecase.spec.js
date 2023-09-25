const { MissingParamError } = require('../utils/errors')
const SignUpUseCase = require('./signup-usecase')

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1'
}

class LoadUserByEmailRepositorySpy {
  async load (email) {
    this.email = email
    return this.user
  }
}

const makeSut = () => {
  const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy()
  const sut = new SignUpUseCase({
    loadUserByEmailRepository
  })

  return {
    sut,
    loadUserByEmailRepository
  }
}

describe('SignUp UseCase', () => {
  test('Should throw if any field is missing', async () => {
    const { sut } = makeSut()
    const promise = sut.register({ ...signUpForm, firstName: undefined })
    await expect(promise).rejects.toThrow(new MissingParamError('Missing param: firstName'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepository } = makeSut()
    await sut.register(signUpForm)
    expect(loadUserByEmailRepository.email).toBe(signUpForm.email)
  })
})
