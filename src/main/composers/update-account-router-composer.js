const UpdateAccountUseCase = require('../../domain/update-account-usecase')
const UpdateAccountValidator = require('../../utils/validators/update-account-validator')
const UpdateAccountRouter = require('../../presentation/routers/update-account-router')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccountRepository = require('../../infra/repositories/update-account-repository')

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
