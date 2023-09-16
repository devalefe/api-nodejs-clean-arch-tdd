const { MongoClient } = require('mongodb')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
let connection, db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return {
    userModel,
    sut
  }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__)
    db = await connection.db(globalThis.__MONGO_DB_NAME__)
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await connection.close()
  })

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    const user = await userModel.insertOne({
      name: 'Any Name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
    const result = await sut.load('valid_email@mail.com')
    expect(result).toEqual({
      _id: user.insertedId,
      // name: 'Any Name',
      // email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })
})
