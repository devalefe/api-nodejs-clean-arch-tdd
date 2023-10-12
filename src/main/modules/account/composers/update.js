const UpdateAccountUseCase = require('../../../../modules/account/domain/usecases/update')
const UpdateAccountRouter = require('../../../../modules/account/presentation/routers/update')
const UpdateAccountValidator = require('../../../../modules/@shared/utils/validators/update-account-validator')
const LoadUserByEmailRepository = require('../../../../modules/@shared/infrastructure/repositories/account/load-by-email')
const UpdateAccountRepository = require('../../../../modules/account/infrastructure/repositories/update')

module.exports = class UpdateAccountRouterComposer {
  static compose () {
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const updateAccountRepository = new UpdateAccountRepository()
    const updateAccountUseCase = new UpdateAccountUseCase({
      loadUserByEmailRepository,
      updateAccountRepository
    })
    const updateAccountValidator = new UpdateAccountValidator()
    const updateAccountRouter = new UpdateAccountRouter({
      updateAccountUseCase,
      updateAccountValidator
    })
    return updateAccountRouter
  }
}
