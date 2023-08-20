class LoginRouter {
  route (httpResquest) {
    const { email, password } = httpResquest.body
    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const sut = new LoginRouter()
    const httpResquest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
  })

  test('Should return 400 if no password is provided', () => {
    const sut = new LoginRouter()
    const httpResquest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
