const CreateAccountRepository = require('./create')
const { MissingParamError } = require('../../../@shared/utils/errors')
const MongoHelper = require('../../../@shared/infrastructure/helpers/mongo-connection-helper')
let userModel

const accountData = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '+55 00 0000-0000',
  email: 'test@mail.com',
  password: 'hashed_password'
}

describe('CreateAccount Repository', () => {
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
    return new CreateAccountRepository()
  }

  test('Should create account with te given params', async () => {
    const sut = makeSut()
    const { insertedId } = await sut.create(accountData)
    const cretaedAccount = await userModel.findOne({ _id: insertedId })
    expect(insertedId).toBeTruthy()
    expect(cretaedAccount).toEqual(Object.assign({}, accountData, { _id: insertedId }))
  })

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.create()).rejects.toThrow(new MissingParamError('accountData'))
  })
})
