const { InvalidParamError } = require('../errors/index')
const UpdateAccountValidator = require('./update-account-validator')

const updateAccountForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'test@mail.com'
}

const makeSut = () => {
  return new UpdateAccountValidator()
}

describe('UpdateAccount Validator', () => {
  test('Should throw if invalid params are provided', async () => {
    const sut = makeSut()
    const promise = sut.validate(Object.assign({}, updateAccountForm, { phone: undefined }))
    await expect(promise).rejects.toThrow(new InvalidParamError(
      'Erro ao validar os campos',
      { phone: ['O número de telefone é obrigatório'] }
    ))
  })

  test('Should call UpdateAccountValidator.validate with correct values', async () => {
    const sut = new UpdateAccountValidator()
    const validatorSpy = jest.spyOn(sut, 'validate')
    await sut.validate(updateAccountForm)
    expect(validatorSpy).toHaveBeenCalledWith(updateAccountForm)
  })

  test('Should return values if validate successfuly', async () => {
    const sut = makeSut()
    const result = await sut.validate(updateAccountForm)
    expect(result).toEqual(updateAccountForm)
  })
})
