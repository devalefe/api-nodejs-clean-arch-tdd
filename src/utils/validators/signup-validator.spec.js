const SignUpValidator = require('./signup-validator')

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1'
}

describe('SignUp Validator', () => {
  test('Should throw if invalid fields are provided', async () => {
    const validator = new SignUpValidator()
    const fields = Object.keys(signUpForm)
    for (const field of fields) {
      const message = await validator.validate(
        Object.assign({}, signUpForm, { [field]: undefined })
      )
      expect(message).toBe(`${field} is a required field`)
    }
  })

  test('Should call validator with correct values', async () => {
    const validator = new SignUpValidator()
    const validatorSpy = jest.spyOn(validator, 'validate')
    await validator.validate(signUpForm)
    expect(validatorSpy).toHaveBeenCalledWith(signUpForm)
  })

  test('Should return true if valid fields are provided', async () => {
    const validator = new SignUpValidator()
    const fields = await validator.validate(signUpForm)
    expect(fields).toEqual(signUpForm)
  })
})
