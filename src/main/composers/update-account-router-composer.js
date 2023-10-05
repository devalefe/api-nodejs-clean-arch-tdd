const UpdateAccountUseCase = require('../../domain/account/usecases/update')
const UpdateAccountValidator = require('../../utils/validators/update-account-validator')
const TokenValidator = require('../../utils/helpers/token-validator')
const UpdateAccountRouter = require('../../presentation/routers/update-account-router')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccountRepository = require('../../infra/repositories/update-account-repository')
const { tokenSecret } = require('../config/env')

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
