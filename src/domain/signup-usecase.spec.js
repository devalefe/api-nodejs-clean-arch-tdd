const { MissingParamError, InvalidParamError } = require('../utils/errors')
const SignUpUseCase = require('./signup-usecase')

const userFormData = {
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

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (accountId) {
      this.accountId = accountId
      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'valid_token'
  return tokenGeneratorSpy
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate (accountId) {
      throw new Error()
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  return tokenGeneratorSpy
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositorySpy {
    async update (accountId, accessToken) {
      this.accountId = accountId
      this.accessToken = accessToken
    }
  }
  return new UpdateAccessTokenRepositorySpy()
}

const makeCreateUserAccountRepository = () => {
  class CreateUserAccountRepositorySpy {
    async save (userData) {
      this.userData = userData
      this.account = Object.assign({}, userData, { id: this.id, password: undefined })
      return this.account
    }
  }
  const createUserAccountRepositorySpy = new CreateUserAccountRepositorySpy()
  createUserAccountRepositorySpy.id = 'valid_id'
  return createUserAccountRepositorySpy
}

const makeCreateUserAccountRepositoryWithError = () => {
  class CreateUserAccountRepositorySpy {
    async save (userData) {
      throw new Error()
    }
  }
  const createUserAccountRepositorySpy = new CreateUserAccountRepositorySpy()
  return createUserAccountRepositorySpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const createUserAccountRepositorySpy = makeCreateUserAccountRepository()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const sut = new SignUpUseCase({
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    createUserAccountRepository: createUserAccountRepositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })

  return {
    sut,
    encrypterSpy,
    tokenGeneratorSpy,
    loadUserByEmailRepositorySpy,
    createUserAccountRepositorySpy,
    updateAccessTokenRepositorySpy
  }
}

describe('SignUp UseCase', () => {
  test('Should throw if any field is missing', async () => {
    const { sut } = makeSut()
    for (const field of Object.keys(userFormData)) {
      const promise = sut.register({ ...userFormData, [field]: undefined })
      await expect(promise).rejects.toThrow(new MissingParamError(`Missing param: ${field}`))
    }
  })

  test('Should call SignUpUseCase.register with correct values', async () => {
    const { sut } = makeSut()
    const sutSpy = jest.spyOn(sut, 'register')
    await sut.register(userFormData)
    expect(sutSpy).toBeCalledWith(userFormData)
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.register(userFormData)
    expect(loadUserByEmailRepositorySpy.email).toBe(userFormData.email)
  })

  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterSpy } = makeSut()
    await sut.register(userFormData)
    expect(encrypterSpy.password).toBe(userFormData.password)
  })

  test('Should call TokenGenerator with correct value', async () => {
    const { sut, tokenGeneratorSpy, createUserAccountRepositorySpy } = makeSut()
    await sut.register(userFormData)
    expect(tokenGeneratorSpy.accountId).toBe(createUserAccountRepositorySpy.id)
  })

  test('Should call CreateUserAccountRepository with correct values', async () => {
    const { sut, createUserAccountRepositorySpy } = makeSut()
    await sut.register(userFormData)
    expect(createUserAccountRepositorySpy.userData).toEqual(Object.assign({}, userFormData, { password: 'hashed_password' }))
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, createUserAccountRepositorySpy, updateAccessTokenRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.register(userFormData)
    expect(updateAccessTokenRepositorySpy.accountId).toBe(createUserAccountRepositorySpy.account.id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  test('Should throw if email already exists', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadUserByEmailRepositorySpy, 'load').mockReturnValueOnce(new Promise(resolve => resolve({ id: 'valide_id' })))
    const promise = sut.register(userFormData)
    await expect(promise).rejects.toThrow(new InvalidParamError('Invalid param: email already in use'))
  })

  test('Should returns an accessToken if user is registered successfuly', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.register(userFormData)
    expect(accessToken).toBeTruthy()
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const encrypter = makeEncrypter()
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const createUserAccountRepository = makeCreateUserAccountRepository()
    const suts = [
      new SignUpUseCase(),
      new SignUpUseCase({}),
      new SignUpUseCase({
        loadUserByEmailRepository: invalid
      }),
      new SignUpUseCase({
        encrypter: invalid,
        loadUserByEmailRepository
      }),
      new SignUpUseCase({
        encrypter,
        loadUserByEmailRepository,
        createUserAccountRepository: invalid
      }),
      new SignUpUseCase({
        encrypter,
        tokenGenerator: invalid,
        loadUserByEmailRepository,
        createUserAccountRepository
      })
    ]

    for (const sut of suts) {
      const promise = sut.register(userFormData)
      await expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const encrypter = makeEncrypter()
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const createUserAccountRepository = makeCreateUserAccountRepository()
    const suts = [
      new SignUpUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError()
      }),
      new SignUpUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError()
      }),
      new SignUpUseCase({
        encrypter,
        loadUserByEmailRepository,
        createUserAccountRepository: makeCreateUserAccountRepositoryWithError()
      }),
      new SignUpUseCase({
        encrypter,
        loadUserByEmailRepository,
        createUserAccountRepository,
        tokenGenerator: makeTokenGeneratorWithError()
      })
    ]

    for (const sut of suts) {
      const promise = sut.register(userFormData)
      await expect(promise).rejects.toThrow()
    }
  })
})
