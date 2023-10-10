module.exports = class MissingParamError extends Error {
  constructor (message, detail) {
    super(message)
    this.detail = detail
    this.name = 'MissingParamError'
  }
}
