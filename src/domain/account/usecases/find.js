const { MissingParamError } = require('../../../utils/errors')

module.exports = class FindAccountUseCase {
  constructor ({
    findAccountByIdRepository
  } = {}) {
    this.findAccountByIdRepository = findAccountByIdRepository
  }

  async find (accountId) {
    if (!accountId) {
      throw new MissingParamError('accountId')
    }
    const account = await this.findAccountByIdRepository.find(accountId)
    return account
  }
}
