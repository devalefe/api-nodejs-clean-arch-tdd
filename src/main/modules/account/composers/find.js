const FindAccountUseCase = require('../../../../modules/account/domain/usecases/find')
const FindAccountRouter = require('../../../../modules/account/presentation/routers/find')
const LoadUserByIdRepository = require('../../../../modules/account/infrastructure/repositories/find')

module.exports = class FindAccountRouterComposer {
  static compose () {
    const loadUserByIdRepository = new LoadUserByIdRepository()
    const findAccountUseCase = new FindAccountUseCase({
      loadUserByIdRepository
    })
    const findAccountRouter = new FindAccountRouter({
      findAccountUseCase
    })
    return findAccountRouter
  }
}
