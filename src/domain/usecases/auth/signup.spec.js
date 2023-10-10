const { MissingParamError, InvalidParamError } = require('../../../utils/errors')
const SignUpUseCase = require('./signup')

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1'
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

const makeCreateAccountRepository = () => {
  class CreateAccountRepositorySpy {
    async create (userData) {
      this.userData = userData
      this.account = Object.assign({}, userData, { id: this.id, password: undefined })
      return this.account
    }
  }
  const createAccountRepositorySpy = new CreateAccountRepositorySpy()
  createAccountRepositorySpy.id = 'valid_id'
  return createAccountRepositorySpy
}

const makeCreateAccountRepositoryWithError = () => {
  class CreateAccountRepositorySpy {
    async create (userData) {
      throw new Error()
    }
  }
  const createAccountRepositorySpy = new CreateAccountRepositorySpy()
  return createAccountRepositorySpy
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

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepositorySpy {
    async update (accountId, accessToken) {
      throw new Error()
    }
  }
  return new UpdateAccessTokenRepositorySpy()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const createAccountRepositorySpy = makeCreateAccountRepository()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const sut = new SignUpUseCase({
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    createAccountRepository: createAccountRepositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })

  return {
    sut,
    encrypterSpy,
    tokenGeneratorSpy,
    loadUserByEmailRepositorySpy,
    createAccountRepositorySpy,
    updateAccessTokenRepositorySpy
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

  test('Should call TokenGenerator with correct value', async () => {
    const { sut, tokenGeneratorSpy, createAccountRepositorySpy } = makeSut()
    await sut.register(signUpForm)
    expect(tokenGeneratorSpy.accountId).toBe(createAccountRepositorySpy.id)
  })

  test('Should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountRepositorySpy } = makeSut()
    await sut.register(signUpForm)
    expect(createAccountRepositorySpy.userData).toEqual(Object.assign({}, signUpForm, { password: 'hashed_password' }))
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, createAccountRepositorySpy, updateAccessTokenRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.register(signUpForm)
    expect(updateAccessTokenRepositorySpy.accountId).toBe(createAccountRepositorySpy.account.id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  test('Should throw if account already exists', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadUserByEmailRepositorySpy, 'load')
      .mockReturnValueOnce(new Promise(resolve => resolve({ id: 'valid_id' })))
    const promise = sut.register(signUpForm)
    await expect(promise).rejects.toThrow(
      new InvalidParamError(
        'Erro ao cadastrar',
        { email: ['O email informado já existe'] }
      )
    )
  })

  test('Should returns an accessToken if user is registered successfuly', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.register(signUpForm)
    expect(accessToken).toBeTruthy()
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const createAccountRepository = makeCreateAccountRepository()
    const updateAccessTokenRepository = makeCreateAccountRepository()
    const suts = [
      new SignUpUseCase(),
      new SignUpUseCase({}),
      new SignUpUseCase({
        encrypter: invalid,
        tokenGenerator,
        loadUserByEmailRepository,
        createAccountRepository,
        updateAccessTokenRepository
      }),
      new SignUpUseCase({
        encrypter,
        tokenGenerator: invalid,
        loadUserByEmailRepository,
        createAccountRepository,
        updateAccessTokenRepository
      }),
      new SignUpUseCase({
        encrypter,
        tokenGenerator,
        loadUserByEmailRepository: invalid,
        createAccountRepository,
        updateAccessTokenRepository
      }),
      new SignUpUseCase({
        encrypter,
        tokenGenerator,
        loadUserByEmailRepository,
        createAccountRepository: invalid,
        updateAccessTokenRepository
      }),
      new SignUpUseCase({
        encrypter,
        tokenGenerator,
        loadUserByEmailRepository,
        createAccountRepository,
        updateAccessTokenRepository: invalid
      })
    ]

    for (const sut of suts) {
      const promise = sut.register(signUpForm)
      await expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', async () => {
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const createAccountRepository = makeCreateAccountRepository()
    const updateAccessTokenRepository = makeCreateAccountRepository()
    const suts = [
      new SignUpUseCase({
        encrypter: makeEncrypterWithError(),
        tokenGenerator,
        loadUserByEmailRepository,
        createAccountRepository,
        updateAccessTokenRepository
      }),
      new SignUpUseCase({
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
        loadUserByEmailRepository,
        createAccountRepository,
        updateAccessTokenRepository
      }),
      new SignUpUseCase({
        encrypter,
        tokenGenerator,
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError(),
        createAccountRepository,
        updateAccessTokenRepository
      }),
      new SignUpUseCase({
        encrypter,
        tokenGenerator,
        loadUserByEmailRepository,
        createAccountRepository: makeCreateAccountRepositoryWithError(),
        updateAccessTokenRepository
      }),
      new SignUpUseCase({
        encrypter,
        tokenGenerator,
        loadUserByEmailRepository,
        createAccountRepository,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError()
      })
    ]

    for (const sut of suts) {
      const promise = sut.register(signUpForm)
      await expect(promise).rejects.toThrow()
    }
  })
})
