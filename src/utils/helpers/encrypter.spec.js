const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    const valueMatch = await sut.compare('any_value', 'hashed_value')
    expect(valueMatch).toBe(true)
  })

  test('Should return false if bcrypt returns false', async () => {
    const sut = makeSut()
    bcrypt.valueMatch = false
    const valueMatch = await sut.compare('any_value', 'hashed_value')
    expect(valueMatch).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.compare('any_value', 'hashed_value')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('hashed_value')
  })
})
