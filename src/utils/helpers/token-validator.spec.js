jest.mock('jsonwebtoken', () => ({
  secret: '',
  token: '',
  payload: {
    id: 'any_id'
  },

  verify (token, secret) {
    this.token = token
    this.secret = secret
    return this.payload
  }
}))

const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')
const TokenValidator = require('./token-validator')

const makeSut = () => {
  const sut = new TokenValidator('secret')
  return {
    sut
  }
}

describe('Token Validator', () => {
  test('Should return an payload if jwt returns an payload', async () => {
    const { sut } = makeSut()
    const payload = await sut.validate('valid_token')
    expect(payload).toEqual(jwt.payload)
  })

  test('Should call TokenValidator.validate with correct values', async () => {
    const { sut } = makeSut()
    await sut.validate('any_token')
    expect(jwt.token).toBe('any_token')
    expect(jwt.secret).toBe(sut.secret)
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

  test('Should throw if jwt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'validate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.validate('any_token')
    await expect(promise).rejects.toThrow()
  })
})
