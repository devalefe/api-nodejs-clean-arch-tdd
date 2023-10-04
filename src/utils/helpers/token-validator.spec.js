jest.mock('jsonwebtoken', () => ({
  secret: '',
  token: '',
  payload: {
    id: 'any_id'
  },

  verify (token, secret) {
    this.token = token
    this.secret = secret
    return this.token
  }
}))

const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')

class TokenValidator {
  constructor (secret) {
    this.secret = secret
  }

  async validate (token) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }
    if (!token) {
      throw new MissingParamError('token')
    }
    return jwt.verify(token)
  }
}

const makeSut = () => {
  const sut = new TokenValidator('secret')
  return {
    sut
  }
}

describe('Token Validator', () => {
  test('Should call TokenValidator.validate with correct token', async () => {
    const { sut } = makeSut()
    await sut.validate('any_token')
    expect(jwt.token).toBe('any_token')
  })

  test('Should throw if no secret is provided', async () => {
    const sut = new TokenValidator()
    const promise = sut.validate('any_token')
    await expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  test('Should throw if no token is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.validate()
    await expect(promise).rejects.toThrow(new MissingParamError('token'))
  })
})
