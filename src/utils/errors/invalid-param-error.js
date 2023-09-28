module.exports = class InvalidParamError extends Error {
  constructor (message, detail) {
    super(message)
    this.detail = detail
    this.name = 'InvalidParamError'
  }
}
