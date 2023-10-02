const { MissingParamError, InvalidParamError } = require('../utils/errors')

module.exports = class UpdateAccountUseCase {
  constructor ({
    loadUserByEmailRepository
  } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async update (accountData = {}) {
    if (!accountData.id) {
      throw new MissingParamError('id')
    }
    const accountLoaded = await this.loadUserByEmailRepository.load(accountData.email)
    if (accountLoaded && accountLoaded._id !== accountData.id) {
      throw new InvalidParamError(
        'Falha ao atualizar perfil',
        { email: ['O email informado já existe'] }
      )
    }
    return true
  }
}
