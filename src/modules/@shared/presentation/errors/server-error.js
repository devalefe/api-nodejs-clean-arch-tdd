module.exports = class ServerError extends Error {
  constructor (message, detail) {
    super(message)
    this.detail = detail
    this.name = 'ServerError'
  }
}
