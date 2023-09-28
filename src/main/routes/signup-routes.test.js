const request = require('supertest')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-connection-helper')
let userModel

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'test@mail.com',
  password: 'TestUpperLower1!',
  passwordConfirmation: 'TestUpperLower1!'
}

describe('SignUp Routes', () => {
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
    const response = await request(app)
      .post('/api/signup')
      .send(signUpForm)
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeDefined()
  })

  test('Should return 400 if no credentials are provided', async () => {
    await request(app)
      .post('/api/signup')
      .send({})
      .expect(400)
  })

  test('Should return 400 if invalid credentials are provided', async () => {
    await request(app)
      .post('/api/signin')
      .send(Object.assign({}, signUpForm, { password: undefined }))
      .expect(400)
  })

  test('Should return 400 if email already exists', async () => {
    await userModel.insertOne(signUpForm)
    await request(app)
      .post('/api/signup')
      .send(signUpForm)
      .expect(400)
  })
})
