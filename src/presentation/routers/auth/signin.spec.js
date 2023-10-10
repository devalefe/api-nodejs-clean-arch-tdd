const SignInRouter = require('./signin')
const { UnauthorizedError, ServerError } = require('../../errors')
const { MissingParamError, InvalidParamError } = require('../../../utils/errors')

const makeSut = () => {
  const signInUseCaseSpy = makeSignInUseCase()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new SignInRouter({
    signInUseCase: signInUseCaseSpy,
    emailValidator: emailValidatorSpy
  })
  return {
    sut,
    signInUseCaseSpy,
    emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }

  return new EmailValidatorSpy()
}

const makeSignInUseCase = () => {
  class SignInUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  const signInUseCaseSpy = new SignInUseCaseSpy()
  signInUseCaseSpy.accessToken = 'valid_token'
  return signInUseCaseSpy
}

const makeSignInUseCaseWithError = () => {
  class SignInUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }

  return new SignInUseCaseSpy()
}

describe('SignIn Router', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toBe(new MissingParamError('email').message)
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toBe(new MissingParamError('password').message)
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

  test('Should call SignInUseCase with correct params', async () => {
    const { sut, signInUseCaseSpy } = makeSut()
    const httpResquest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    await sut.route(httpResquest)
    expect(signInUseCaseSpy.email).toBe(httpResquest.body.email)
    expect(signInUseCaseSpy.password).toBe(httpResquest.body.password)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, signInUseCaseSpy } = makeSut()
    signInUseCaseSpy.accessToken = undefined
    const httpResquest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body.message).toBe(new UnauthorizedError().message)
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, signInUseCaseSpy } = makeSut()
    const httpResquest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(signInUseCaseSpy.accessToken)
  })

  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpResquest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toBe(new InvalidParamError('email').message)
  })

  test('Should call EmailValidator with correct params', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpResquest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    await sut.route(httpResquest)
    expect(emailValidatorSpy.email).toBe(httpResquest.body.email)
  })

  test('Should return 500 if invalid dependencies are provided', async () => {
    const invalid = {}
    const signInUseCaseSpy = makeSignInUseCase()
    const suts = [
      new SignInRouter(),
      new SignInRouter({
        signInUseCase: invalid
      }),
      new SignInRouter({
        signInUseCase: signInUseCaseSpy
      }),
      new SignInRouter({
        signInUseCase: signInUseCaseSpy,
        emailValidator: invalid
      })
    ]

    for (const sut of suts) {
      const httpResquest = {
        body: {
          email: 'any_email@email.com',
          password: 'any_password'
        }
      }
      const httpResponse = await sut.route(httpResquest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })

  test('Should return 500 if any dependency throws', async () => {
    const suts = [
      new SignInRouter({
        signInUseCase: makeSignInUseCaseWithError()
      }),
      new SignInRouter({
        signInUseCase: makeSignInUseCase(),
        emailValidator: makeEmailValidatorWithError()
      })
    ]

    for (const sut of suts) {
      const httpResquest = {
        body: {
          email: 'any_email@email.com',
          password: 'any_password'
        }
      }
      const httpResponse = await sut.route(httpResquest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(new ServerError().message)
    }
  })
})
