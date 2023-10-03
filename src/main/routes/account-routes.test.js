const request = require('supertest')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-connection-helper')
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
    const updatedAccount = Object.assign(
      {}, updateAccountForm,
      { id: accountId, firstName: 'Jane' }
    )
    const response = await request(app)
      .patch('/api/account')
      .send(updatedAccount)
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Sucesso ao atualizar')
  })

  test('Should return 400 if invalid credentials are provided', async () => {
    delete updateAccountForm._id
    for (const field of Object.keys(updateAccountForm)) {
      const response = await request(app)
        .patch('/api/account')
        .send(Object.assign(
          {}, updateAccountForm,
          { id: accountId, [field]: undefined }
        ))
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('Falha ao validar os campos')
      expect(response.body.detail[field]).toBeDefined()
    }
  })

  test('Should return 400 if email already exists', async () => {
    await userModel.insertOne({
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '5512987654321',
      email: 'jane@mail.com'
    })
    const updatedAccount = Object.assign(
      {}, updateAccountForm,
      { id: accountId, email: 'jane@mail.com' }
    )
    const response = await request(app)
      .patch('/api/account')
      .send(updatedAccount)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      message: 'Falha ao atualizar perfil',
      detail: {
        email: ['O email informado já existe']
      }
    })
  })
})
