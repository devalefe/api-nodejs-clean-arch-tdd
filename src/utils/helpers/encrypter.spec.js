class Encrypter {
  async compare (password, hashedPassword) {
    return true
  }
}

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const passwordMatch = await sut.compare('any_password', 'hashed_password')
    expect(passwordMatch).toBe(true)
  })
})
