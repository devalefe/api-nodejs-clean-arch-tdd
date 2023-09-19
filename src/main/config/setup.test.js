const request = require('supertest')
const app = require('./app')

describe('App Setup', () => {
  test('Should disable x-powered-by header', async () => {
    app.get('/x-powered-by', (req, res) => {
      res.send()
    })
    const response = await request(app).get('/x-powered-by')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })
})
