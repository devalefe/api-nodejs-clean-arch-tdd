const { MissingParamError, InvalidParamError } = require('../../../utils/errors')

module.exports = class UpdateAccountUseCase {
  constructor ({
    loadUserByEmailRepository,
    updateAccountRepository
  } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.updateAccountRepository = updateAccountRepository
  }

  async update (accountId, accountData = {}) {
    if (!accountId) {
      throw new MissingParamError('id')
    }
    const accountLoaded = await this.loadUserByEmailRepository.load(accountData.email)
    if (accountLoaded && accountLoaded.id !== accountId) {
      throw new InvalidParamError(
        'Falha ao atualizar perfil',
        { email: ['O email informado já existe'] }
      )
    }
    const updatedAccount = await this.updateAccountRepository.update(accountId, accountData)
    return updatedAccount
  }
}
