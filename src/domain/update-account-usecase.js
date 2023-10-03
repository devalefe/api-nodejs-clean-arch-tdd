const { MissingParamError, InvalidParamError } = require('../utils/errors')

module.exports = class UpdateAccountUseCase {
  constructor ({
    loadUserByEmailRepository,
    updateAccountRepository
  } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.updateAccountRepository = updateAccountRepository
  }

  async update (accountData = {}) {
    if (!accountData.id) {
      throw new MissingParamError('id')
    }
    const accountLoaded = await this.loadUserByEmailRepository.load(accountData.email)
    if (accountLoaded && accountLoaded.id !== accountData.id) {
      throw new InvalidParamError(
        'Falha ao atualizar perfil',
        { email: ['O email informado já existe'] }
      )
    }
    const updatedAccount = await this.updateAccountRepository.update(accountData.id, accountData)
    return updatedAccount
  }
}
