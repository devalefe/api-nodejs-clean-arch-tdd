const MissingParamError = require('../../utils/errors/missing-param-error')
const MongoHelper = require('../helpers/mongo-connection-helper')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__, globalThis.__MONGO_DB_NAME__)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = () => {
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepository(userModel)
    return {
      userModel,
      sut
    }
  }

  test('Should user access token with correct values', async () => {
    const { userModel, sut } = makeSut()
    const user = await userModel.insertOne({
      name: 'Any Name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    await sut.update(user.insertedId, 'valid_token')
    const updatedUser = await userModel.findOne({ _id: user.insertedId })
    expect(updatedUser.accessToken).toBe('valid_token')
  })

  test('Should throw if no userModel is provided', async () => {
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepository()
    const user = await userModel.insertOne({
      name: 'Any Name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    const promise = sut.update(user.insertedId, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no params are provided', async () => {
    const { userModel, sut } = makeSut()
    const user = await userModel.insertOne({
      name: 'Any Name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(user.insertedId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
