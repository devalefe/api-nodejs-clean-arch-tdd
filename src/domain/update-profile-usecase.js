const { MissingParamError, InvalidParamError } = require('../utils/errors')

module.exports = class UpdateProfileUseCase {
  constructor ({
    loadUserByEmailRepository
  } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async update (profileData = {}) {
    if (!profileData.id) {
      throw new MissingParamError('id')
    }
    const profileLoaded = await this.loadUserByEmailRepository.load(profileData.email)
    if (profileLoaded && profileLoaded._id !== profileData.id) {
      throw new InvalidParamError(
        'Falha ao atualizar perfil',
        { email: ['O email informado já existe'] }
      )
    }
    return true
  }
}
