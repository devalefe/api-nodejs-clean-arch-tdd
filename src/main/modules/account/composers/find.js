const FindAccountUseCase = require('../../../../modules/account/domain/usecases/find')
const FindAccountRouter = require('../../../../modules/account/presentation/routers/find')
const LoadUserByIdRepository = require('../../../../infra/repositories/account/find')
const TokenValidator = require('../../../../utils/helpers/token-validator')
const { tokenSecret } = require('../../../config/env')

module.exports = class FindAccountRouterComposer {
  static compose () {
    const loadUserByIdRepository = new LoadUserByIdRepository()
    const findAccountUseCase = new FindAccountUseCase({
      loadUserByIdRepository
    })
    const tokenValidator = new TokenValidator(tokenSecret)
    const findAccountRouter = new FindAccountRouter({
      findAccountUseCase,
      tokenValidator
    })
    return findAccountRouter
  }
}
