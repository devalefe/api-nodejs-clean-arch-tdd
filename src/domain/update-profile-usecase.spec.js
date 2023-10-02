const UpdateProfileUseCase = require('./update-profile-usecase')

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1'
}

describe('Update Profile UseCase', () => {
  test('Should return true if account has updated successfuly', async () => {
    const sut = new UpdateProfileUseCase()
    const result = await sut.update(signUpForm)
    expect(result).toBeTruthy()
  })
})
