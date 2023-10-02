const UpdateAccountRepository = require('./update-account-repository')
const MongoHelper = require('../helpers/mongo-connection-helper')
let userModel, accountId

const accountData = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'hashed_password'
}

describe('UpdateAccount Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__, globalThis.__MONGO_DB_NAME__)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    const { insertedId } = await userModel.insertOne(accountData)
    accountId = insertedId
  })

  afterEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = () => {
    return new UpdateAccountRepository()
  }

  test('Should update account with te given params', async () => {
    const sut = makeSut()
    const updatedAccount = Object.assign({}, accountData, { firstName: 'Jane' })
    await sut.update(accountId, updatedAccount)
    const account = await userModel.findOne({ _id: accountId })
    expect(account).toEqual(updatedAccount)
  })
})
