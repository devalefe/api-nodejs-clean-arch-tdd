const { InvalidParamError } = require('../../utils/errors')
const { ServerError } = require('../errors')
const SignUpRouter = require('./signup-router')

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

const makeSut = () => {
  const signUpUseCaseSpy = makeSignUpUseCase()
  const sut = new SignUpRouter({
    signUpUseCase: signUpUseCaseSpy
  })
  return {
    sut,
    signUpUseCaseSpy
  }
}

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1',
  passwordConfirmation: 'TestUpperLower1'
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
      expect(httpResponse.body.message).toBe(`${field} is a required field`)
    }
  })

  test('Should return 400 if email already exists', async () => {
    const httpResquest = {
      body: signUpForm
    }
    const { sut, signUpUseCaseSpy } = makeSut()
    jest.spyOn(signUpUseCaseSpy, 'register')
      .mockImplementation(() => {
        throw new InvalidParamError(`${signUpForm.email} already exists`)
      })
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toBe(`${signUpForm.email} already exists`)
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

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const suts = [
      new SignUpRouter(),
      new SignUpRouter({
        signUpUseCase: invalid
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
    const suts = [
      new SignUpRouter(),
      new SignUpRouter({
        signUpUseCase: makeSignUpUseCaseWithError()
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
