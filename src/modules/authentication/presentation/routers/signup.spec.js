const { ServerError } = require('../../../../presentation/errors')
const { InvalidParamError } = require('../../../../utils/errors')
const SignUpRouter = require('./signup')

const makeSignUpUseCase = () => {
  class SignUpUseCaseSpy {
    async register (accountData = {}) {
      this.accountData = accountData
      return this.accessToken
    }
  }
  const signUpUseCaseSpy = new SignUpUseCaseSpy()
  signUpUseCaseSpy.accessToken = 'valid_token'
  return signUpUseCaseSpy
}

const makeSignUpUseCaseWithError = () => {
  class SignUpUseCaseSpy {
    async register (accountData = {}) {
      throw new Error()
    }
  }
  const signUpUseCaseSpy = new SignUpUseCaseSpy()
  return signUpUseCaseSpy
}

const makeSignUpValidator = () => {
  class SignUpValidatorSpy {
    async validate (formData = {}) {
      const requiredFields = [
        'firstName',
        'lastName',
        'phone',
        'email',
        'password'
      ]
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new InvalidParamError(
            'Erro ao validar campos',
            { [field]: `${field} é obrigatório` }
          )
        }
      }
      this.formData = formData
      return this.formData
    }
  }
  const validator = new SignUpValidatorSpy()
  return validator
}

const makeSignUpValidatorWithError = () => {
  class SignUpValidatorSpy {
    async validate (formData = {}) {
      throw new Error()
    }
  }
  const validator = new SignUpValidatorSpy()
  return validator
}

const makeSut = () => {
  const signUpUseCaseSpy = makeSignUpUseCase()
  const signUpValidatorSpy = makeSignUpValidator()
  const sut = new SignUpRouter({
    signUpUseCase: signUpUseCaseSpy,
    signUpValidator: signUpValidatorSpy
  })
  return {
    sut,
    signUpUseCaseSpy
  }
}

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'test@mail.com',
  password: 'TestUpperLower1!'
}

describe('SignUp Router', () => {
  test('Should return 400 if any field is not provided', async () => {
    const { sut } = makeSut()
    const fields = Object.keys(signUpForm)
    for (const field of fields) {
      const httpRequest = {
        body: Object.assign({}, signUpForm, { [field]: undefined })
      }
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual({
        message: 'Erro ao validar campos',
        detail: { [field]: `${field} é obrigatório` }
      })
    }
  })

  test('Should return 400 if email already exists', async () => {
    const httpResquest = {
      body: signUpForm
    }
    const { sut, signUpUseCaseSpy } = makeSut()
    jest.spyOn(signUpUseCaseSpy, 'register')
      .mockImplementation(() => {
        throw new InvalidParamError(
          'Erro ao cadastrar',
          { email: `${signUpForm.email} already exists` }
        )
      })
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      message: 'Erro ao cadastrar',
      detail: { email: `${signUpForm.email} already exists` }
    })
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.message).toBe(new ServerError().message)
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.message).toBe(new ServerError().message)
  })

  test('Should call SignUpUseCase with correct params', async () => {
    const { sut, signUpUseCaseSpy } = makeSut()
    const httpResquest = {
      body: signUpForm
    }
    await sut.route(httpResquest)
    expect(signUpUseCaseSpy.accountData).toEqual(httpResquest.body)
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, signUpUseCaseSpy } = makeSut()
    const httpResquest = {
      body: signUpForm
    }
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(signUpUseCaseSpy.accessToken)
  })

  test('Should return 500 if invalid dependencies are provided', async () => {
    const invalid = {}
    const signUpUseCase = makeSignUpUseCase()
    const signUpValidator = makeSignUpValidator()
    const suts = [
      new SignUpRouter(),
      new SignUpRouter({
        signUpUseCase: invalid,
        signUpValidator
      }),
      new SignUpRouter({
        signUpUseCase,
        signUpValidator: invalid
      })
    ]

    for (const sut of suts) {
      const httpResquest = {
        body: signUpForm
      }
      const httpResponse = await sut.route(httpResquest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })

  test('Should return 500 if any dependency throws', async () => {
    const signUpUseCase = makeSignUpUseCase()
    const signUpValidator = makeSignUpValidator()
    const suts = [
      new SignUpRouter(),
      new SignUpRouter({
        signUpUseCase: makeSignUpUseCaseWithError(),
        signUpValidator
      }),
      new SignUpRouter({
        signUpUseCase,
        signUpValidator: makeSignUpValidatorWithError()
      })
    ]

    for (const sut of suts) {
      const httpResquest = {
        body: signUpForm
      }
      const httpResponse = await sut.route(httpResquest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })
})
