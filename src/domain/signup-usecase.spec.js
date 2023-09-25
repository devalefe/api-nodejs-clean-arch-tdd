const { MissingParamError } = require('../utils/errors')
const SignUpUseCase = require('./signup-usecase')

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1'
}

describe('SignUp UseCase', () => {
  test('Should throw if any field is missing', async () => {
    const sut = new SignUpUseCase()
    signUpForm.firstName = undefined
    const promise = sut.register(signUpForm)
    await expect(promise).rejects.toThrow(new MissingParamError('Missing param: firstName'))
  })
})
