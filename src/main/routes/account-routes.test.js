const request = require('supertest')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-connection-helper')
const { ObjectId } = require('mongodb')
let userModel, accountId

const updateAccountForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'example@mail.com'
}

describe('UpdateAccount Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__, globalThis.__MONGO_DB_NAME__)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    const { insertedId } = await userModel.insertOne(updateAccountForm)
    accountId = insertedId
  })

  afterEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return 200 if valid credentials are provided', async () => {
    let updatedAccount = Object.assign(
      {}, updateAccountForm,
      { id: accountId, firstName: 'Jane' }
    )
    delete updatedAccount._id
    const response = await request(app)
      .patch('/api/account')
      .send(updatedAccount)
    const account = await userModel.findOne({ _id: accountId })
    updatedAccount = Object.assign(
      {}, updatedAccount,
      { _id: new ObjectId(updatedAccount.id) }
    )
    delete updatedAccount.id
    expect(response.statusCode).toBe(200)
    expect(account).toEqual(updatedAccount)
  })
})
