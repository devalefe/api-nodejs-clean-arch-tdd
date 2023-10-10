const { MissingParamError } = require('../../../utils/errors')
const MongoHelper = require('../../helpers/mongo-connection-helper')
let userModel

class LoadUserByIdRepository {
  async load (id) {
    if (!id) {
      throw new MissingParamError('id')
    }
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

  test('Should throw if no id is provided', async () => {
    const sut = new LoadUserByIdRepository()
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
