const { MissingParamError } = require('../utils/errors')

class FindAccountUseCase {
  async find (accountId) {
    if (!accountId) {
      throw new MissingParamError('accountId')
    }
  }
}

describe('ViewAccount Use Case', () => {
  test('Should call FindAccountUseCase.find with correct id', async () => {
    const sut = new FindAccountUseCase()
    const sutSpy = jest.spyOn(sut, 'find')
    await sut.find('any_id')
    expect(sutSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if no accountId is provided', async () => {
    const sut = new FindAccountUseCase()
    const promise = sut.find()
    await expect(promise).rejects.toThrow(new MissingParamError('accountId'))
  })
})
