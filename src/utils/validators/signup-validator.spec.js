const { InvalidParamError } = require('../errors/index')
const SignUpValidator = require('./signup-validator')

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '55999999999',
  email: 'test@mail.com',
  password: 'TestUpperLower1!',
  passwordConfirmation: 'TestUpperLower1!'
}

const makeSut = () => {
  return new SignUpValidator()
}

describe('SignUp Validator', () => {
  test('Should throw if invalid params are provided', async () => {
    const sut = makeSut()
    const promise = sut.validate(signUpForm)
    await expect(promise).rejects.toThrow(new InvalidParamError({
      phone: [
        'O número de telefone é obrigatório'
      ]
    }))
  })
})
