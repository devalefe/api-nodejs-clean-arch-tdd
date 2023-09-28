module.exports = class UnauthorizedError extends Error {
  constructor (message, detail) {
    super(message)
    this.detail = detail
    this.name = 'UnauthorizedError'
  }
}
