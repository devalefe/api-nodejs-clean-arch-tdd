const { MissingParamError } = require('../utils/errors')
const UpdateProfileUseCase = require('./update-profile-usecase')

const signUpForm = {
  id: 'valid_id',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'TestUpperLower1'
}

const makeSut = () => {
  const sut = new UpdateProfileUseCase()
  return {
    sut
  }
}

describe('Update Profile UseCase', () => {
  test('Should return true if account has updated successfuly', async () => {
    const { sut } = makeSut()
    const result = await sut.update(signUpForm)
    expect(result).toBeTruthy()
  })

  test('Should call UpdateProfileUseCase.update with correct values', async () => {
    const { sut } = makeSut()
    const sutSpy = jest.spyOn(sut, 'update')
    await sut.update(signUpForm)
    expect(sutSpy).toHaveBeenCalledWith(signUpForm)
  })

  test('Should throw if no user id is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.update(Object.assign({}, signUpForm, { id: undefined }))
    await expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
