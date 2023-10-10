const FindAccountUseCase = require('../../domain/usecases/account/find')
const LoadUserByIdRepository = require('../../infra/repositories/account/find')
const FindAccountRouter = require('../../presentation/routers/account/find')
const TokenValidator = require('../../utils/helpers/token-validator')
const { tokenSecret } = require('../config/env')

module.exports = class FindAccountRouterComposer {
  static compose () {
    const findAccountByIdRepository = new LoadUserByIdRepository()
    const findAccountUseCase = new FindAccountUseCase({
      findAccountByIdRepository
    })
    const tokenValidator = new TokenValidator(tokenSecret)
    const findAccountRouter = new FindAccountRouter({
      findAccountUseCase,
      tokenValidator
    })
    return findAccountRouter
  }
}
