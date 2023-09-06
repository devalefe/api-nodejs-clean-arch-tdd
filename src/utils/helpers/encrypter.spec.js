const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const valueMatch = await bcrypt.compare(value, hash)
    return valueMatch
  }
}

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const valueMatch = await sut.compare('any_value', 'hashed_value')
    expect(valueMatch).toBe(true)
  })

  test('Should return false if bcrypt returns false', async () => {
    const sut = new Encrypter()
    bcrypt.valueMatch = false
    const valueMatch = await sut.compare('any_value', 'hashed_value')
    expect(valueMatch).toBe(false)
  })
})
