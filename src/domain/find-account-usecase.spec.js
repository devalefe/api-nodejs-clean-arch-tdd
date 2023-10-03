class FindAccountUseCase {
  async find (accountId) {}
}

describe('ViewAccount Use Case', () => {
  test('Should call FindAccountUseCase.find with correct id', async () => {
    const sut = new FindAccountUseCase()
    const sutSpy = jest.spyOn(sut, 'find')
    await sut.find('any_id')
    expect(sutSpy).toHaveBeenCalledWith('any_id')
  })
})
