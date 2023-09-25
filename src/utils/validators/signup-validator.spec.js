const InvalidParamError = require('../errors/invalid-param-error')
const SignUpValidator = require('./signup-validator')

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1'
}

describe('SignUp Validator', () => {
  test('Should throw if no firstName is provided', async () => {
    const validator = new SignUpValidator()
    signUpForm.firstName = undefined
    const promise = validator.validate(signUpForm)
    await expect(promise).rejects.toThrow(new InvalidParamError('firstName is a required field'))
  })
})
