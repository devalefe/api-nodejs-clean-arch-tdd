const { MissingParamError } = require('../../../utils/errors')

module.exports = class FindAccountUseCase {
  constructor ({
    loadUserByIdRepository
  } = {}) {
    this.loadUserByIdRepository = loadUserByIdRepository
  }

  async find (accountId) {
    if (!accountId) {
      throw new MissingParamError('accountId')
    }
    const account = await this.loadUserByIdRepository.load(accountId)
    return account
  }
}
