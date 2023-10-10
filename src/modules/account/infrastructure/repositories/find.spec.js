const LoadUserByIdRepository = require('./find')
const { MissingParamError } = require('../../../@shared/utils/errors')
const MongoHelper = require('../../../@shared/infrastructure/helpers/mongo-connection-helper')
let userModel

describe('LoadUserByID Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__, globalThis.__MONGO_DB_NAME__)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = () => {
    const sut = new LoadUserByIdRepository()
    return sut
  }

  test('Should return an user if user is found', async () => {
    const sut = makeSut()
    const { insertedId: id } = await userModel.insertOne({
      name: 'Any Name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    const result = await sut.load(id)
    expect(result).toEqual({
      id: id.toString(),
      name: 'Any Name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_id')
    expect(user).toBeNull()
  })

  test('Should throw if no id is provided', async () => {
    const sut = makeSut()
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
