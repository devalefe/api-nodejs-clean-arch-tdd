const request = require('supertest')
const app = require('../config/app')
const bcrypt = require('bcrypt')
const MongoHelper = require('../../infra/helpers/mongo-connection-helper')
let userModel

describe('Login Routes', () => {
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

  test('Should return 200 if valid credentials are provided', async () => {
    await userModel.insertOne({
      name: 'Any Name',
      email: 'valid_email@mail.com',
      password: bcrypt.hashSync('hashed_password', 10)
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      })
      .expect(200)
  })
})
