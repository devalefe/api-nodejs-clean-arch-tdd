const request = require('supertest')
const app = require('../../config/app')
const MongoHelper = require('../../../modules/@shared/infrastructure/helpers/mongo-connection-helper')
const TokenGenerator = require('../../../modules/@shared/utils/helpers/token-generator')
const { tokenSecret } = require('../../config/env')
let userModel, authToken

const updateAccountForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'example@mail.com'
}

describe('Account Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__, globalThis.__MONGO_DB_NAME__)
    userModel = await MongoHelper.getCollection('users')
    const { insertedId } = await userModel.insertOne(updateAccountForm)
    const tokenGenerator = new TokenGenerator(tokenSecret)
    authToken = await tokenGenerator.generate(insertedId)
  })

  afterAll(async () => {
    await userModel.deleteMany()
    await MongoHelper.disconnect()
  })

  describe('UpdateAccount', () => {
    test('Should return 401 if no token is provided', async () => {
      const response = await request(app)
        .get('/api/account')
        // .auth(authToken, { type: 'bearer' })
        .send()
      expect(response.statusCode).toBe(401)
    })

    test('Should return 200 if valid credentials are provided', async () => {
      const updatedAccount = Object.assign(
        {}, updateAccountForm,
        { firstName: 'Jane' }
      )
      const response = await request(app)
        .put('/api/account')
        .auth(authToken, { type: 'bearer' })
        .send(updatedAccount)
      expect(response.statusCode).toBe(200)
      expect(response.body.message).toBe('Sucesso ao atualizar')
    })

    test('Should return 400 if invalid credentials are provided', async () => {
      delete updateAccountForm._id
      for (const field of Object.keys(updateAccountForm)) {
        const response = await request(app)
          .put('/api/account')
          .auth(authToken, { type: 'bearer' })
          .send(Object.assign(
            {}, updateAccountForm,
            { [field]: undefined }
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
        { email: 'jane@mail.com' }
      )
      const response = await request(app)
        .put('/api/account')
        .auth(authToken, { type: 'bearer' })
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

  describe('FindAccount Routes', () => {
    test('Should return 401 if no token is provided', async () => {
      const response = await request(app)
        .get('/api/account')
        // .auth(authToken, { type: 'bearer' })
        .send()
      expect(response.statusCode).toBe(401)
    })

    test('Should return 200 if valid credentials are provided', async () => {
      const response = await request(app)
        .get('/api/account')
        .auth(authToken, { type: 'bearer' })
        .send()
      expect(response.statusCode).toBe(200)
    })
  })
})
