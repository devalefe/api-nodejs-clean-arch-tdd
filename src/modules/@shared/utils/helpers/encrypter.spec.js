const bcrypt = require('bcrypt')
const MissingParamError = require('../errors/missing-param-error')
const Encrypter = require('./encrypter')

jest.mock('bcrypt', () => ({
  salt: 12,
  value: '',
  valueHashed: '',
  valueMatch: true,
  async hash (value, salt) {
    this.value = value
    this.salt = salt
    this.valueHashed = 'value_hashed'
    return this.valueHashed
  },
  async compare (value, hash) {
    this.value = value
    this.valueHashed = hash
    return this.valueMatch
  }
}))

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

  test('Should return hash if bcrypt returns hash', async () => {
    const salt = 10
    const sut = new Encrypter(salt)
    const valueHashed = await sut.hash('any_value')
    expect(valueHashed).toBe('value_hashed')
  })

  test('Should call bcrypt hash method with correct values', async () => {
    const salt = 10
    const sut = new Encrypter(salt)
    await sut.hash('any_value')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.salt).toBe(10)
  })

  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.compare('any_value', 'hashed_value')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.valueHashed).toBe('hashed_value')
  })

  test('Should thows if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hash'))
    expect(sut.hash()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.hash('any_value')).rejects.toThrow(new MissingParamError('salt'))
  })
})
