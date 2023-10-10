const UpdateAccessTokenRepository = require('./update-access-token')
const { MissingParamError } = require('../../../@shared/utils/errors')
const MongoHelper = require('../../../@shared/infrastructure/helpers/mongo-connection-helper')
let userModel, userId

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__, globalThis.__MONGO_DB_NAME__)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    const user = await userModel.insertOne({
      name: 'Any Name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    userId = user.insertedId
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = () => {
    return new UpdateAccessTokenRepository()
  }

  test('Should update user with te given access token', async () => {
    const sut = makeSut()
    await sut.update(userId, 'valid_token')
    const updatedUser = await userModel.findOne({ _id: userId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(userId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
