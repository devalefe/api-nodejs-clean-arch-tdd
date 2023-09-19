const MissingParamError = require('../../utils/errors/missing-param-error')
const UpdateAccessTokenRepository = require('./update-access-token-repository')
const MongoHelper = require('../helpers/mongo-connection-helper')
let db

describe('UpdateAccessToken Repository', () => {
  let userId

  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__, globalThis.__MONGO_DB_NAME__)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    const userModel = db.collection('users')
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

  test('Should user access token with correct values', async () => {
    const sut = makeSut()
    await sut.update(userId, 'valid_token')
    const updatedUser = await db.collection('users').findOne({ _id: userId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(userId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
