const { MissingParamError } = require('../utils/errors')

module.exports = class UpdateProfileUseCase {
  async update (userData = {}) {
    if (!userData.id) {
      throw new MissingParamError('id')
    }

    return true
  }
}
