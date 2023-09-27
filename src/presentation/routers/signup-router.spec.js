const SignUpRouter = require('./signup-router')

const makeSut = () => {
  const sut = new SignUpRouter()
  return {
    sut
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
  test('Should return 400 if no firstName is provided', async () => {
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
})
