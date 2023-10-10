const UpdateAccountUseCase = require('../../../../modules/account/domain/usecases/update')
const UpdateAccountRouter = require('../../../../modules/account/presentation/routers/update')
const UpdateAccountValidator = require('../../../../modules/@shared/utils/validators/update-account-validator')
const TokenValidator = require('../../../../modules/@shared/utils/helpers/token-validator')
const LoadUserByEmailRepository = require('../../../../modules/@shared/infrastructure/repositories/account/load-by-email')
const UpdateAccountRepository = require('../../../../modules/account/infrastructure/repositories/update')
const { tokenSecret } = require('../../../config/env')

module.exports = class UpdateAccountRouterComposer {
  static compose () {
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const updateAccountRepository = new UpdateAccountRepository()
    const updateAccountUseCase = new UpdateAccountUseCase({
      loadUserByEmailRepository,
      updateAccountRepository
    })
    const updateAccountValidator = new UpdateAccountValidator()
    const tokenValidator = new TokenValidator(tokenSecret)
    const updateAccountRouter = new UpdateAccountRouter({
      updateAccountUseCase,
      updateAccountValidator,
      tokenValidator
    })
    return updateAccountRouter
  }
}
