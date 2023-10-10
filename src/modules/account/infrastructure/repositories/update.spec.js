const UpdateAccountRepository = require('./update')
const MongoHelper = require('../../../../infrastructure/helpers/mongo-connection-helper')
const { MissingParamError } = require('../../../../utils/errors')
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

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('accountId'))
    expect(sut.update(accountId)).rejects.toThrow(new MissingParamError('accountData'))
  })
})
