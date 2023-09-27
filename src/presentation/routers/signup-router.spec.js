const { MissingParamError } = require('../../utils/errors')
const SignUpRouter = require('./signup-router')

describe('SignUp Router', () => {
  test('Should return 400 if no firstName is provided', async () => {
    const sut = new SignUpRouter()
    const httpRequest = {
      body: {
        firstName: undefined
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toBe(new MissingParamError('firstName').message)
  })
})
