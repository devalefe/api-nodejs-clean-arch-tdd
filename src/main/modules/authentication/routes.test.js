const request = require('supertest')
const app = require('../../config/app')
const bcrypt = require('bcrypt')
const MongoHelper = require('../../../modules/@shared/infrastructure/helpers/mongo-connection-helper')
let userModel

const signUpForm = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '5512987654321',
  email: 'test@mail.com',
  password: 'TestUpperLower1!'
}

describe('Auth Routes', () => {
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

  describe('SignIn', () => {
    test('Should return 200 if valid credentials are provided', async () => {
      await userModel.insertOne({
        name: 'Any Name',
        email: 'valid_email@mail.com',
        password: bcrypt.hashSync('hashed_password', 10)
      })

      await request(app)
        .post('/api/signin')
        .send({
          email: 'valid_email@mail.com',
          password: 'hashed_password'
        })
        .expect(200)
    })

    test('Should return 401 if no credentials are provided', async () => {
      await request(app)
        .post('/api/signin')
        .send({})
        .expect(400)
    })

    test('Should return 401 if invalid credentials are provided', async () => {
      await request(app)
        .post('/api/signin')
        .send({
          email: 'valid_email@mail.com',
          password: 'hashed_password'
        })
        .expect(401)
    })
  })

  describe('SignUp', () => {
    test('Should return 200 if valid credentials are provided', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send(signUpForm)
      expect(response.statusCode).toBe(200)
      expect(response.body.accessToken).toBeDefined()
    })

    test('Should return 400 if no credentials are provided', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({})
      expect(response.statusCode).toBe(400)
      expect(response.body.detail).toEqual({
        firstName: ['O nome é obrigatório'],
        lastName: ['O sobrenome é obrigatório'],
        phone: ['O número de telefone é obrigatório'],
        email: ['O email é obrigatório'],
        password: ['A senha é obrigatória']
      })
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
})
