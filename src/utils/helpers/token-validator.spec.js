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

class TokenValidator {
  async validate (token) {
    return jwt.verify(token)
  }
}

describe('Token Validator', () => {
  test('Should call TokenValidator.validate with correct token', async () => {
    const sut = new TokenValidator()
    await sut.validate('any_token')
    expect(jwt.token).toBe('any_token')
  })
})
