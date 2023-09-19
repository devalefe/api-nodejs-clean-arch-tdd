const request = require('supertest')

describe('App Setup', () => {
  let app

  beforeEach(() => {
    jest.resetModules()
    app = require('./app')
  })
  test('Should disable x-powered-by header', async () => {
    app.get('/test_x-powered-by', (req, res) => {
      res.send()
    })
    const response = await request(app).get('/test_x-powered-by')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })

  test('Should enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    const response = await request(app).get('/test_cors')
    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toBe('*')
    expect(response.headers['access-control-allow-headers']).toBe('*')
  })

  test('Should enable JSON Parser', async () => {
    app.post('/test_json', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_json')
      .send({ hello: 'world' })
      .expect({ hello: 'world' })
  })

  test('Should return content-type as JSON', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return content-type as XML if required', async () => {
    app.get('/test_content_type', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /xml/)
  })
})
