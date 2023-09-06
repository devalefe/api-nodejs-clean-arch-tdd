module.exports = {
  token: 'any_token',

  sign (value, secret) {
    return this.token
  }
}
