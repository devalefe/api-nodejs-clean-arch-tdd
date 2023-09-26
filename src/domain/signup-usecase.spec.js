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

const makeEncrypter = () => {
  class EncrypterSpy {
    async hash (password, salt) {
      this.password = password
      this.salt = salt
      return this.hashedPassword
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.hashedPassword = 'hashed_password'
  return encrypterSpy
}

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }
  return new EncrypterSpy()
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const encrypterSpy = makeEncrypter()
  const sut = new SignUpUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy
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

  test('Should call SignUpUseCase.register with correct values', async () => {
    const { sut } = makeSut()
    const sutSpy = jest.spyOn(sut, 'register')
    await sut.register(signUpForm)
    expect(sutSpy).toBeCalledWith(signUpForm)
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.register(signUpForm)
    expect(loadUserByEmailRepositorySpy.email).toBe(signUpForm.email)
  })

  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterSpy } = makeSut()
    await sut.register(signUpForm)
    expect(encrypterSpy.password).toBe(signUpForm.password)
  })

  test('Should throw if email already exists', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadUserByEmailRepositorySpy, 'load').mockReturnValueOnce(new Promise(resolve => resolve({ id: 'valide_id' })))
    const promise = sut.register(signUpForm)
    await expect(promise).rejects.toThrow(new InvalidParamError('Invalid param: email already in use'))
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const suts = [
      new SignUpUseCase(),
      new SignUpUseCase({}),
      new SignUpUseCase({
        loadUserByEmailRepository: invalid,
        encrypter: invalid
      }),
      new SignUpUseCase({
        loadUserByEmailRepository,
        encrypter: invalid
      })
    ]

    for (const sut of suts) {
      const promise = sut.register(signUpForm)
      await expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const suts = [
      new SignUpUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError()
      }),
      new SignUpUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError()
      })
    ]

    for (const sut of suts) {
      const promise = sut.register(signUpForm)
      await expect(promise).rejects.toThrow()
    }
  })
})
