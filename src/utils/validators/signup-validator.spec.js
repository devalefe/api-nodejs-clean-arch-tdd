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
  test('Should throw if invalid values are provided', async () => {
    const validator = new SignUpValidator()
    const promise = validator.validate()
    await expect(promise).rejects.toThrow(new InvalidParamError('firstName is a required field,lastName is a required field,phone is a required field,email is a required field,password is a required field'))
  })

  test('Should return true if valid values are provided', async () => {
    const validator = new SignUpValidator()
    const isValid = await validator.validate(signUpForm)
    expect(isValid).toBeTruthy()
  })
})
