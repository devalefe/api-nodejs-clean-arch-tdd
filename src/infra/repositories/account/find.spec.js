const { MissingParamError } = require('../../../utils/errors')
const MongoHelper = require('../../helpers/mongo-connection-helper')
let userModel

class LoadUserByIdRepository {
  async load (id) {
    if (!id) {
      throw new MissingParamError('id')
    }
    const userModel = await MongoHelper.getCollection('users')
    const user = await userModel.findOne({ _id: id })
    if (user) {
      const parsedData = Object.assign({}, user, { id: user._id.toString() })
      delete parsedData._id
      return parsedData
    }
    return null
  }
}

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

  test('Should return an user if user is found', async () => {
    const sut = new LoadUserByIdRepository()
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
    const sut = new LoadUserByIdRepository()
    const user = await sut.load('invalid_id')
    expect(user).toBeNull()
  })

  test('Should throw if no id is provided', async () => {
    const sut = new LoadUserByIdRepository()
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
